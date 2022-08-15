const HistoryGameHeads = require("../models/historyGameHeads.js");
const HistoryGameDetails = require("../models/historyGameDetails.js");
const Mongoose = require("mongoose");
const ObjectId = Mongoose.Types.ObjectId;

exports.gameGet = (req, res) => {
  res.render("gamesuit");
};

exports.gamePlayer = (req, res) => {
  res.render("gamesuit2Player");
};

exports.history = (req, res) => {
  res.render("history");
};

exports.getHistoryUser = async (req, res) => {
  let userId = req.params.id;
  try {
    //   let getScore = await HistoryGameHeads.aggregate([
    //     { $match: { 'userId': userId } },
    //     {
    //         $lookup: {
    //             from: 'historygamedetails',
    //             localField: 'userId', // userId from history above
    //             foreignField: 'historyGameHeadId', //foreign key from lookup.from
    //             as: 'score_history'
    //         }
    //       }

    // ])
    
    let getScore = await HistoryGameHeads.aggregate([
      { $match: { userId: ObjectId(userId) } },
      {
        $lookup: {
          from: "historygamedetails",
          let: {
            // this is needed, so we can use it in
            // the $match stage below
            teamName: "$userId",
          },
          pipeline: [
            {
              $sort: {
                date_time: -1,
              },
            },
            {
              $match: {
                $expr: {
                  $eq: ["$historyGameHeadId", "$$teamName"],
                },
              },
            },
          ],
          as: "score_games",
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId', // userId from history above
          foreignField: '_id', //foreign key from lookup.from
          as: 'user'
        }
      },
    ]);
    res.send({
      message: "Successfull to get total game score !",
      statusCode: 200,
      resultData: getScore,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

// exports.getTopScore = async (req, res) => {
//   try {
//     let response = await HistoryGameHeads.findAll({
//       include: ['Users'],
//       order: [
//         ['total_win', 'DESC' ]
//       ],
//     })

//     res.send({
//       message: "Successfull to update total game score !",
//       statusCode: 200,
//       resultData: { response},
//     });

//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error.message);
//   }
// };

exports.saveScore = async (req, res) => {
  let { userId, win, lose, draw, type_player } = req.body;
  let historyGameHead = { userId: userId, total_win: win, total_lose: lose, total_draw: draw };
  let historyGameDetail = { historyGameHeadId: userId, win, lose, draw, type_player, date_time: Date.now() };
  let historyDetail = await HistoryGameDetails.create(historyGameDetail);
  try {
    let historyHeads = await HistoryGameHeads.findOne({ userId: userId });

    if (!historyHeads) {
      historyHeads = await HistoryGameHeads.create(historyGameHead);
      res.send({
        message: "Successfull to create total game score !",
        statusCode: 200,
        resultData: { historyHeads, historyDetail },
      });
    } else {
      historyHeads.total_win += win;
      historyHeads.total_lose += lose;
      historyHeads.total_draw += draw;
      let updateTotalScore = await HistoryGameHeads.findOneAndUpdate({ userId: userId }, historyHeads);
      res.send({ statusCode: 200, resultData: { updateTotalScore, historyDetail }, message: "successfull to save game score !" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};
