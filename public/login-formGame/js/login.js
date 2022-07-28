import { setCookie } from "../../cookies.js";

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  try {
    const response = await fetch("/login", {
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
    if (result.statusCode === 200) {
      await Swal.fire({
        position: "top-center",
        icon: "success",
        title: result.message,
        showConfirmButton: false,
        timer: 2000,
      });

      setCookie("username", JSON.stringify(result.sendData.username), 1);
      setCookie("userId", JSON.stringify(result.sendData.id), 1);
      return (window.location.href = "/");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: result.message,
      });
    }
  } catch (error) {
    console.log(error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Samething Wrong !!!",
    });
  }
});
