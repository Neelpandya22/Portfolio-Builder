const authMiddleware = (req, res, next) => {
  console.log("Auth Middleware Triggered");
  next();
};

export default authMiddleware;
