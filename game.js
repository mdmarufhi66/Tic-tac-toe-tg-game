const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const resultDisplay = document.getElementById("result");
const turnIndicator = document.getElementById("turnIndicator");

let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;
let mode = "2P";
let lastStarter = "X"; // Track who started last game

function updateTurnIndicator() {
  turnIndicator.innerText = `Turn: ${currentPlayer}`;
}

function startGame() {
  gameBoard.fill("");
  cells.forEach(cell => {
    cell.innerText = "";
    cell.classList.remove("winner");
  });
  resultDisplay.innerText = "";
  currentPlayer = lastStarter; // Start with last game's winner or alternate after draw
  isGameActive = true;
  updateTurnIndicator();

  // If AI starts, let AI make the first move automatically
  if (mode !== "2P" && currentPlayer === "O") {
    setTimeout(aiMove, 500);
  }
}

function checkWinner() {
  const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      cells[a].classList.add("winner");
      cells[b].classList.add("winner");
      cells[c].classList.add("winner");
      resultDisplay.innerText = `${currentPlayer} Wins!`;
      isGameActive = false;
      lastStarter = currentPlayer; // Winner starts next game
      setTimeout(startGame, 3000); // Auto restart after 3 seconds
      return;
    }
  }

  if (!gameBoard.includes("")) {
    resultDisplay.innerText = "It's a Draw!";
    isGameActive = false;
    lastStarter = lastStarter === "X" ? "O" : "X"; // Swap starter after draw
    setTimeout(startGame, 3000); // Auto restart after 3 seconds
  }
}

function handleClick(event) {
  if (!isGameActive) return;
  const index = event.target.getAttribute("data-index");
  if (gameBoard[index] !== "") return;

  gameBoard[index] = currentPlayer;
  event.target.innerText = currentPlayer;

  checkWinner();

  if (isGameActive) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateTurnIndicator();

    if (mode !== "2P" && currentPlayer === "O") {
      setTimeout(aiMove, 500);
    }
  }
}

function aiMove() {
  let emptyCells = [];
  gameBoard.forEach((cell, index) => {
    if (cell === "") emptyCells.push(index);
  });

  let move;
  if (mode === "easy") {
    move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }
  else if (mode === "normal") {
    move = findBestMove("O") || findBestMove("X") || emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }
  else if (mode === "hard") {
    move = minimax(gameBoard, "O").index;
  }

  gameBoard[move] = "O";
  cells[move].innerText = "O";
  checkWinner();
  currentPlayer = "X";
  updateTurnIndicator();
}

function findBestMove(player) {
  for (let pattern of [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]) {
    let [a, b, c] = pattern;
    let values = [gameBoard[a], gameBoard[b], gameBoard[c]];

    if (values.filter(v => v === player).length === 2 && values.includes("")) {
      return pattern[values.indexOf("")];
    }
  }
  return null;
}

function minimax(board, player) {
  let emptyCells = board.map((cell, index) => cell === "" ? index : null).filter(v => v !== null);

  if (checkWin(board, "X")) return { score: -10 };
  if (checkWin(board, "O")) return { score: 10 };
  if (emptyCells.length === 0) return { score: 0 };

  let moves = [];
  for (let index of emptyCells) {
    let newBoard = [...board];
    newBoard[index] = player;

    let result = minimax(newBoard, player === "O" ? "X" : "O");
    moves.push({ index, score: result.score });
  }

  return moves.reduce((best, move) =>
    (player === "O" ? move.score > best.score : move.score < best.score) ? move : best
  );
}

function checkWin(board, player) {
  return [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ].some(pattern => pattern.every(index => board[index] === player));
}

function changeMode() {
  mode = document.getElementById("mode").value;
  startGame();
}

cells.forEach(cell => cell.addEventListener("click", handleClick));
startGame();
