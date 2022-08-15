let first_name = document.querySelector("#firstName");
let last_name = document.querySelector("#lastName");
let full_name = document.querySelector("#fullName");
let username = document.querySelector("#username");
let email = document.querySelector("#email");
let formArea = document.querySelector(".form-area");

let url = location.pathname.split("/")[2];

async function getOne() {
  let response = await fetch(`/fetch-one-admin/${url}`);
  const result = await response.json();
  const adminData = result.result;
  first_name.value = adminData[0].first_name;
  last_name.value = adminData[0].last_name;
  full_name.value = adminData[0].full_name;
  email.value = adminData[0].adminData[0].email;
  username.value = adminData[0].adminData[0].username;
}
getOne();

async function update() {
  try {
    let response = await fetch(`/update-data-user/${url}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        first_name: first_name.value,
        last_name: last_name.value,
        full_name: full_name.value,
        username: username.value,
        email: email.value,
      }),
    });
    const result = await response.json();
    if (result.statusCode === 200) {
      await Swal.fire({
        position: "top-center",
        icon: "success",
        title: `${result.message}`,
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
    if (result.statusCode === 400) {
      await Swal.fire({
        position: "top-center",
        icon: "error",
        title: `${result.message}`,
        showConfirmButton: false,
        timer: 4000,
      });
      return;
    }
  } catch (error) {
    console.log(error);
  }
}
