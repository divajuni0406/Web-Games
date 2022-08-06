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
      let response = await fetch("http://localhost:3000/fetch-data-user");
      const result = await response.json();
      console.log(result.result);
  
      result.result.forEach((user, index) => {
        table.row.add([index + 1, user.first_name, user.last_name, user.userData[0].username, user.userData[0].email, "view"]).draw();
      });
    } catch (error) {
      console.log(error);
    }
  }
  