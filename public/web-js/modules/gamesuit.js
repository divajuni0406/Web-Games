// Import files
import { GameStart } from "../GameStart.js";
import { Action } from "../Action.js";
import { getCookie, eraseCookie } from "../cookies.js";

// Call function
const action = new Action();
const gameStart = new GameStart();

const socket = io();

socket.on('connect', () => {
  console.log('user connected')
})
let getUsername = window.localStorage.getItem("username");
let userLogin = JSON.parse(getCookie(`cookie-${getUsername}`));
let userId = userLogin.id;
let type_player = "computer";
let comTextLose = document.querySelector("#com-text-lose");
let comTextWin = document.querySelector("#com-text-win");
let playerTextLose = document.querySelector("#player-text-lose");
let playerTextWin = document.querySelector("#player-text-win");
let drawText = document.querySelector("#draw-result");

let comWinner = 0;
let comLose = 0;
let playerWinner = 0;
let playerLose = 0;
let draw = 0;

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

// Human Option and Main Function
function pick(playerOption, callback) {
  gameStart.playerOption(playerOption);
  randomManipulation();
  action.buttonDisabled();
  action.resetButtonDisabled();
  let playerOptionElement = document.getElementById(playerOption + "-p");
  playerOptionElement.classList.add("activePlayer");
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
    action.resetButtonDisabled1();
    const comOption = gameStart.comOption();
    let comOptionsElement = document.getElementById(comOption);
    const finalResult = gameStart.winner(playerOption, comOption);
    comOptionsElement.classList.add("active");

    let textElement = document.getElementById("textVS");
    textElement.innerHTML = finalResult;
    textElement.classList.add("active-text-win1");

    switch (finalResult) {
      case "DRAW":
        draw++;
        payload.draw++;
        break;
      case "PLAYER1 WIN":
        playerWinner++;
        payload.win++;
        comLose++;
        break;
      case "COM WIN":
        comWinner++;
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
    pick(value.classList[2], async (payload) => {
      playerTextWin.innerHTML = playerWinner;
      playerTextLose.innerHTML = playerLose;
      comTextWin.innerHTML = comWinner;
      comTextLose.innerHTML = comLose;
      drawText.innerHTML = draw;
      playerTextWin.style.color = "white";
      playerTextLose.style.color = "white";
      comTextWin.style.color = "white";
      comTextLose.style.color = "white";
      drawText.style.color = "white";

      await saveScore(payload);
    });
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
  } catch (error) {
    console.log(error);
  }
}

// Reset Button Function
const resetButton = document.querySelector(".reset-button");
resetButton.onclick = () => {
  action.removeClassActive();
  action.removeClassActiveUser();
  action.resetButton();
};
