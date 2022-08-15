const express = require("express");
const Routes = express.Router();

const adminProccess = require("../controller/admin");
const middleware = require("../controller/middleware");

// get render
Routes.get("/master-data-admin", middleware.authRender, adminProccess.masterDataAdmin);
Routes.get("/update-view-admin/:id", middleware.authApiAdmin, adminProccess.updateViewAdmin);
Routes.get("/allHistoryUser/:id", middleware.authApiAdmin, adminProccess.allHistoryUser);
Routes.get("/master-data-user", middleware.authRender, adminProccess.masterDataUser);
// Routes.get('/add-view-admin', adminProccess.addViewAdmin);

// get data
Routes.get("/fetch-data-admin", middleware.authApiAdmin, adminProccess.getAdminData);
Routes.get("/fetch-one-admin/:id", middleware.authApiAdmin, adminProccess.getOneAdminData);
Routes.get("/fetch-data-user", middleware.authApiAdmin, adminProccess.getUserData);
Routes.get("/fetch-data-user/:id", middleware.authApiAdmin, adminProccess.getOneUserData);

// del, put, post
Routes.delete("/delete-data-admin/:id", middleware.authApiAdmin, adminProccess.deleteAdminUser);
Routes.put("/update-data-admin/:id", middleware.authApiAdmin, adminProccess.updateAdminUser);
Routes.post("/add-data-admin", middleware.authApiAdmin, adminProccess.addAdminUser);

module.exports = Routes;
