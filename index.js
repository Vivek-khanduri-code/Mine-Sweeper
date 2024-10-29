var board = [];
var rows = 8;
var columns = 8;

var minesCount = 5;
var minesLocation = []; // ["2-2", "3-4", "2-1"]

var titleClicked = 0; // goal to click all tiles except the ones containing mines
var flagEnabled = false;
var gameOver = false;

window.onload = function () {
    startGame();
}

function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    setMines();

    // Populate our board 
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board); // Log the board structure
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.background = "lightgray";
    } else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile(event) {
    if (gameOver || event.target.classList.contains("tile-clicked")) {
        return;
    }

    let tile = event.target;

    if (flagEnabled) {
        // Toggle flag on the tile
        if (tile.innerText === "") {
            tile.innerText = "🚩";
        } else if (tile.innerText === "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
        gameOver = true;
        revealMines();  // Reveal mines once the game is over
        return;
    }

    // If tile already has a number or a class indicating it's revealed, do nothing
    if (tile.innerText !== "" || tile.classList.contains("revealed")) {
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMines(r, c);
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";  // Reveal mine
                tile.style.background = "red";  // Mark mine tiles in red
            }
        }
    }
}

function checkMines(r, c) {
    // Ensure the boundaries
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }

    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    titleClicked += 1;

    let minesFound = 0;

    // Check surrounding 8 tiles
    minesFound += checkTile(r - 1, c - 1);  // top left
    minesFound += checkTile(r - 1, c);      // top 
    minesFound += checkTile(r - 1, c + 1);  // top right

    minesFound += checkTile(r, c - 1);      // left
    minesFound += checkTile(r, c + 1);      // right

    minesFound += checkTile(r + 1, c - 1);  // bottom left
    minesFound += checkTile(r + 1, c);      // bottom
    minesFound += checkTile(r + 1, c + 1);  // bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    } else {
        // Recursively check surrounding tiles if no mines are found
        checkMines(r - 1, c - 1); // top left 
        checkMines(r - 1, c);     // top
        checkMines(r - 1, c + 1); // top right

        checkMines(r, c - 1);     // left
        checkMines(r, c + 1);     // right

        checkMines(r + 1, c - 1); // bottom left
        checkMines(r + 1, c);     // bottom
        checkMines(r + 1, c + 1); // bottom right
    }

    // Check for win condition
    if (titleClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }
}

function checkTile(r, c) {
    // Ensure the boundaries
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }

    if (minesLocation.includes(`${r}-${c}`)) {
        return 1;
    }
    return 0;
}
