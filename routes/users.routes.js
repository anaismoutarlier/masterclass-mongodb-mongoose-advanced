const { Router } = require("express");
const { User } = require("../db");
const { authenticate } = require("../middleware/authenticate");
const router = Router();

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByEmailWithAuth(email);
  console.log(user);
  if (user.password !== password)
    return res.status(401).json({ result: false, error: "Unauthorized" });
  res.json({ result: true });
  // 2. verify password
});

router.get("/byCreationMonth", async (req, res) => {
  const data = await User.getUsersByCreationMonth();
  res.json({ result: true, data });
});

// NOT TO BE DONE IN PRODUCTION ENVIRONMENT
router.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  console.log({ ...user });

  res.json({ result: true, user });
});

router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const data = await User.deleteOne({ _id: id });
  res.json({ result: true, ...data });
});

module.exports = router;
