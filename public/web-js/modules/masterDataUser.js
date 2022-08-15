import { getCookie } from "../cookies.js";
let getUsername = window.localStorage.getItem("username");
let userLogin = JSON.parse(getCookie(`cookie-${getUsername}`));

let table = "";
let table1 = "";

getMasterDataUser();

async function getMasterDataUser() {
  try {
    let response = await fetch("http://localhost:3000/fetch-data-user", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userLogin.token}`,
      },
    });
    const result = await response.json();

    table = $("#table-history-user").DataTable({
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
          data: "userData",
          render: function (data, type, row) {
            return data[0].username;
          },
        },
        {
          data: "userData",
          render: function (data, type, row) {
            return data[0].email;
          },
        },
        {
          data: "userData",
          render: function (data, type) {
            if (type == "display") {
              return `<button type="button" data-id="${data[0]._id}" class="btn-primary view-btn" data-bs-toggle="modal" data-bs-target="#historyModal">
                <i class="bi bi-eye"></i> view
                </button>`;
            }

            return "";
          },
        },
      ],
    });
  } catch (error) {
    console.log(error);
  }
}

//----------------------- Form View User ---------------------
$("#table-history-user tbody").on("click", ".view-btn", function (e) {
  e.preventDefault();
  let id = $(this).attr("data-id");
  if (table1) {
    table1.destroy();
  }
  showHistoryModal(id);
});

async function showHistoryModal(id) {
  let formatDate = {
    weekday: "short",
    day: "numeric",
    year: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  try {
    table1 = $("#table-all-history-user").DataTable({
      footerCallback: function (row, data, start, end, display) {
        let api = this.api();

        let intVal = function (i) {
          return typeof i === "string" ? i.replace(/[\$,]/g, "") * 1 : typeof i === "number" ? i : 0;
        };

        let pageTotalWin = api
          .column(1, { page: "current" })
          .data()
          .reduce(function (a, b) {
            return intVal(a) + intVal(b);
          }, 0);

        let pageTotalLose = api
          .column(2, { page: "current" })
          .data()
          .reduce(function (a, b) {
            return intVal(a) + intVal(b);
          }, 0);

        let pageTotalDraw = api
          .column(3, { page: "current" })
          .data()
          .reduce(function (a, b) {
            return intVal(a) + intVal(b);
          }, 0);

        $(api.column(1).footer()).html(pageTotalWin);
        $(api.column(2).footer()).html(pageTotalLose);
        $(api.column(3).footer()).html(pageTotalDraw);
      },
    });
    table1.clear().draw();
    // get who has the game history
    let responseProfile = await fetch(`http://localhost:3000/fetch-data-user/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userLogin.token}`,
      },
    });
    const resultProfile = await responseProfile.json();
    let profile = resultProfile.result[0].userData[0].username;
    document.querySelector(".user-history").innerText = `${profile}'s Game History`;

    // get user's game history
    let response = await fetch(`/history/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userLogin.token}`,
      },
    });
    const result = await response.json();
    let historyDetails = result.resultData[0].score_games;

    historyDetails.forEach((history, index) => {
      let date = new Date(history.date_time);

      table1.row.add([index + 1, history.win, history.lose, history.draw, history.type_player, date.toLocaleString("en-US", formatDate)]).draw();
    });
  } catch (error) {
    console.log(error);
  }
}
