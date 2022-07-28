const Mongoose = require('mongoose')

var Schema = new Mongoose.Schema({
    historyGameHeadId: { type: String, require: true },
    win: { type: Number },
    draw: { type: Number },
    lose: { type: Number },
    type_player: { type: String },
    level: { type: Number },
    date_time: { type: Date }
})

const HistoryGameDetails = Mongoose.model('HistoryGameDetails', Schema);
module.exports = HistoryGameDetails;