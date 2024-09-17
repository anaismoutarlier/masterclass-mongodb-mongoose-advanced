const { Router } = require("express");
const { User } = require("../db");

const router = Router();

// NOT TO BE DONE IN PRODUCTION ENVIRONMENT
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  console.log({ ...user });

  res.json({ result: true, user });
});

module.exports = router;
