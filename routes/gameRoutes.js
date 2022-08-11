const express = require("express");
const Routes = express.Router();

const gameProccess = require("../controller/game");

Routes.get("/gamesuit", gameProccess.gameGet);
Routes.get("/history", gameProccess.history);
Routes.get("/history/:id", gameProccess.getHistoryUser);
Routes.post("/save", gameProccess.saveScore);

module.exports = Routes;