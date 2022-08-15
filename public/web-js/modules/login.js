import { setCookie } from "../../web-js/cookies.js";
import { notifications, errorNotification } from "../../web-js/notifications.js";

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:3000/loginData", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const result = await response.json();

    let isNotif = await notifications(result);
    if (isNotif) {
      window.localStorage.setItem("username", username);
      setCookie(`cookie-${username}`, JSON.stringify(result.sendData), 1);
      window.location.href = "/";
    }
  } catch (error) {
    console.log(error);
    errorNotification();
  }
});
