const express = require('express');
const Routes = express.Router();

const adminProccess = require('../controller/admin');
const middleware = require("../controller/middleware");

// get render
Routes.get('/master-data-admin', adminProccess.masterDataAdmin);
Routes.get('/allHistoryUser/:id', adminProccess.allHistoryUser);
Routes.get('/update-view-admin/:id', adminProccess.updateViewAdmin);
Routes.get('/master-data-user', adminProccess.masterDataUser);
// Routes.get('/add-view-admin', adminProccess.addViewAdmin);

// get data 
Routes.get('/fetch-data-admin', adminProccess.getAdminData);
Routes.get('/fetch-one-admin/:id', adminProccess.getOneAdminData);
Routes.get('/fetch-data-user', adminProccess.getUserData);
Routes.get('/fetch-data-user/:id', adminProccess.getOneUserData);

// del, put, post
Routes.delete('/delete-data-user/:id', adminProccess.deleteAdminUser);
Routes.put('/update-data-user/:id', adminProccess.updateAdminUser);
Routes.post('/add-data-user', adminProccess.addAdminUser);

module.exports = Routes;