const { Router } = require("express");
const { Post } = require("../db");

const router = Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findOne({ _id: id });
  //   console.log(post, post.comments);

  res.json({ result: true, post });
});
module.exports = router;
