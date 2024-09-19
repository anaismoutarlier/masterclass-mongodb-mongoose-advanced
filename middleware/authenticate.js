const authenticate = (req, res, next) => {
  const authorization = req.headers["authorization"];
  console.log(!authorization, authorization);
  if (!authorization)
    return res.status(401).json({ result: false, error: "Unauthorized" });
  const [type, token] = authorization.split(" ");
  if (type !== "Bearer" || !/[0-9a-zA-Z]{5}/.test(token))
    return res.status(401).json({ result: false, error: "Unauthorized" });
  next();
};

module.exports = { authenticate };
