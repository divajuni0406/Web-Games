import { getCookie, eraseCookie } from "../../cookies.js";

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
