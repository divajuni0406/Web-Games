const Mongoose = require('mongoose')

var Schema = new Mongoose.Schema({
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    total_win: { type: Number },
    total_draw: { type: Number },
    total_lose: { type: Number }
})

const HistoryGameHeads = Mongoose.model('HistoryGameHeads', Schema)
module.exports = HistoryGameHeads