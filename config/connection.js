const Mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await Mongoose.connect(`${process.env.MONGO_URI}`, {
      useNewUrlParser: true,
      useUniFiedTopology: true,
    });
    // const connAtlas = await Mongoose.connect("mongodb+srv://divajuni0406:divajuni17103044@cluster0.zt1iy.mongodb.net/game_suit?retryWrites=true&w=majority", {
    //   useNewUrlParser: true,
    //   useUniFiedTopology: true,
    // });
    console.log(`MongoDb Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;