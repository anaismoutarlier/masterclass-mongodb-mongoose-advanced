const { Schema, model } = require("mongoose");

const PostSchema = Schema(
  {
    title: String,
    content: String,
    user: { type: Schema.Types.ObjectId, ref: "users" },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

PostSchema.virtual("comments", {
  ref: "comments",
  localField: "_id",
  foreignField: "post",
});

module.exports = model("posts", PostSchema);
