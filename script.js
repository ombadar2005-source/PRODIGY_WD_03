// script.js
const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const modeBtn = document.getElementById('modeBtn');
const modePill = document.getElementById('modePill');
const restartBtn = document.getElementById('restartBtn');

const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const scoreDrawEl = document.getElementById('scoreDraw');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let vsAi = false;

let scoreX = 0;
let scoreO = 0;
let scoreDraw = 0;

const winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'), 10);

    if (!isGameActive || board[index] !== '') return;

    placeMarker(index, currentPlayer);
    const result = checkGameStatus();

    if (!result.gameOver && vsAi && currentPlayer === 'O') {
        setTimeout(aiMove, 220);
    }
}

function placeMarker(index, player) {
    board[index] = player;
    const cell = cells[index];
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
}

function checkGameStatus() {
    let winner = null;
    let winningLine = null;

    for (const pattern of winningPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            winner = board[a];
            winningLine = pattern;
            break;
        }
    }

    if (winner) {
        isGameActive = false;
        highlightWin(winningLine);
        updateScore(winner);
        statusText.textContent = `Player ${winner} wins`;
        return { gameOver: true, winner };
    }

    if (!board.includes('')) {
        isGameActive = false;
        updateScore('draw');
        statusText.textContent = 'Game ended in a draw';
        return { gameOver: true, winner: null };
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
    return { gameOver: false, winner: null };
}

function highlightWin(pattern) {
    pattern.forEach(i => cells[i].classList.add('win'));
}

function updateScore(result) {
    if (result === 'X') {
        scoreX += 1;
        scoreXEl.textContent = scoreX;
    } else if (result === 'O') {
        scoreO += 1;
        scoreOEl.textContent = scoreO;
    } else {
        scoreDraw += 1;
        scoreDrawEl.textContent = scoreDraw;
    }
}

function aiMove() {
    if (!isGameActive) return;

    const emptyIndices = board
        .map((val, i) => (val === '' ? i : null))
        .filter(i => i !== null);

    if (emptyIndices.length === 0) return;

    let move = findWinningMove('O');
    if (move === null) {
        move = findWinningMove('X');
    }
    if (move === null) {
        const center = 4;
        if (board[center] === '') {
            move = center;
        }
    }
    if (move === null) {
        const corners = [0, 2, 6, 8].filter(i => board[i] === '');
        if (corners.length > 0) {
            move = corners[Math.floor(Math.random() * corners.length)];
        }
    }
    if (move === null) {
        move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }

    placeMarker(move, 'O');
    checkGameStatus();
}

function findWinningMove(player) {
    for (const pattern of winningPatterns) {
        const [a, b, c] = pattern;
        const values = [board[a], board[b], board[c]];
        if (
            values.filter(v => v === player).length === 2 &&
            values.includes('')
        ) {
            const emptyIndex = [a, b, c][values.indexOf('')];
            return emptyIndex;
        }
    }
    return null;
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    statusText.textContent = 'Player X starts';

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'win');
    });
}

function toggleMode() {
    vsAi = !vsAi;
    restartGame();
    if (vsAi) {
        modeBtn.textContent = 'Play with friend';
        modePill.textContent = 'Vs Kaalix';
    } else {
        modeBtn.textContent = 'Play vs Kaalix';
        modePill.textContent = '2 Players';
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
modeBtn.addEventListener('click', toggleMode);
