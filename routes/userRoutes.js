const express = require("express");
const Routes = express.Router();

const userProccess = require("../controller/user");
const middleware = require("../controller/middleware");

Routes.get("/", userProccess.home);
Routes.get("/login", userProccess.loginGet);
Routes.post("/loginData", userProccess.loginPost);
Routes.get("/profile", userProccess.tokenProfile);
Routes.get("/signup", userProccess.signUpGet);
Routes.post("/register", userProccess.register);

module.exports = Routes;