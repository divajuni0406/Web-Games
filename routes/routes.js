const express = require("express");
// how to call router function
const Routes = express.Router();
// import proccess from controller
const userProccess = require("../controller/user");
const gameProccess = require("../controller/game");
const middleProccess = require("../controller/middleware");

// this is for place the router that we have before inside app.js, so that it looks more tidy, but we have to convert
// which is from app.get to Routes.get, according to the name of variable that we have above
Routes.get("/", userProccess.home);
Routes.get("/login", userProccess.loginGet);
Routes.get("/signup", userProccess.signUpGet);
Routes.post("/register", userProccess.register);
Routes.post("/login", userProccess.loginPost);
Routes.get("/profile", userProccess.tokenProfile);

Routes.get("/gamesuit", gameProccess.gameGet);
Routes.get("/history", gameProccess.history);
// Routes.get("/topScore", gameProccess.getTopScore);
Routes.get("/history-game/:id", gameProccess.getHistoryUser);
Routes.post("/save", gameProccess.saveScore);

//CRUD ADMIN
Routes.get("/userData", userProccess.getUserData);
Routes.get("/fetch-data-admin", userProccess.getAdminData);
Routes.get("/fetch-data-user", userProccess.getUserData);
Routes.get("/master-data-admin", userProccess.masterDataAdmin);
Routes.get("/add-view-admin", userProccess.addViewAdmin);
Routes.get("/update-view-admin", userProccess.updateViewAdmin);
Routes.get("/master-data-user", userProccess.masterDataUser);

Routes.delete("/delete-data-user", userProccess.deleteAdminUser);
Routes.put("/update-data-user", userProccess.updateAdminUser);
Routes.post("/add-data-user", userProccess.addAdminUser);


Routes.use("/", middleProccess.errorPage);
// then exported
module.exports = Routes;
