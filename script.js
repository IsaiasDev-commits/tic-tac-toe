const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restart-btn');
const resetScoreBtn = document.getElementById('reset-score-btn');
const statusText = document.getElementById('status');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const playerSelection = document.getElementById('player-selection');
const chooseX = document.getElementById('choose-x');
const chooseO = document.getElementById('choose-o');
const gameBoardContainer = document.getElementById('game-board');
const scoreboard = document.getElementById('scoreboard');

let player = 'X';
let ai = 'O';
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let scores = { X: 0, O: 0 };

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

function startGame(symbol) {
    player = symbol;
    ai = symbol === 'X' ? 'O' : 'X';
    gameBoard.fill('');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner');
    });

    gameActive = true;
    currentPlayer = 'X';

    // Mostrar el tablero y ocultar la selección
    playerSelection.classList.add('hidden');
    gameBoardContainer.classList.remove('hidden');
    statusText.classList.remove('hidden');
    restartBtn.classList.remove('hidden');
    resetScoreBtn.classList.remove('hidden');
    scoreboard.classList.remove('hidden');

    statusText.textContent = `Turno de ${currentPlayer}`;
    
    // Asignar eventos a las celdas
    cells.forEach(cell => cell.addEventListener('click', handleClick));

    // Hacer que la IA siempre empiece, independientemente del símbolo del jugador
    aiMove();
}

function checkWinner() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            highlightWinner(pattern);
            statusText.textContent = `${currentPlayer} gana!`;
            scores[currentPlayer]++;
            updateScoreboard();
            gameActive = false;
            return true;
        }
    }

    if (!gameBoard.includes('')) {
        statusText.textContent = "Empate!";
        gameActive = false;
        return true;
    }

    return false;
}

function highlightWinner(pattern) {
    pattern.forEach(index => cells[index].classList.add('winner'));
}

function handleClick(event) {
    if (!gameActive) return;

    const index = event.target.dataset.cellIndex;

    if (!gameBoard[index]) {
        gameBoard[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        
        if (!checkWinner()) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusText.textContent = `Turno de ${currentPlayer}`;

            if (currentPlayer === ai) {
                setTimeout(aiMove, 500); // Retraso para que parezca más natural
            }
        }
    }
}

function aiMove() {
    let emptyCells = gameBoard.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    if (emptyCells.length === 0) return;

    let move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameBoard[move] = ai;
    cells[move].textContent = ai;
    
    if (!checkWinner()) {
        currentPlayer = player;
        statusText.textContent = `Turno de ${currentPlayer}`;
    }
}

function resetGame() {
    gameBoard.fill('');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner');
    });

    currentPlayer = 'X';
    gameActive = true;
    statusText.textContent = `Turno de ${currentPlayer}`;

    if (player === 'O') {
        aiMove();
    }
}

function updateScoreboard() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}

function resetScores() {
    scores = { X: 0, O: 0 };
    updateScoreboard();
}

// Eventos de selección de jugador
chooseX.addEventListener('click', () => startGame('X'));
chooseO.addEventListener('click', () => startGame('O'));

// Botones de control
restartBtn.addEventListener('click', resetGame);
resetScoreBtn.addEventListener('click', resetScores);
