const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
const apiDocumentation = require("./API-Documentation.json");

const morgan = require("morgan");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const crypto = require("crypto");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocumentation));

app.use(cors());

const middleware = require("./routes/middleware");
const adminRoutes = require("./routes/adminRoutes");
const gameRoutes = require("./routes/gameRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config({ path: "./config/.env" });

app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(middleware);
app.use(adminRoutes);
app.use(gameRoutes);
app.use(userRoutes);

io.on("connection", (socket) => {
  console.log("Socket is connected");
  let userCookie = {};
  let splitUser = socket.handshake.headers.cookie;
  let regex = /cookie-([\s\S]*)$/;

  if (splitUser != undefined) {
    splitUser = regex.exec(splitUser);
  }
  socket.broadcast.emit("current-link", socket.handshake.headers.referer);
  if (splitUser != undefined && splitUser[1] != undefined) {
    splitUser = splitUser[1].split("=");
    let objectUser = splitUser[1].split(" ");
    userCookie = JSON.parse(objectUser[0].replace(";", ""));
    socket.broadcast.emit("user-has-connected", userCookie.username);
    console.log(`${userCookie.username} connected !!`);
  }

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-has-disconnected", userCookie.username);
    socket.broadcast.emit("current-link", "http://localhost:3000");
    console.log(`${userCookie.username} disconnected !!`);
  });

  socket.on("close-room", (roomCode) => {
    socket.broadcast.emit("player-close-room", roomCode);
    console.log("close room number : " + roomCode);
  });

  socket.on("player-2-ready", (roomCode, username) => {
    socket.broadcast.emit("player-2-ready", roomCode, username);
  });

  socket.on("game-ready", (username) => {
    socket.broadcast.emit(`game-ready`, username);
  });

  socket.on("room-code-not-define", (message) => {
    socket.broadcast.emit(`room-code-not-define`, message);
  });

  socket.on("player-one-pick", (playerPick) => {
    socket.broadcast.emit(`player-one-pick`, playerPick);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const ConnectionMongoDB = require("./config/connection");
ConnectionMongoDB();

// random token
// let token = crypto.randomBytes(64).toString("hex");
// console.log(token);
