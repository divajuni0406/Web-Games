const express = require("express");
const Routes = express.Router();

const middleware = require("../controller/middleware");

Routes.post("/auth", middleware.auth);
Routes.get("/authorization", middleware.authPage);

module.exports = Routes;
