// set cookie
async function notifications(response) {
  if (response.statusCode === 200) {
    await Swal.fire({
      position: "top-center",
      icon: "success",
      title: `${response.message}`,
      showConfirmButton: false,
      timer: 2000,
    });
    return true;
  }
  if (response.statusCode === 400) {
    await Swal.fire({
      position: "top-center",
      icon: "error",
      title: `${response.message}`,
      showConfirmButton: false,
      timer: 2000,
    });
    return false;
  }
}

async function errorNotification(text = '', timer = 3000){
  await Swal.fire({
    icon: "error",
    title: "Oops...",
    text: text ? text : "Something Wrong !!!",
    timer : timer
  });
  
  return;
}

export { notifications, errorNotification };
