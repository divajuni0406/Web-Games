import { getCookie, eraseCookie, setCookie } from "../cookies.js";

let eleSignUp = document.querySelector("#sign-up");
let eleLogout = document.querySelector("#logout");
let username = document.querySelector("#username");
let getUsername = window.localStorage.getItem("username");
let userLogin = JSON.parse(getCookie(`cookie-${getUsername}`));

// socket
const socket = io();

socket.on("connect", () => {
  console.log("user connected");
});

// 1
socket.on("user-has-connected", (user) => {
  console.log(`player ${user} has connected`);
});

// 2
socket.on("user-has-disconnected", (user) => {
  console.log(`player ${user} has disconnected`);
});

const loadPage = () => {
  if (userLogin !== null) {
    eleSignUp.style.display = "none";
    eleLogout.style.display = "";
    username.innerHTML = userLogin.username;
  } else {
    eleSignUp.style.display = "";
    eleLogout.style.display = "none";
    username.innerHTML = "Your Account";
  }
};
loadPage();

logout.addEventListener("click", () => {
  Swal.fire({
    title: "Are you sure to logout?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, logout!",
  }).then((result) => {
    if (result.isConfirmed) {
      eraseCookie("logout");
      window.location.href = "/login";
    }
  });
});

const playGame = () => {
  let playBtn = document.querySelector("#button-play");
  let history = document.querySelector(".nav-item .link-history");
  if (userLogin === null) {
    playBtn.setAttribute("data-bs-toggle", "");
    playBtn.setAttribute("data-bs-target", "");
    history.setAttribute("href", "/login");
  } else {
    playBtn.setAttribute("data-bs-toggle", "modal");
    playBtn.setAttribute("data-bs-target", "#exampleModalToggle");
    history.setAttribute("href", "/history");
  }
};
playGame();

// modal
let createBtnReady = document.querySelector("#bg-btn");
let findBtnReady = document.querySelector("#bg-btn2");
let generateCode = document.querySelector("#generate-btn");
let backButton = document.querySelector(".btn-back");
let backButton2 = document.querySelector(".btn-back2");
let codeField = document.querySelector("#code");
let codeField2 = document.querySelector("#code2");
let loadingAnimate = document.querySelector("#loading-animation");
let textLoading = document.querySelector("#text-loading");
let countdownFind = document.getElementById("countdownFindRoom");
let countdownCreate = document.getElementById("countdownCreateRoom");

// 6
socket.on("player-2-ready", (roomCode, username) => {
  let code = JSON.parse(getCookie(`code-${roomCode}`));
  if (code != null) {
    textLoading.innerHTML = `${username} has in room`;
    createBtnReady.disabled = true;
    // 7
    socket.emit("game-ready", code.player1);
    code.player2 = username;
    setCookie(`code-${codeField.value}`, JSON.stringify(code), 1);
    countdownCreate.innerHTML = "Get Ready !!!";
    countdownCreate.style.color = "rgb(255, 220, 155)";
    setTimeout(() => {
      countdownCreateRoom();
    }, 2000);
  } else {
    // 9
    socket.emit("room-code-not-define", "Sorry, Can't Find The Room !!!");
  }
});

// 10
socket.on("room-code-not-define", (message) => {
  countdownFind.innerHTML = message;
  countdownFind.style.color = "red";
});

// 8
socket.on("game-ready", (username) => {
  let code = JSON.stringify({
    code: codeField2.value,
    player1: userLogin.username,
    player2: username,
  });

  setCookie(`code-${codeField2.value}`, code, 1);
  findBtnReady.disabled = true;
  countdownFind.innerHTML = "Get Ready !!!";
  countdownFind.style.color = "rgb(255, 220, 155)";
  setTimeout(() => {
    countdownFindRoom();
  }, 2000);
});

function buttonFunction(btn, btnBack) {
  if (btn.innerHTML === "Unready") {
    btn.style.backgroundColor = "rgb(59, 59, 87)";
    btn.innerHTML = "Ready";
    btnBack.disabled = false;
    return;
  }
  if (btn.innerHTML === "Ready") {
    btn.style.backgroundColor = "orange";
    btn.innerHTML = "Unready";
    btnBack.disabled = true;
    return;
  }
}

// button effect
createBtnReady.addEventListener("click", () => {
  buttonFunction(createBtnReady, backButton);
  if (createBtnReady.innerHTML === "Unready") {
    let cookie = JSON.stringify({
      code: codeField.value,
      player1: userLogin.username,
    });
    setCookie(`code-${codeField.value}`, cookie, 1);

    loadingAnimate.style.display = "block";
    textLoading.style.display = "block";
  } else {
    loadingAnimate.style.display = "none";
    textLoading.style.display = "none";
  }
});

findBtnReady.addEventListener("click", () => {
  buttonFunction(findBtnReady, backButton2);
  // 5 
  if (findBtnReady.innerHTML == "Unready") {
    socket.emit("player-2-ready", codeField2.value, userLogin.username);
  } else {
    countdownFind.innerHTML = "";
  }
});

// back button reset value
// 3
backButton.addEventListener("click", () => {
  socket.emit("close-room", codeField.value);
  codeField.value = "";
  createBtnReady.disabled = true;
  generateCode.disabled = false;
});
backButton2.addEventListener("click", () => {
  codeField2.value = "";
  findBtnReady.disabled = true;
});

// 4
socket.on("player-close-room", (roomNumber) => {
  console.log("player close room : " + roomNumber);
  eraseCookie("code");
  textLoading.innerHTML = "";
});

// code generate
generateCode.addEventListener("click", () => {
  eraseCookie("code");
  const result = Math.random().toString(36).substring(2, 7);
  let min = 1000;
  let max = 9000;
  let num = Math.floor(Math.random() * min) + max;
  codeField.value = num + result;
  if (codeField.value !== "") {
    createBtnReady.disabled = false;
    generateCode.disabled = true;
    return;
  }
});

// find code field
codeField2.addEventListener("keyup", () => {
  if (codeField2.value !== "") {
    findBtnReady.disabled = false;
    return;
  }
});

// COUNTDOWN 
let timeLeftCreateRoom = 5;
let timeLeftFindRoom = 5;

const countdownCreateRoom = () => {
  timeLeftCreateRoom--;
  countdownCreate.innerHTML = "Ready In " + String(timeLeftCreateRoom);
  countdownCreate.style.color = "rgb(255, 220, 155)";
  if (timeLeftCreateRoom > 0) {
    setTimeout(countdownCreateRoom, 1000);
  } else {
    window.localStorage.setItem("code", codeField.value);
    closeDialogCreateRoom();
    window.location.href = "/gamesuit-player";
  }
};

const countdownFindRoom = () => {
  timeLeftFindRoom--;
  countdownFind.innerHTML = "Ready In " + String(timeLeftFindRoom);
  countdownFind.style.color = "rgb(255, 220, 155)";
  if (timeLeftFindRoom > 0) {
    setTimeout(countdownFindRoom, 1000);
  } else {
    window.localStorage.setItem("code", codeField2.value);
    closeDialogFindRoom();
    window.location.href = "/gamesuit-player";
  }
};

// CLOSE DIALOG 
function closeDialogFindRoom() {
  codeField2.value = "";
  findBtnReady.disabled = true;
  countdownFind.innerHTML = "";
  $("#exampleModalToggle3").modal("toggle");
}

function closeDialogCreateRoom() {
  codeField.value = "";
  textLoading.innerHTML = "";
  createBtnReady.disabled = true;
  generateCode.disabled = false;
  countdownCreate.innerHTML = "";
  $("#exampleModalToggle2").modal("toggle");
}
