const express = require("express");
// how to call router function
const Routes = express.Router();
// import proccess from controller
const userProccess = require("../controller/user");
const gameProccess = require("../controller/game");
const adminProccess = require("../controller/admin");
const middleProccess = require("../controller/middleware");

// render
Routes.get("/", userProccess.home);
Routes.get("/login", userProccess.loginGet);
Routes.get("/signup", userProccess.signUpGet);
Routes.post("/register", userProccess.register);
Routes.post("/login", userProccess.loginPost);
Routes.get("/gamesuit", gameProccess.gameGet);
Routes.get("/history", gameProccess.history);
Routes.get("/history/:id", gameProccess.getHistoryUser);
// Routes.get("/topScore", gameProccess.getTopScore);

//others
Routes.get("/profile", userProccess.tokenProfile);
Routes.post("/save", gameProccess.saveScore);

//CRUD ADMIN
// get fetch 
Routes.get("/fetch-data-admin", adminProccess.getAdminData);
Routes.get("/fetch-one-admin/:id", adminProccess.getOneAdminData);
Routes.get("/fetch-data-user", adminProccess.getUserData);
Routes.get("/fetch-data-user/:id", adminProccess.getOneUserData);

// get render
Routes.get("/allHistoryUser/:id", adminProccess.allHistoryUser);
Routes.get("/master-data-admin", adminProccess.masterDataAdmin);
Routes.get("/update-view-admin/:id", adminProccess.updateViewAdmin);
Routes.get("/master-data-user", adminProccess.masterDataUser);
// Routes.get("/add-view-admin", adminProccess.addViewAdmin);

// del, put, post
Routes.delete("/delete-data-user/:id", adminProccess.deleteAdminUser);
Routes.put("/update-data-user/:id", adminProccess.updateAdminUser);
Routes.post("/add-data-user", adminProccess.addAdminUser);


Routes.use("/", middleProccess.errorPage);
// then exported
module.exports = Routes;
