// Import files
import { Action } from "../Action.js";
import { getCookie, eraseCookie } from "../cookies.js";
import { GameStart } from "../GameStart.js";

// Call function
const action = new Action();
const gameStart = new GameStart();

const socket = io();

socket.on("connect", () => {
  console.log("user connected");
});

let getUsername = window.localStorage.getItem("username");
let userLogin = JSON.parse(getCookie(`cookie-${getUsername}`));
let userId = userLogin.id;
let player2TextLose = document.querySelector("#player-2-text-lose");
let player1 = document.querySelector("#player1");
let player2 = document.querySelector("#player2");
let player2TextWin = document.querySelector("#player-2-text-win");
let playerTextLose = document.querySelector("#player-text-lose");
let playerTextWin = document.querySelector("#player-text-win");
let drawText = document.querySelector("#draw-result");
let roomCode = window.localStorage.getItem("code");
let roomCookie = JSON.parse(getCookie(`code-${roomCode}`));
let type_player = `Player ( ${roomCookie.player2} )`;
let timeLeft = 8;

player1.innerHTML = roomCookie.player1;
player2.innerHTML = roomCookie.player2;

socket.on("current-link", (link) => {
  if (link !== "http://localhost:3000/gamesuit-player") {
    player2.style.color = "red";
  } else {
    player2.style.color = "black";
  }
});

let player2Winner = 0;
let player2Lose = 0;
let playerWinner = 0;
let playerLose = 0;
let draw = 0;
let player2Pick = "";

// Random Pick Manipulation Computer
const randomManipulation = () => {
  let comBrain = ["rock", "scissors", "paper"];
  let i = 0;
  let countArray = comBrain.length;
  let startDateTime = new Date().getTime();
  setInterval(() => {
    if (new Date().getTime() - startDateTime > 3000) {
      clearInterval;
      return;
    }
    action.removeClassActive();
    if (i === countArray) {
      i = 0;
    }

    let element = document.getElementById(comBrain[i]);
    element.classList.add("active");
    i++;
  }, 100);
};

socket.on("player-one-pick", (playerPick) => {
  let player1Pick = gameStart.getPlayerPick();
  player2Pick = playerPick;

  if (player1Pick != undefined) {
    resultPick(player1Pick, async (payload) => {
      playerTextWin.innerHTML = playerWinner;
      playerTextLose.innerHTML = playerLose;
      player2TextWin.innerHTML = player2Winner;
      player2TextLose.innerHTML = player2Lose;
      drawText.innerHTML = draw;
      playerTextWin.style.color = "white";
      playerTextLose.style.color = "white";
      player2TextWin.style.color = "white";
      player2TextLose.style.color = "white";
      drawText.style.color = "white";
      player2Pick = "";

      await saveScore(payload);
    });
  }
});

// Human Option and Main Function
function pick(playerOption) {
  gameStart.playerOption(playerOption);
  action.buttonDisabled();
  let playerOptionElement = document.getElementById(playerOption + "-p");
  playerOptionElement.classList.add("activePlayer");

  socket.emit("player-one-pick", gameStart.getPlayerPick());
  if (player2Pick != "") {
    resultPick(playerOption, async (payload) => {
      playerTextWin.innerHTML = playerWinner;
      playerTextLose.innerHTML = playerLose;
      player2TextWin.innerHTML = player2Winner;
      player2TextLose.innerHTML = player2Lose;
      drawText.innerHTML = draw;
      playerTextWin.style.color = "white";
      playerTextLose.style.color = "white";
      player2TextWin.style.color = "white";
      player2TextLose.style.color = "white";
      drawText.style.color = "white";

      await saveScore(payload);
    });
  }
}

function resultPick(playerOption, callback) {
  randomManipulation();
  let textElement = document.getElementById("textVS");
  textElement.innerHTML = "Loading...";
  textElement.classList.add("active-text-win");

  setTimeout(function () {
    let payload = {
      win: 0,
      lose: 0,
      draw: 0,
    };
    action.removeClassActive();

    let player2OptionsElement = document.getElementById(player2Pick);
    const finalResult = gameStart.winner2Player(playerOption, player2Pick);
    player2OptionsElement.classList.add("active");

    let textElement = document.getElementById("textVS");
    textElement.innerHTML = finalResult == "PLAYER1 WIN" ? "YOU WIN" : finalResult == "PLAYER2 WIN" ? "YOU LOSE" : "DRAW";
    let resultCss = finalResult == "PLAYER1 WIN" ? "active-text-win1" : finalResult == "PLAYER2 WIN" ? "active-text-lose1" : "active-text-win1";
    textElement.classList.add(resultCss);

    switch (finalResult) {
      case "DRAW":
        draw++;
        payload.draw++;
        break;
      case "PLAYER1 WIN":
        playerWinner++;
        payload.win++;
        player2Lose++;
        break;
      case "PLAYER2 WIN":
        player2Winner++;
        payload.lose++;
        playerLose++;
        break;
    }

    callback(payload);
  }, 3000);
}

// Add Onclick of PlayerChoice
const playerOption = document.querySelectorAll(".playerChoice button");
playerOption.forEach((value) => {
  document.querySelector("." + value.classList[2]).onclick = () => {
    pick(value.classList[2]);
  };
});

async function saveScore(payload) {
  try {
    await fetch("http://localhost:3000/save", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userLogin.token}`,
      },
      body: JSON.stringify({
        userId: userId,
        win: payload.win,
        lose: payload.lose,
        draw: payload.draw,
        type_player,
      }),
    });
    countdown();
  } catch (error) {
    console.log(error);
  }
}

const countdown = () => {
  timeLeft--;
  if (timeLeft > 0) {
    setTimeout(countdown, 1000);
  } else {
    let textElement = document.getElementById("textVS");
    textElement.classList.remove("active-text-win1");
    textElement.classList.remove("active-text-lose1");
    gameStart.playerOption(undefined);
    player2Pick = "";
    action.removeClassActive();
    action.removeClassActiveUser();
    action.resetButton();
    timeLeft = 8;
  }
};
