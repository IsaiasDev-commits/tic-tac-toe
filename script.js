const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart-btn');
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];

function checkWinner() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      setTimeout(() => alert(`${currentPlayer} gana!`), 100);
      return true;
    }
  }
  return gameBoard.every(cell => cell !== '') ? (setTimeout(() => alert("Empate!"), 100), true) : false;
}

function handleClick(event) {
  const index = event.target.dataset.cellIndex;

  if (!gameBoard[index]) {
    gameBoard[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWinner()) {
      cells.forEach(cell => cell.removeEventListener('click', handleClick));
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
  }
}

function resetGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => {
    cell.textContent = '';
    cell.addEventListener('click', handleClick);
  });
  currentPlayer = 'X';
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', resetGame);
