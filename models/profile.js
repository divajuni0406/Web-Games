const Mongoose = require("mongoose");
var Schema = new Mongoose.Schema({
  userId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  first_name: { type: String },
  last_name: { type: String },
  full_name: { type: String },
  age: { type: Number },
  date_of_birth: { type: String },
  gender: { type: String },
  address: { type: String },
  type_user: { type: String },
});

const Profiles = Mongoose.model("Profiles", Schema);
module.exports = Profiles;
