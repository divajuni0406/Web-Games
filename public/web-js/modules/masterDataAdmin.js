import { notifications, errorNotification } from "../../web-js/notifications.js";
import { validationForm } from "../../web-js/validationForm.js";
import { getCookie } from "../cookies.js";

let getUsername = window.localStorage.getItem("username");
let userLogin = JSON.parse(getCookie(`cookie-${getUsername}`));

let table = "";
const urlApi = "http://localhost:3000";

let first_name = document.querySelector("#firstName");
let last_name = document.querySelector("#lastName");
let full_name = document.querySelector("#fullName");
let age = document.querySelector("#age");
let date_of_birth = document.querySelector("#dateOfBirth");
let gender = document.querySelector("#gender");
let username = document.querySelector("#usernamee");
let password = document.querySelector("#password");
let email = document.querySelector("#email");
let address = document.querySelector("#address");
let idAdmin = document.querySelector("#idAdmin");
let fromEditData = document.querySelector("#from-edit-data");
let fromAddData = document.querySelector("#from-add-data");
let fromViewData = document.querySelector("#from-view-data");

// Password Validation
let passwordConfirm = document.querySelector("#confirm_password");
let passValidation = document.querySelector("#validation-pass");
let passText = document.querySelector("#text-pass");

// ============================================ Read all admin data =============================================
const getMasterDataAdmin = async () => {
  try {
    let response = await fetch(urlApi + "/fetch-data-admin", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userLogin.token}`,
      },
    });

    const result = await response.json();

    table = $("#example").DataTable({
      data: result.result,
      columns: [
        {
          data: "_id",
          render: function (data, type, row, meta) {
            return meta.row + 1;
          },
        },
        {
          data: "first_name",
        },
        {
          data: "last_name",
        },
        {
          data: "full_name",
        },
        {
          data: "adminData",
          render: function (data, type, row) {
            return data[0].username;
          },
        },
        {
          data: "adminData",
          render: function (data, type, row) {
            return data[0].email;
          },
        },
        {
          data: "adminData",
          render: function (data, type) {
            if (type == "display") {
              return `
              <button type="button" data-id="${data[0]._id}" class="btn-primary view-btn ms-2" data-bs-toggle="modal"
              data-bs-target="#exampleModal">
                <i class="bi bi-pencil"></i> view
              </button>
              <button type="button" data-id="${data[0]._id}" class="btn-success edit-btn ms-2" data-bs-toggle="modal"
              data-bs-target="#exampleModal">
                <i class="bi bi-pencil"></i> edit
              </button>
              <button type="button" data-id="${data[0]._id}" class="btn-danger delete-btn">
                <i class="bi bi-trash-fill"></i> delete
              </button>`;
            }
            return "";
            exampleModalLabel
          },
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
};

// ================================================= Form Actions ================================================

const resetForm = () => {
  let formPost = document.querySelectorAll(".form-input");
  let formEdit = document.querySelectorAll(".form-edit");
  formPost.forEach((e) => {
    e.value = "";
  });
  formEdit.forEach((e) => {
    e.value = "";
  });
  passValidation.classList.remove("valid-pass");
  passValidation.classList.remove("invalid-pass");
  passText.innerHTML = "";
  idAdmin.value = "";
};

const resetModal = () => {
  document.querySelector("#exampleModalLabel").innerHTML = "Add Data Admin";
  fromAddData.style.display = "block";
  fromEditData.style.display = "none";
  fromViewData.style.display = "none";
  saveData.style.display = "block";
};

password.addEventListener("keyup", function (e) {
  e.preventDefault();
  checkValidationPassword();
});

confirm_password.addEventListener("keyup", function (e) {
  e.preventDefault();
  checkValidationPassword();
});

const checkValidationPassword = () => {
  if (passwordConfirm.value !== "" && password.value !== "") {
    if (password.value === passwordConfirm.value) {
      passValidation.classList.remove("invalid-pass");
      passValidation.classList.add("valid-pass");
      passText.innerHTML = "Looks good!";
    } else {
      passValidation.classList.remove("valid-pass");
      passValidation.classList.add("invalid-pass");
      passText.innerHTML = "Wrong Password!";
    }
    return;
  }
};

dateOfBirth.addEventListener("change", function (e) {
  e.preventDefault();
  let myAge = document.querySelector("#age");
  let birthday = document.querySelector("#dateOfBirth").value;

  let ageInMilliseconds = new Date() - new Date(birthday);
  let conYears = Math.floor(ageInMilliseconds / 1000 / 60 / 60 / 24 / 365); // convert to years;
  myAge.value = conYears;
  if (myAge.value < 5) {
    errorNotification("Your age should be more than 4");
    return (myAge.value = "");
  }
});

function formInsertAndUpdate(){
first_name = idAdmin.value ? document.querySelector("#firstName") : document.querySelector("#firstName2")
last_name =  idAdmin.value ? document.querySelector("#lastName") : document.querySelector("#lastName2")
full_name = idAdmin.value ? document.querySelector("#fullName") : document.querySelector("#fullName2");
username = idAdmin.value ? document.querySelector("#usernamee") : document.querySelector("#usernamee2");
email = idAdmin.value ? document.querySelector("#email") : document.querySelector("#email2");
}
// ============================================== Add / Update Data Admin ===============================================
saveData.addEventListener("click", async function (e) {
  e.preventDefault();
  formInsertAndUpdate();
  let linkApi = idAdmin.value ? `/update-data-admin/${idAdmin.value}` : "/add-data-admin";
  let typeMethod = idAdmin.value ? "PUT" : "POST";
  let form = idAdmin.value ? document.querySelectorAll(".form-edit") : document.querySelectorAll(".form-input");
  try {
    let validation = validationForm(form, passwordConfirm.value);
    if (!validation) {
      await errorNotification("Please Fill The Form Completely With Right Format !!!", 5000);
      return;
    }
    let response = await fetch(urlApi + linkApi, {
      method: typeMethod,
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userLogin.token}`,
      },
      body: JSON.stringify({
        first_name: first_name.value,
        last_name: last_name.value,
        full_name: full_name.value,
        age: age.value,
        date_of_birth: date_of_birth.value,
        gender: gender.value,
        password: password.value,
        address: address.value,
        email: email.value,
        username: username.value,
      }),
    });
    const result = await response.json();

    let isNotif = await notifications(result);
    if (isNotif) {
      table.destroy();
      getMasterDataAdmin();
      resetForm();
      $("#exampleModal").modal("hide");
    }
  } catch (error) {
    console.log(error);
  }
});

// =============================================== Delete Admin Data =============================================
$("#example tbody").on("click", ".delete-btn", async function (e) {
  e.preventDefault();
  let id = $(this).attr("data-id");

  let confirm = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });
  if (confirm.isConfirmed) {
    let response = await fetch(urlApi + `/delete-data-admin/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userLogin.token}`,
      },
    });
    const result = await response.json();
    let isNotif = await notifications(result);

    if (isNotif) {
      table.destroy();
      getMasterDataAdmin();
    }
  }
});

// ============================================== Update Admin Data ==============================================
$("#example tbody").on("click", ".edit-btn", async function (e) {
  e.preventDefault();
  fromAddData.style.display = "none";
  fromViewData.style.display = "none";
  fromEditData.style.display = "block";
  saveData.style.display = "block";
  let id = $(this).attr("data-id");

  let response = await fetch(urlApi + `/fetch-one-admin/${id}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${userLogin.token}`,
    },
  });
  const result = await response.json();
  
  document.querySelector("#exampleModalLabel").innerHTML = `Edit data: ${result.result[0].full_name}`;

  first_name = document.querySelector(".firstName");
  last_name = document.querySelector(".lastName");
  full_name = document.querySelector(".fullName");
  username = document.querySelector(".username");
  email = document.querySelector(".email");

  first_name.value = result.result[0].first_name;
  last_name.value = result.result[0].last_name;
  full_name.value = result.result[0].full_name;
  username.value = result.result[0].adminData[0].username;
  email.value = result.result[0].adminData[0].email;
  idAdmin.value = result.result[0].adminData[0]._id;
});

// ============================================ View One Admin Data =============================================
$("#example tbody").on("click", ".view-btn", async function (e) {
  e.preventDefault();
  fromAddData.style.display = "none";
  fromViewData.style.display = "block";
  fromEditData.style.display = "none";
  saveData.style.display = "none";
  let id = $(this).attr("data-id");

  let response = await fetch(urlApi + `/fetch-one-admin/${id}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${userLogin.token}`,
    },
  });
  const result = await response.json();

  document.querySelector("#exampleModalLabel").innerHTML = `View data: ${result.result[0].full_name}`;

  first_name = document.querySelector(".firstName-view");
  last_name = document.querySelector(".lastName-view");
  full_name = document.querySelector(".fullName-view");
  username = document.querySelector(".username-view");
  email = document.querySelector(".email-view");
  age = document.querySelector(".age-view");
  gender = document.querySelector(".gender-view");
  date_of_birth = document.querySelector(".dateOfBirth-view");
  address = document.querySelector(".address-view");

  first_name.value = result.result[0].first_name;
  last_name.value = result.result[0].last_name;
  full_name.value = result.result[0].full_name;
  age.value = result.result[0].age;
  gender.value = result.result[0].gender;
  date_of_birth.value = result.result[0].date_of_birth;
  address.value = result.result[0].address;
  username.value = result.result[0].adminData[0].username;
  email.value = result.result[0].adminData[0].email;
  idAdmin.value = result.result[0]._id;
});

$("#exampleModal").on("shown.bs.modal", function (e) {
  e.preventDefault();

  if (e.relatedTarget.classList[1] !== "edit-btn" && e.relatedTarget.classList[1] !== "view-btn") {
    resetModal();
    resetForm();
    return;
  }
});

getMasterDataAdmin();
