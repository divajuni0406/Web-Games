const Mongoose = require('mongoose')

var Schema = new Mongoose.Schema({
    username: {type: String,require: true},
    password: {type: String, require: true},
    email: {type: String,require: true},
})

const Users = Mongoose.model('Users', Schema)
module.exports = Users