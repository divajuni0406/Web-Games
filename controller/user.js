const Profiles = require("../models/profile.js");
const Users = require("../models/users.js");
const Cryptr = require("cryptr");
const SecretKey = "secretKey";
const passConverter = new Cryptr(SecretKey);
const JWT = require("jsonwebtoken");
// const Mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });


exports.loginGet = (req, res) => {
  res.render("login");
};

exports.home = (req, res) => {
  res.render("index");
};

exports.signUpGet = (req, res) => {
  res.render("signup");
};

exports.loginPost = async (req, res) => {
  const { username, password } = req.body;
  let findUser = await Users.findOne({ username });
  if (!findUser) {
    res.status(400).send({ message: "Failed to login. Invalid Username or Password", statusCode: 400 });
  } else {
    try {
      let getProfile = await Profiles.findOne({ userId: findUser.id });
      if (passConverter.decrypt(findUser.password) === password) {
        let createToken = JWT.sign(
          {
            id: findUser._id,
            username: findUser.username,
            email: findUser.email,
            type_user: getProfile.type_user,
          },
          process.env.JWT_TOKEN_SECRET, {expiresIn:"1d"}
        );
        res.send({
          message: `Welcome ${findUser.username}`,
          sendData: {
            id: findUser.id,
            username: findUser.username,
            email: findUser.email,
            token: createToken,
            type_user: getProfile.type_user,
          },
          statusCode: 200,
        });
      } else {
        res.status(400).send({ message: "Failed to login. Invalid Username or Password", statusCode: 400 });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send(error.message);
    }
  }
};

// to create database user
exports.register = async (req, res) => {
  let { username, password, email } = req.body;
  try {
    let findUsername = await Users.findOne({ username });
    let findEmail = await Users.findOne({ email });
    if (findUsername || findEmail) {
      res.status(400).send({
        message: `Sorry the email or username has been taken, please create the other one !`,
        statusCode: 400,
      });
    } else {
      const userCreate = await Users.create({ username, password: passConverter.encrypt(password), email });
      // create data Profile database with (foreign-key)
      let { first_name, last_name, full_name, age, date_of_birth, gender, address } = req.body;
      let userId = userCreate.id;
      let type_user = "user";
      const createProfile = await Profiles.create({ userId, first_name, last_name, full_name, age, date_of_birth, gender, address, type_user });
      res.send({
        message: `Successfull to register your account`,
        resultData: { userCreate, createProfile },
        statusCode: 200,
      });
    }
    // create data Profile database with (foreign-key) end tags.
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// check user profile from jwt token 
exports.tokenProfile = async (req, res) => {
  let token_bearer = req.headers.authorization;
  let authToken = token_bearer.split(" ");
  if (authToken[0].toLowerCase() !== "bearer") return res.status(400).send({ message: "Invalid token type" });
  JWT.verify(authToken[1], process.env.JWT_TOKEN_SECRET, (err, resultToken) => {
    if (err) return res.status(401).send({ message: "Unauthorized" });
    if (resultToken) console.log(resultToken);
    res.send({
      message: "Successfull to get profile user",
      statusCode: 200,
      result: resultToken,
    });
  });
};