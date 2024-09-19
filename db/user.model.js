const mongoose = require("mongoose");
const moment = require("moment");

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      select: false,
      validate: {
        validator: val => EMAIL_REGEX.test(val),
        message: ({ value }) => `${value} is not a valid email address.`,
      },
    },
    password: {
      type: String,
      select: false,
      //this = document
      required: () => this.status !== "pending",
    },
    type: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    gender: {
      type: String,
      enum: ["male", "female", "non-binary"],
    },
    status: {
      type: String,
      enum: ["pending", "active", "nonactive"],
      default: "pending",
    },
    birthdate: Date,
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

UserSchema.virtual("age").get(function () {
  if (!this.birthdate) return null;
  //this = document
  return moment().diff(this.birthdate, "years");
});

UserSchema.pre("deleteOne", function (next) {
  const userId = this.getFilter()._id;

  if (!userId)
    throw new Error(
      "Deletion of user data must be based on valid MongoDB ObjectId."
    );
  next();
});

UserSchema.post("deleteOne", async function () {
  // this = request / query
  console.log("User is deleted. Middleware active.");
  console.log(this.getFilter());
  const userId = this.getFilter()._id;
  await Promise.all([
    mongoose.model("posts").deleteMany({ user: userId }),
    mongoose.model("comments").deleteMany({ user: userId }),
  ]);
});

UserSchema.loadClass(
  class {
    static findByEmailWithAuth(email) {
      // this = model
      return this.findOne({ email }).select("+email +password");
    }

    static findActive(filter = {}) {
      return this.find({ ...filter, status: "active" });
    }

    static getUsersByCreationMonth() {
      const query = [
        {
          $addFields: {
            year: {
              $year: "$createdAt",
            },
            month: {
              $month: "$createdAt",
            },
          },
        },
        {
          $group: {
            _id: {
              year: "$year",
              month: "$month",
            },
            users: {
              $push: {
                _id: "$_id",
                username: "$username",
              },
            },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
        {
          $project: {
            year: "$_id.year",
            month: "$_id.month",
            _id: 0,
            users: 1,
            nbUsers: {
              $size: "$users",
            },
          },
        },
      ];

      return this.aggregate(query);
    }
  }
);

module.exports = mongoose.model("users", UserSchema);
