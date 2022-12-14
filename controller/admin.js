const Profiles = require("../models/profile.js");
const Users = require("../models/users.js");
const Cryptr = require("cryptr");
const SecretKey = "secretKey";
const passConverter = new Cryptr(SecretKey);
const Mongoose = require("mongoose");
const ObjectId = Mongoose.Types.ObjectId;

exports.masterDataAdmin = (req, res) => {
  res.render("master-views/admin");
};

exports.updateViewAdmin = (req, res) => {
  res.render("updateDataAdmin");
};

// exports.addViewAdmin = (req, res) => {
//   res.render("addDataAdmin");
// };

exports.masterDataUser = (req, res) => {
  res.render("master-views/user");
};

exports.allHistoryUser = (req, res) => {
  res.render("allHistoryUser");
};

exports.getUserData = async (req, res) => {
  try {
    let userData = await Profiles.aggregate([
      { $match: { type_user: "user" } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
    ]);
    if (userData) {
      res.send({
        message: "Successfully to get user data",
        statusCode: "200",
        result: userData,
      });
    } else {
      res.status(401).send({ message: "Failed to get user data" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.getOneUserData = async (req, res) => {
  let userId = req.params.id;
  try {
    let userData = await Profiles.aggregate([
      { $match: { userId: ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userData",
        },
      },
    ]);
    if (userData) {
      res.send({
        message: "Successfully to get admin data",
        statusCode: "200",
        result: userData,
      });
    } else {
      res.status(401).send({ message: "Failed to get admin data" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.getAdminData = async (req, res) => {
  try {
    let adminData = await Profiles.aggregate([
      { $match: { type_user: "admin" } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "adminData",
        },
      },
    ]);

    if (adminData) {
      res.send({
        message: "Successfully to get admin data",
        statusCode: "200",
        result: adminData,
      });
    } else {
      res.status(401).send({ message: "Failed to get admin data" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.getOneAdminData = async (req, res) => {
  let userId = req.params.id;
  try {
    let adminData = await Profiles.aggregate([
      { $match: { userId: ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "adminData",
        },
      },
    ]);
    if (adminData) {
      res.send({
        message: "Successfully to get admin data",
        statusCode: "200",
        result: adminData,
      });
    } else {
      res.status(401).send({ message: "Failed to get admin data" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.updateAdminUser = async (req, res) => {
  let { first_name, last_name, full_name, username, email } = req.body;
  let userId = req.params.id;
  try {
    let profileUpdate = await Profiles.updateOne({ userId: ObjectId(userId) }, { $set: { first_name: first_name, last_name: last_name, full_name: full_name } });
    let userUpdate = await Users.updateOne({ _id: ObjectId(userId) }, { $set: { username: username, email: email } }); 
    if (req.body !== "") {
        res.send({
          message: `Successfull to Update Admin Data`,
          resultData: { profileUpdate, userUpdate },
          statusCode: 200
        });
        return;
      } else {
        res.status(400).send({
          message: `Failed to Update Admin Data`,
          statusCode: 400
        });
        return;
      }
  } catch (error) {
    console.log(error);
  }
};

exports.deleteAdminUser = async (req, res) => {
  let userId = req.params.id;
  try {
    let dataUsers = await Users.deleteOne({ _id: ObjectId(userId) });
    let dataProfiles = await Profiles.deleteOne({ userId: ObjectId(userId) });
    if (dataUsers && dataProfiles) {
      res.send({
        message: "Successfull to Delete Admin Data",
        statusCode: 200,
        data: { dataUsers, dataProfiles },
      });
    } else {
      res.status(400).send({
        message: "Something went wrong, please try again later.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

exports.addAdminUser = async (req, res) => {
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
      let type_user = "admin";
      const createProfile = await Profiles.create({ userId, first_name, last_name, full_name, age, date_of_birth, gender, address, type_user });
      res.send({
        message: `Successfull to add data admin`,
        resultData: { userCreate, createProfile },
        statusCode: 200,
      });
    }
    // create data Profile database with (foreign-key) end tags.
  } catch (error) {
    res.status(500).send(error.message);
  }
};
