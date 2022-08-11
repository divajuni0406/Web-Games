import { notifications, errorNotification } from "../../web-js/notifications.js";
import { validationForm } from "../../web-js/validationForm.js";

let table = '';
const urlApi = 'http://localhost:3000';

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
let idAdmin = document.querySelector("#idAdmin");
let fromEditData = document.querySelector("#from-edit-data");
let fromAddData = document.querySelector("#from-add-data");

// Password Validation
let passwordConfirm = document.querySelector("#confirm_password");
let passValidation = document.querySelector("#validation-pass");
let passText = document.querySelector("#text-pass");

// Read data general 
const getMasterDataAdmin = async () => {
  try {
    let response = await fetch(urlApi + "/fetch-data-admin");
    const result = await response.json();

    table = $("#example").DataTable({
      "data": result.result,
      "columns": [
        {
          "data": "_id",
          "render" : function(data, type, row, meta){
            return meta.row + 1
          }
        },
        {
          "data": "first_name",
        },
        {
          "data": "last_name",
        },
        {
          "data": "full_name",
        },
        {
          "data": "adminData",
          "render": function(data, type, row) {
           return data[0].username
          }
        },
        {
          "data": "adminData",
          "render": function(data, type, row) {
           return data[0].email
          }
        },
        {
          "data" : "adminData",
          "render": function(data, type) {
            if(type == 'display'){
              return`<button type="button" data-id="${data[0]._id}" class="btn-danger delete-btn">
                <i class="bi bi-trash-fill"></i> delete
              </button>
              <button type="button" data-id="${data[0]._id}" class="btn-success edit-btn ms-2" data-bs-toggle="modal"
              data-bs-target="#exampleModal">
                <i class="bi bi-pencil"></i> edit
              </button>`
            }
           return '';
          },
        },
      ]
      
    });
  } catch (error) {
    console.log(error);
  }
}

//--------------------------------- Form Add Or Edit Data Admin ------------------------------------------------

const resetForm = () => {
  let forms = document.querySelectorAll(".form-input");
  forms.forEach((e) => {
    e.value = "";
  });
}

const resetModal = () => {
  document.querySelector('#exampleModalLabel').innerHTML = 'Add Data Admin';
  fromAddData.style.display = 'block';
  fromEditData.style.display = 'none';
}

password.addEventListener('keyup', function(e){
  e.preventDefault();
  checkValidationPassword();
})

confirm_password.addEventListener('keyup', function(e){
  e.preventDefault();
  checkValidationPassword();
})

const checkValidationPassword = () => {
  passValidation.classList.remove("valid-pass");
  passValidation.classList.remove("invalid-pass");
  passText.innerHTML = "";

  if (passwordConfirm.value !== "" && password.value !== "") {
    if(password.value === passwordConfirm.value) {
      passValidation.classList.remove("invalid-pass");
      passValidation.classList.add("valid-pass");
      passText.innerHTML = "Looks good!";
    } else {
      passValidation.classList.remove("valid-pass");
      passValidation.classList.add("invalid-pass");
      passText.innerHTML = "Wrong Password!";
    }
  }
}

dateOfBirth.addEventListener('change', function(e){
  e.preventDefault();
  let myAge = document.querySelector("#age");
  let birthday = document.querySelector("#dateOfBirth").value;

  let ageInMilliseconds = new Date() - new Date(birthday);
  let conYears = Math.floor(ageInMilliseconds / 1000 / 60 / 60 / 24 / 365); // convert to years;
  myAge.value = conYears;
  if (myAge.value < 5) {
    errorNotification('Your age should be more than 4');
    return (myAge.value = "");
  }
})

saveData.addEventListener('click', async function(e){
  e.preventDefault();
  let linkApi = idAdmin.value ? `/update-data-user/${idAdmin.value}` : '/add-data-user';
  let typeMethod = idAdmin.value ? 'PUT' : 'POST';
  let form = idAdmin.value ? document.querySelectorAll(".form-edit") : document.querySelectorAll(".form-input");

  try {
    let validation = validationForm(form, passwordConfirm.value);
    if (!validation) {
      await errorNotification('Please Fill The Form Completely With Right Format !!!', 5000);
      return;
    }
    let response = await fetch(urlApi + linkApi, {
      method: typeMethod,
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
   
    let isNotif = await notifications(result);
    
    if(isNotif){
      table.destroy();
      getMasterDataAdmin();
      resetForm();
      $("#exampleModal").modal("hide");
    }
  } catch (error) {
    console.log(error);
  }
})

// delete user admin 
$('#example tbody').on('click', '.delete-btn', async function (e) {
  e.preventDefault();
  let id = $(this).attr("data-id");

  let response = await fetch(urlApi + `/delete-data-user/${id}`, {
    method: "DELETE"
  });

  const result = await response.json();
  let isNotif = await notifications(result);

  if(isNotif){
    table.destroy();
    getMasterDataAdmin();
  }
});

// update user admin 
$('#example tbody').on('click', '.edit-btn', async function (e) {
  e.preventDefault();
  fromAddData.style.display = 'none';
  fromEditData.style.display = 'block';
  let id = $(this).attr("data-id");
  
  let response = await fetch(urlApi + `/fetch-one-admin/${id}`);
  const result = await response.json();

  document.querySelector('#exampleModalLabel').innerHTML = `Edit Data ${result.result[0].full_name}`;

  first_name = document.querySelector(".firstName");
  last_name = document.querySelector(".lastName");
  full_name = document.querySelector(".fullName");
  username = document.querySelector(".username");
  email = document.querySelector(".email");

  first_name.value = result.result[0].first_name;
  last_name.value =  result.result[0].last_name;
  full_name.value =  result.result[0].full_name;
  username.value =  result.result[0].adminData[0].username;
  email.value =  result.result[0].adminData[0].email;
  idAdmin.value =  result.result[0].adminData[0]._id;

});

$("#exampleModal").on('shown.bs.modal', function(e){
  e.preventDefault();

  if(e.relatedTarget.classList[1] != 'edit-btn'){
    resetModal();
    resetForm();
  }
});



getMasterDataAdmin();
