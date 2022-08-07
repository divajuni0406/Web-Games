// Object Oriented Programming
class GameStart {
  constructor() {
    this.comWin = "COM WIN";
    this.playerWin = "PLAYER1 WIN";
    this.comPick;
    this.playerPick;
  }
  // Com Pick
  comOption() {
    const comBrain = ["scissors", "rock", "paper"];
    let comPick = comBrain[Math.floor(Math.random() * comBrain.length)];
    return (this.comPick = comPick);
  }

  // Player Pick
  playerOption(params) {
    this.playerPick = params;
  }

  // Winner Calculation
  winner(player, com) {
    if (player == com) return "DRAW";
    if (player == "scissors") return com == "rock" ? this.comWin : this.playerWin;
    if (player == "rock") return com == "paper" ? this.comWin : this.playerWin;
    if (player == "paper") return com == "scissors" ? this.comWin : this.playerWin;
  }
}

export { GameStart };
