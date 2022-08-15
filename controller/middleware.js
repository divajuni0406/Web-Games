const JWT = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const permissionAdminPath = ["/master-data-admin", "/master-data-user"];

exports.authPage = (req, res) => {
  res.render("auth")
}

exports.errorPage = (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
};

exports.authRender = async (req, res, next) => {
  let authCookies = req.headers["cookie"];
  let regex = /cookie-([\s\S]*)$/;
  authCookies = regex.exec(authCookies);

  try {
    if (authCookies == null && !authCookies[1]) {
      return res.redirect("/authorization");
    }

    authCookies = authCookies[1].split("=");
    authCookies = authCookies[1].split(" ");
    let cookie = JSON.parse(authCookies[0].replace(";", ""));

    if (!cookie.token) {
      return res.redirect("/authorization");
    } else if (permissionAdminPath.includes(req.path) && cookie.type_user != "admin") {
      return res.redirect("/authorization");
    }
    return next();
  } catch (error) {
    console.log(error);
    return res.redirect("/authorization");
  }
};

exports.authApiGeneral = async (req, res, next) => {
  let authHeader = req.headers["authorization"];
  let authToken = authHeader && authHeader.split(" ")[1];
  if (!authToken) {
    return res.redirect("/authorization");
  }
  try {
    let user = await JWT.verify(authToken, process.env.JWT_TOKEN_SECRET);
    if(user.type_user === "user" || user.type_user === "admin"){
      return next();
    } else {
      return res.redirect("/authorization");
    }
  } catch (error) {
    return res.status(401).send({ message: "Invalid Token" });
  }
};

exports.authApiAdmin = async (req, res, next) => {
  let authHeader = req.headers["authorization"];
  let authToken = authHeader && authHeader.split(" ")[1];
  if (!authToken) {
    return res.redirect("/authorization");
  }
  try {
    let authApi = await JWT.verify(authToken, process.env.JWT_TOKEN_SECRET);
    if (authApi.type_user == "admin") {
       return next();
    }
    return res.redirect("/authorization");
  } catch (error) {
    return res.redirect("/authorization");
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
