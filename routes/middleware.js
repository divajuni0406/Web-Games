const express = require("express");
const Routes = express.Router();

const middleware = require("../controller/middleware");

Routes.get("/authUserType", middleware.authUserType);
Routes.get("/auth", middleware.auth);

module.exports = Routes;
