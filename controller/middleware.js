const Routes = require("../routes/adminRoutes");
const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

exports.errorPage = (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
};

exports.authToken = async (req, res, next) => {
  let authHeader = req.headers["authorization"];
  let authToken = authHeader && authHeader.split(" ")[1];
  if (!authToken) {
    return res.send({ message: "Unauthorized" });
  }
  try {
    const user = await JWT.verify(authToken, process.env.JWT_TOKEN_SECRET);
    req.auth = user;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid Token" });
  }
};

exports.authUserType = async (req, res, next) => {
  let authHeader = req.headers["authorization"];
  let authToken = authHeader && authHeader.split(" ")[1];
  if (!authToken) {
    return res.send({ message: "Unauthorized" });
  }
  try {
    const user = await JWT.verify(authToken, process.env.JWT_TOKEN_SECRET);
    req.auth = user;
    if(req.auth.type_user === "admin") {
      next();
    } else {
      return res.status(401).send({ message: "Invalid Token" });
    }
  } catch (error) {
    return res.status(401).send({ message: "Invalid Token" });
  }
};

exports.auth = async (req, res, next) => {
  let token_bearer = req.headers.authorization;
  let authToken = token_bearer.split(" ");
  if (authToken[0].toLowerCase() !== "bearer") return res.status(400).send({ message: "Invalid token type" });
  JWT.verify(authToken[1], process.env.JWT_TOKEN_SECRET, (err, resultToken) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });
    if (resultToken) console.log(resultToken);
    res.send({
      message: "Successfull to get profile user",
      statusCode: 200,
      result: resultToken,
    });
  });
};