//first player start and board empty
let player = 'O';
let board = ["","","","","","","","",""];
let playing = false;
let gameStarted = false;

let playerOName = "Player O";
let playerXName = "Player X";
let scoreO = 0;
let scoreX = 0;

//winning combination with type and position
let wins = [
    { combo: [0, 1, 2], type: "row", pos: 0 },
    { combo: [3, 4, 5], type: "row", pos: 1 },
    { combo: [6, 7, 8], type: "row", pos: 2 },
    { combo: [0, 3, 6], type: "col", pos: 0 },
    { combo: [1, 4, 7], type: "col", pos: 1 },
    { combo: [2, 5, 8], type: "col", pos: 2 },
    { combo: [0, 4, 8], type: "diag", pos: 0 },
    { combo: [2, 4, 6], type: "diag", pos: 1 }
];

// get elements
let boxes = document.querySelectorAll(".box");
let turns = document.querySelector(".turn p");
let message = document.querySelector(".message p");
let startButton = document.querySelector(".start-btn");
let resetScoreBtn = document.getElementById("resetScoreBtn");
let popup = document.getElementById("popup");
let playBtn = document.getElementById("playBtn");
let inputO = document.getElementById("inputO");
let inputX = document.getElementById("inputX");
let nameO = document.getElementById("nameO");
let nameX = document.getElementById("nameX");
let scoreODisplay = document.getElementById("scoreO");
let scoreXDisplay = document.getElementById("scoreX");
let strikeRow = document.getElementById("strikeRow");
let strikeCol = document.getElementById("strikeCol");
let strikeDiag = document.getElementById("strikeDiag");


function showStrike(type, pos) {
    if (type === "row") {
        strikeRow.style.display = "block";
        strikeRow.style.top = (46 + pos * 110) + "px";
    } 
    else if (type === "col") {
        strikeCol.style.display = "block";
        strikeCol.style.left = (46 + pos * 110) + "px";
    } 
    else if (type === "diag") {
        strikeDiag.style.display = "block";
        if (pos === 0) {
            strikeDiag.style.transform = "rotate(45deg)";
        } else {
            strikeDiag.style.transform = "rotate(-45deg)";
        }
    }
}

// hide all strikes
function hideStrike() {
    strikeRow.style.display = "none";
    strikeCol.style.display = "none";
    strikeDiag.style.display = "none";
}

//save name
function saveNames() {
    localStorage.setItem("playerOName", playerOName);
    localStorage.setItem("playerXName", playerXName);
}

//load name
function loadNames() {
    let savedO = localStorage.getItem("playerOName");
    let savedX = localStorage.getItem("playerXName");

    if (savedO) {
        playerOName = savedO;
        nameO.textContent = playerOName;
    }

    if (savedX) {
        playerXName = savedX;
        nameX.textContent = playerXName;
    }
}

//save score 
function saveScores() {
    localStorage.setItem("scoreO", scoreO);
    localStorage.setItem("scoreX", scoreX);
}

// load score
function loadScores() {
    let savedScoreO = localStorage.getItem("scoreO");
    let savedScoreX = localStorage.getItem("scoreX");

    if (savedScoreO) {
        scoreO = parseInt(savedScoreO);
    }

    if (savedScoreX) {
        scoreX = parseInt(savedScoreX);
    }

    scoreODisplay.textContent = scoreO;
    scoreXDisplay.textContent = scoreX;
}

// save game state
function saveGameState() {
    localStorage.setItem("board", JSON.stringify(board));
    localStorage.setItem("currentPlayer", player);
    localStorage.setItem("playing", playing);
    localStorage.setItem("gameStarted", gameStarted);
}

// load game state
function loadGameState() {
    let savedBoard = localStorage.getItem("board");
    let savedPlayer = localStorage.getItem("currentPlayer");
    let savedPlaying = localStorage.getItem("playing");
    let savedGameStarted = localStorage.getItem("gameStarted");

    if (savedBoard) {
        board = JSON.parse(savedBoard);
        player = savedPlayer;
        playing = (savedPlaying === "true");
        gameStarted = (savedGameStarted === "true");

        for (let i = 0; i < 9; i++) {
            boxes[i].textContent = board[i];
        }

        if (playing) {
            turns.textContent = getPlayerName() + "'s Turn (" + player + ")";
            startButton.textContent = "Reset";
        } else if (gameStarted) {
            startButton.textContent = "Reset";
            let winData = checkWin();
            if (winData) {
                let winCombo = winData.combo;
                let winner = board[winCombo[0]];
                let winnerName = (winner === 'O') ? playerOName : playerXName;
                message.textContent = winnerName + " Wins!";
                boxes[winCombo[0]].classList.add("win");
                boxes[winCombo[1]].classList.add("win");
                boxes[winCombo[2]].classList.add("win");
                showStrike(winData.type, winData.pos);
            } else if (checkDraw()) {
                message.textContent = "It's a Draw!";
            }
        }
    }
}

// add win
function addWin(p) {
    if (p === 'O') {
        scoreO = scoreO + 1;
        scoreODisplay.textContent = scoreO;
    } else {
        scoreX = scoreX + 1;
        scoreXDisplay.textContent = scoreX;
    }
    saveScores();
}

// reset scores
function resetScores() {
    scoreO = 0;
    scoreX = 0;
    scoreODisplay.textContent = 0;
    scoreXDisplay.textContent = 0;
    saveScores();
}

// load saved data
loadNames();
loadScores();
loadGameState(); 

// check win
function checkWin() {
    for (let i = 0; i < wins.length; i++) {
        let a = wins[i].combo[0];
        let b = wins[i].combo[1];
        let c = wins[i].combo[2];
        if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
            return wins[i];
        }
    }
    return null;
}

// check draw
function checkDraw() {
    for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
            return false;
        }
    }
    return true;
}

// get player name
function getPlayerName() {
    if (player === 'O') {
        return playerOName;
    } else {
        return playerXName;
    }
}

// start game
function startGame() {
    player = "O";
    board = ["", "", "", "", "", "", "", "", ""];
    playing = true;
    turns.textContent = playerOName + "'s Turn (O)";
    message.textContent = "";
    startButton.textContent = "Reset";
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].textContent = "";
        boxes[i].classList.remove("win");
    }
    hideStrike();
    saveGameState();  
}

// box clicked
function boxClicked(index) {
    if (playing && board[index] === '') {
        board[index] = player;
        boxes[index].textContent = player;
        let winData = checkWin();
        if (winData) {
            let winCombo = winData.combo;
            message.textContent = getPlayerName() + " Wins!";
            boxes[winCombo[0]].classList.add("win");
            boxes[winCombo[1]].classList.add("win");
            boxes[winCombo[2]].classList.add("win");
            showStrike(winData.type, winData.pos);
            addWin(player);
            playing = false;
            saveGameState();  
        } else if (checkDraw()) {
            message.textContent = "It's a Draw!";
            playing = false;
            saveGameState();  
        } else {
            player = (player === 'O') ? 'X' : 'O';
            turns.textContent = getPlayerName() + "'s Turn (" + player + ")";
            saveGameState();  
        }
    }
}

// start button
startButton.onclick = function() {
    if (!gameStarted) {
        inputO.value = playerOName !== "Player O" ? playerOName : "";
        inputX.value = playerXName !== "Player X" ? playerXName : "";
        popup.style.display = "flex";
    } else {
        startGame();
    }
};

// reset score button
resetScoreBtn.onclick = function() {
    resetScores();
};

// play button click
playBtn.onclick = function() {
    if (inputO.value !== '') {
        playerOName = inputO.value;
    } else {
        playerOName = "Player O";
    }

    if (inputX.value !== '') {
        playerXName = inputX.value;
    } else {
        playerXName = "Player X";
    }

    nameO.textContent = playerOName;
    nameX.textContent = playerXName;

    saveNames();

    popup.style.display = "none";
    gameStarted = true;
    startGame();
};

// box click events
for (let i = 0; i < 9; i++) {
    boxes[i].onclick = function() {
        boxClicked(i);
    };
}