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

module.exports = mongoose.model("users", UserSchema);
