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

// Sonidos
const soundWin = new Audio('sounds/win.mp3');
const soundLose = new Audio('sounds/lose.mp3');
const soundDraw = new Audio('sounds/draw.mp3');


function minimax(board, depth, isMaximizingPlayer) {
    const scores = { X: -1, O: 1, tie: 0 };

    let winner = checkWinnerMinimax(board);
    if (winner !== null) {
        return scores[winner];
    }

    if (!board.includes('')) return scores.tie; 

    let bestScore = isMaximizingPlayer ? -Infinity : Infinity;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = isMaximizingPlayer ? ai : player;
            let score = minimax(board, depth + 1, !isMaximizingPlayer);
            board[i] = ''; 

            bestScore = isMaximizingPlayer
                ? Math.max(score, bestScore)
                : Math.min(score, bestScore);
        }
    }
    return bestScore;
}

function aiMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = ai;
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = ''; 

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    gameBoard[move] = ai;
    cells[move].textContent = ai;

    if (!checkWinner()) {
        currentPlayer = player;
        statusText.textContent = `Turno de ${currentPlayer}`;
    }
}

function checkWinnerMinimax(board) {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // 'X' o 'O' como ganador
        }
    }

    return board.includes('') ? null : 'tie'; 
}

function startGame(symbol) {
    player = symbol;
    ai = symbol === 'X' ? 'O' : 'X';
    gameBoard.fill('');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner', 'lose');
    });

    gameActive = true;
    currentPlayer = 'X';

    
    playerSelection.classList.add('hidden');
    gameBoardContainer.classList.remove('hidden');
    statusText.classList.remove('hidden');
    restartBtn.classList.remove('hidden');
    resetScoreBtn.classList.remove('hidden');
    scoreboard.classList.remove('hidden');

    statusText.textContent = `Turno de ${currentPlayer}`;
    
    
    cells.forEach(cell => cell.addEventListener('click', handleClick));

    
    aiMove();
}

function checkWinner() {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            if (gameBoard[a] === player) {
                // Si el jugador X o O gana
                highlightWinner(pattern);
                statusText.textContent = `${currentPlayer} gana!`;
                scores[currentPlayer]++;
                updateScoreboard();
                soundWin.play();  
                gameActive = false;
                return true;
            } else {
                
                highlightLoser(pattern);  
                statusText.textContent = `${ai} gana!`;
                scores[ai]++;
                updateScoreboard();
                soundLose.play();  
                gameActive = false;
                return true;
            }
        }
    }

    if (!gameBoard.includes('')) {
        statusText.textContent = "Empate!";
        soundDraw.play();
        gameActive = false;
        return true;
    }

    return false;
}

function highlightWinner(pattern) {
    pattern.forEach(index => {
        cells[index].classList.add('winner');
        cells[index].style.transition = 'background-color 0.3s ease, transform 0.3s ease';
    });
}

function highlightLoser(pattern) {
    pattern.forEach(index => {
        cells[index].classList.add('lose');
        cells[index].style.transition = 'background-color 0.3s ease, transform 0.3s ease';
    });
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
                setTimeout(aiMove, 500); 
            }
        }
    }
}

function resetGame() {
    gameBoard.fill('');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner', 'lose');
    });
 
    playerSelection.classList.remove('hidden');
    gameBoardContainer.classList.add('hidden');
    statusText.classList.add('hidden');
    restartBtn.classList.add('hidden');
    resetScoreBtn.classList.add('hidden');
    scoreboard.classList.add('hidden');
}

function resetScore() {
    scores = { X: 0, O: 0 };
    updateScoreboard();
}

function updateScoreboard() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}


chooseX.addEventListener('click', () => startGame('X'));
chooseO.addEventListener('click', () => startGame('O'));


restartBtn.addEventListener('click', resetGame);
resetScoreBtn.addEventListener('click', resetScore);


