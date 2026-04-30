// script.js
const statusDisplay = document.querySelector('#status');
const cells = document.querySelectorAll('.cell');
const restartBtn = document.querySelector('#restartBtn');

let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const winningMessage = () => `🎉 Player ${currentPlayer} Wins! 🎉`;
const drawMessage = () => `It's a Draw! 🤝`;
const currentPlayerTurn = () => `Player ${currentPlayer}'s Turn`;

statusDisplay.innerHTML = currentPlayerTurn();

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
    
    // Add specific class for color (x or o) and animation (placed)
    clickedCell.classList.add(currentPlayer.toLowerCase()); 
    clickedCell.classList.add('placed');
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    let winningCombo = []; // To store which cells won

    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningCombo = winCondition; // Save the winning indices
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        highlightWinningCells(winningCombo); // Trigger the visual effect
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

// New function to apply the winning effect
function highlightWinningCells(combo) {
    combo.forEach(index => {
        const cell = document.querySelector(`[data-cell-index='${index}']`);
        cell.classList.add('win-animation');
    });
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    
    cells.forEach(cell => {
        cell.innerHTML = "";
        // Remove all classes except 'cell'
        cell.className = "cell"; 
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', handleRestartGame);
