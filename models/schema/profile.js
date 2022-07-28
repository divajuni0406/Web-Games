const Mongoose = require('mongoose')

var Schema = new Mongoose.Schema({
    userId: { type: String, require: true },
    first_name: { type: String },
    last_name: { type: String },
    fullname: { type: String },
    age: { type: Number },
    date_of_birth: { type: String },
    gender: { type: String },
    address: { type: String },
})

const Profiles = Mongoose.model('Profiles', Schema)
module.exports = Profiles