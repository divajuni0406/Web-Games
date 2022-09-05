const express = require("express");
const Routes = express.Router();

const gameProccess = require("../controller/game");
const middleware = require("../controller/middleware");

Routes.get("/gamesuit", middleware.authRender, gameProccess.gameGet);
Routes.get("/gamesuit-player", middleware.authRender, gameProccess.gamePlayer);
Routes.get("/history", middleware.authRender, gameProccess.history);
Routes.get("/history/:id", middleware.authApiGeneral, gameProccess.getHistoryUser);
Routes.post("/save", middleware.authApiGeneral, gameProccess.saveScore);

module.exports = Routes;
