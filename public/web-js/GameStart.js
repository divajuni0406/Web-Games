// Object Oriented Programming
class GameStart {
  constructor() {
    this.comWin = "COM WIN";
    this.player2Win = "PLAYER2 WIN";
    this.playerWin = "PLAYER1 WIN";
    this.comPick;
    this.playerPick;
    this.username = "";
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

  getPlayerPick() {
    return this.playerPick;
  }

  // Winner Calculation
  winner(player, com) {
    if (player == com) return "DRAW";
    if (player == "scissors") return com == "rock" ? this.comWin : this.playerWin;
    if (player == "rock") return com == "paper" ? this.comWin : this.playerWin;
    if (player == "paper") return com == "scissors" ? this.comWin : this.playerWin;
  }

  winner2Player(player, player2) {
    if (player == player2) return "DRAW";
    if (player == "scissors") return player2 == "rock" ? this.player2Win : this.playerWin;
    if (player == "rock") return player2 == "paper" ? this.player2Win : this.playerWin;
    if (player == "paper") return player2 == "scissors" ? this.player2Win : this.playerWin;
  }
}

export { GameStart };
