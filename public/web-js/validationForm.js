// Password Validation
function validationForm(forms, passwordConfirm = "") {
  let validation = true;

  forms.forEach((e) => {
    if (e.id == "email" && !validateEmail(e.value)) {
      validation = false;
    } else if (e.id == "password" && !validatePassword(e.value, passwordConfirm)) {
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

function validatePassword(pass, passwordConfirm) {
  let validationPassword = pass === passwordConfirm ? true : false;

  return validationPassword;
}

export { validationForm };
