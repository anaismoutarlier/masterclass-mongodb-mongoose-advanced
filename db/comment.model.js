const { Schema, model } = require("mongoose");

const CommentSchema = Schema(
  {
    content: String,
    post: { type: Schema.Types.ObjectId, ref: "posts" },
    user: { type: Schema.Types.ObjectId, ref: "users" },
  },
  {
    timestamps: true,
  }
);

module.exports = model("comments", CommentSchema);
