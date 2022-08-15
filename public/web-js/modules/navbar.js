import { getCookie, eraseCookie } from "../cookies.js";

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

socket.on("user-has-connected", (user) => {
  console.log(`player ${user} has connected`);
});

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
      eraseCookie('logout');
      window.location.href = "/login";
    }
  });
});