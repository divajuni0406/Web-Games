import { getCookie, eraseCookie } from "../cookies.js";

let eleSignUp = document.querySelector("#sign-up");
let eleLogout = document.querySelector("#logout");
let username = document.querySelector("#username");
let adminPage = document.querySelector("#admin");
let userLogin = JSON.parse(getCookie("user"));
console.log(userLogin);

const loadPage = () => {
  if (userLogin.username !== null) {
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

// const admin = () => {
//   if (userLogin.type_user !== "admin") {
//     adminPage.style.display = "none";
//   } else {
//     adminPage.style.display = "";
//   }
// };
// admin();

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
      eraseCookie("user");
      window.location.href = "/login";
    }
  });
});

const playGame = () => {
  let playBtn = document.querySelector("#button-play");
  let history = document.querySelector(".link-history");
  if (userLogin.username === null) {
    playBtn.setAttribute("href", "/login");
    history.setAttribute("href", "/login");
  } else {
    playBtn.setAttribute("href", "/gamesuit");
    history.setAttribute("href", "/history");
  }
};
playGame();

// modal
let readyButton = document.querySelector("#bg-btn");
let findButton = document.querySelector("#bg-btn2");
let generateCode = document.querySelector("#generate-btn");
let backButton = document.querySelector(".btn-back");
let backButton2 = document.querySelector(".btn-back2");
let codeField =  document.querySelector("#code");
let codeField2 =  document.querySelector("#code2");
let closeButton = document.querySelector(".close-modal");

readyButton.addEventListener("click", () => {
  if(readyButton.innerHTML === "Unready"){
    readyButton.style.backgroundColor =  "rgb(59, 59, 87)";
    readyButton.innerHTML =  "Ready";
    backButton.disabled = false;
    document.querySelector(".close").disabled = false;
    return;
  }
  if(readyButton.innerHTML === "Ready"){
    readyButton.style.backgroundColor =  "orange";
    readyButton.innerHTML =  "Unready";
    backButton.disabled = true;
    document.querySelector(".close").disabled = true;
    return;
  }
  // btn(readyButton, orange, rgb(59, 59, 87))
})
findButton.addEventListener("click", () => {
  if(findButton.innerHTML === "Unready"){
    findButton.style.backgroundColor =  "rgb(59, 59, 87)";
    findButton.innerHTML =  "Ready";
    backButton2.disabled = false;
    return;
  }
  if(findButton.innerHTML === "Ready"){
    findButton.style.backgroundColor =  "orange";
    findButton.innerHTML =  "Unready";
    backButton2.disabled = true;
    return;
  }
  // btn(findButton, orange, rgb(59, 59, 87))
})

// button close reset value 
closeButton.addEventListener("click", () => {
  codeField.value =  "";
})
backButton.addEventListener("click", () => {
  codeField.value =  "";
})
backButton2.addEventListener("click", () => {
  codeField2.value =  "";
})

// code generate 
generateCode.addEventListener("click", () =>{
  codeField.value =  Math.floor(100000 + Math.random() * 900000);
})

// function btn(button, color, bgColor) {
//   if(button.innerHTML === "Unready"){
//     button.style.backgroundColor = String(color) ;
//     button.innerHTML =  "Ready";
//     return;
//   }
//   if(button.innerHTML === "Ready"){
//     button.style.backgroundColor = String(bgColor);
//     button.innerHTML =  "Unready";
//     return;
//   }
// }
