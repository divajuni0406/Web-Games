const dotenv = require("dotenv");
const express = require("express");
// call morgan
const morgan = require("morgan");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const crypto = require('crypto');

const adminRoutes = require("./routes/adminRoutes");
const gameRoutes = require("./routes/gameRoutes");
const userRoutes = require("./routes/userRoutes");
const middleware = require("./routes/middleware");

dotenv.config({ path: "./config/.env" });

app.set("view engine", "ejs");
// app.use(expressLayouts);
app.use(morgan("dev"));
app.use(express.static("public"));

// this is to call the function of json in express so that can accept file type of json from thunder plugin or front end
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(adminRoutes);
app.use(gameRoutes);
app.use(userRoutes);
app.use(middleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const ConnectionMongoDB = require("./config/connection");
ConnectionMongoDB();

// random token 
let token = crypto.randomBytes(64).toString('hex');
console.log(token)
