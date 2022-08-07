$(document).ready(function () {
  $("#example").DataTable();
});

getMasterDataAdmin();

let selectOption = document.querySelector(".form-select");
let section = document.querySelector("#last-section");
selectOption.addEventListener("change", () => {
  if (selectOption.value === "25" || selectOption.value === "50" || selectOption.value === "100") {
    section.classList.add("bg-history");
  } else {
    section.classList.remove("bg-history");
  }
});

async function getMasterDataAdmin() {
  try {
    let table = $("#example").DataTable();
    table.clear().draw();
    let response = await fetch("http://localhost:3000/fetch-data-admin");
    const result = await response.json();
    console.log(result.result);

    result.result.forEach((admin, index) => {
      table.row.add([index + 1, admin.first_name, admin.last_name, admin.full_name, admin.adminData[0].username, admin.adminData[0].email, "view"]).draw();
    });
  } catch (error) {
    console.log(error);
  }
}

//----------------------- Form Add Or Edit Data Admin -----------------------

// To Get Data Register From Users
let first_name = document.querySelector("#firstName");
let last_name = document.querySelector("#lastName");
let full_name = document.querySelector("#fullName");
let age = document.querySelector("#age");
let date_of_birth = document.querySelector("#dateOfBirth");
let gender = document.querySelector("#gender");
let username = document.querySelector("#username");
let password = document.querySelector("#password");
let email = document.querySelector("#email");
let address = document.querySelector("#address");

async function addAdmin() {
  try {
    let validation = validationForm();
    if (!validation) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Please Fill The Form Completely With Right Format !!!`,
        timer: 9000,
      });
      return;
    }
    let response = await fetch("/add-data-user", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        first_name: first_name.value,
        last_name: last_name.value,
        full_name: full_name.value,
        age: age.value,
        date_of_birth: date_of_birth.value,
        gender: gender.value,
        username: username.value,
        password: password.value,
        email: email.value,
        address: address.value,
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
      getMasterDataAdmin();
      resetForm();
      $("#exampleModal").modal("hide");
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

//Validation
function validationForm() {
  let forms = document.querySelectorAll(".form-input");
  let validation = true;

  forms.forEach((e) => {
    if (e.id == "email" && !validateEmail(e.value)) {
      validation = false;
    } else if (e.id == "password" && !validatePassword(e.value)) {
      validation = false;
    } else if (e.value.length < 1) {
      validation = false;
    }
  });

  return validation;
}

// Email Validation
function validateEmail(email) {
  let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let validationEmail = email.match(mailformat) ? true : false;

  return validationEmail;
}

// Password Validation
let passwordConfirm = document.querySelector("#confirm_password");
let passValidation = document.querySelector("#validation-pass");
let passText = document.querySelector("#text-pass");

function validatePassword(pass) {
  let validationPassword = pass === passwordConfirm.value ? true : false;

  return validationPassword;
}

// perspectif when user input the password field first then password confirm
function conPass() {
  if (password.value === passwordConfirm.value && passwordConfirm.value !== "" && password.value !== "") {
    passValidation.classList.remove("invalid-pass");
    passValidation.classList.add("valid-pass");
    passText.innerHTML = "Looks good!";
    return;
  }
  if (password.value !== passwordConfirm.value && passwordConfirm.value !== "" && password.value !== "") {
    passValidation.classList.remove("valid-pass");
    passValidation.classList.add("invalid-pass");
    passText.innerHTML = "Wrong Password!";
    return;
  }
  if (passwordConfirm.value === "") {
    passValidation.classList.remove("valid-pass");
    passValidation.classList.remove("invalid-pass");
    passText.innerHTML = "";
    return;
  }
}

// perspectif when user input the password confirm first then password field
function pass() {
  if (password.value === passwordConfirm.value && passwordConfirm.value !== "" && password.value !== "") {
    passValidation.classList.remove("invalid-pass");
    passValidation.classList.add("valid-pass");
    passText.innerHTML = "Looks good!";
    return;
  }
  if (password.value !== passwordConfirm.value && passwordConfirm.value !== "" && password.value !== "") {
    passValidation.classList.remove("valid-pass");
    passValidation.classList.add("invalid-pass");
    passText.innerHTML = "Wrong Password!";
    return;
  }
  if (password.value === "") {
    passValidation.classList.remove("valid-pass");
    passValidation.classList.remove("invalid-pass");
    passText.innerHTML = "";
    return;
  }
}

function resetForm() {
  let forms = document.querySelectorAll(".form-input");
  forms.forEach((e) => {
    e.value = "";
  });
}

// Date & Age
function date() {
  let myAge = document.querySelector("#age");
  let birthday = document.querySelector("#dateOfBirth").value;
  let ageInMilliseconds = new Date() - new Date(birthday);
  let conYears = Math.floor(ageInMilliseconds / 1000 / 60 / 60 / 24 / 365); // convert to years;
  myAge.value = conYears;
  if (myAge.value < 5) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Your age should be more than 4",
    });
    return (myAge.value = "");
  }
}
