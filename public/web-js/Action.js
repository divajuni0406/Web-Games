// Remove Computer Active Function
class Action {
  removeClassActive() {
    const comActive = document.querySelectorAll(".comBrain button");
    comActive.forEach((value) => {
      value.classList.remove("active");
    });
  }

  // Remove User Active Function
  removeClassActiveUser() {
    const playerActive = document.querySelectorAll(".playerChoice button");
    playerActive.forEach((value) => {
      value.classList.remove("activePlayer");
    });
  }

  // Disable Button User
  buttonDisabled() {
    const player = document.querySelector(".player");
    player.classList.add("cursor");
  }

  // Disable Reset Button
  resetButtonDisabled() {
    const refresh = document.querySelector(".refresh button");
    refresh.classList.add("cursor");
  }

  // Remove Disable Reset Button
  resetButtonDisabled1() {
    const refresh = document.querySelector(".refresh button");
    refresh.classList.remove("cursor");
  }

  // Reset Button Function
  resetButton() {
    let textElement = document.getElementById("textVS");
    textElement.innerHTML = "VS";
    textElement.classList.remove("active-text-win");
    textElement.classList.remove("active-text-win1");
    const cursor = document.querySelector(".player");
    cursor.classList.remove("cursor");
  }

  resetButtonPlayer() {
    let textElement = document.getElementById("textVS");
    textElement.innerHTML = "VS";
    textElement.classList.remove("active-text-win");
    textElement.classList.remove("active-text-win1");
    const cursor = document.querySelector(".player");
    cursor.classList.remove("cursor");
  }
}
// Object Oriented Programming End Tag

export { Action };
