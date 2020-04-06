var rows = 100;
var cols = 200;
var playing = false;
var startButton = document.getElementById("start");
var clearButton = document.getElementById("clear");
var randomButton = document.getElementById("random");
var grid = new Array(rows);
var nextGrid = new Array(rows);
var reproductionTime = 100;
var timer;

// initialize
function initialize() {
    createTable();
    initTable();
    clearTable();
    startButton.onclick = startButtonHandler;
    clearButton.onclick = clearButtonHandler;
    randomButton.onclick = randomButtonHandler;
}

// lay out the board
function createTable() {
    var gridContainer = document.getElementById("gridContainer");
    if (!gridContainer) {
        // throw error
        console.error("Problem: no div for the grid table!");
    }
    var table = document.createElement("table");

    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
}
function cellClickHandler() {
    var classes = this.getAttribute("class");
    var loc = this.id.split("_");
    if (classes.indexOf("live") > -1) {
        this.setAttribute("class", "dead");
        grid[loc[0]][loc[1]] = 0;
    } else {
        this.setAttribute("class", "live");
        grid[loc[0]][loc[1]] = 1;
    }
}

function initTable(){
  for (i=0; i<rows; i++){
    grid[i] = new Array(cols);
    nextGrid[i] = new Array(cols);
  }
}  

function clearTable(){
  for (i=0; i<rows; i++){
    for (j=0; j<cols; j++){
      grid[i][j] = 0;
      nextGrid[i][j] = 0;
    }
  }
}  

function updateAndClearGrid(){
  for (i=0; i<rows; i++){
    for (j=0; j<cols; j++){
      grid[i][j] = nextGrid[i][j];
      nextGrid[i][j] = 0;
    }
  }
}  

function updateView(){
  for (i=0; i<rows; i++){
    for (j=0; j<cols; j++){
      var cell = document.getElementById(i + "_" +j);
      if (grid[i][j] === 0) { 
        cell.setAttribute("class", "dead");
      } else if (grid[i][j] === 1) { 
        cell.setAttribute("class", "live");
      }
    }
  }
}  

function play(){
  console.log("Play the game");
  computeNextGen();
  if (playing) {
    timer = setTimeout(play, reproductionTime);
  }
}  

function startButtonHandler() {
  if (playing) {
    console.log("Pause the game");
    playing = false;
   this.innerHTML = 'continue';
    clearTimeout(timer);
  } else {
    console.log("Start/continue the game");
    playing = true;
    this.innerHTML = 'pause';
    play();
  }
}

function clearButtonHandler() {
  console.log("Clear the game");
  playing = false;
  clearTimeout(timer);
  clearTable();
  updateView();
  startButton.innerHTML = 'start';
}

function randomButtonHandler() {
  if (playing) return;
  console.log("Random setup");
  for (i=0; i<rows; i++){
    for (j=0; j<cols; j++){
      grid[i][j] = Math.round(Math.random());
    }
  }
  updateView();
}

function computeNextGen() {
  for (i=0; i<rows; i++){
    for (j=0; j<cols; j++){
      applyRules(i, j);
    }
  }
  updateAndClearGrid();
  updateView();
}

function applyRules(row, col){
  var numberNeighbor = countNeighbors(row,col);
  if (grid[row][col] == 1) {
    if (numberNeighbor < 2) {
      nextGrid[row][col] = 0;
    } else if (numberNeighbor == 2 || numberNeighbor == 3) {
      nextGrid[row][col] = 1;
    } else if (numberNeighbor > 3) {
      nextGrid[row][col] = 0;
    }
  } else if (grid[row][col] == 0) {
    if (numberNeighbor == 3) {
      nextGrid[row][col] = 1;
    }
  }
}


function countNeighbors(row, col){
  var count = 0;
  if (row-1 >= 0 && col-1 >= 0) {
    if (grid[row-1][col-1] === 1) {count++}
  }      
  if (row-1 >= 0) {
    if (grid[row-1][col] === 1) {count++}
  }      
  if (row-1 >= 0 && col+1 < cols) {
    if (grid[row-1][col+1] === 1) {count++}
  }      
  if (col-1 >= 0) {
    if (grid[row][col-1] === 1) {count++}
  }      
  if (col+1 < cols) {
    if (grid[row][col+1] === 1) {count++}
  }      
  if (row+1 < rows && col-1 >= 0) {
    if (grid[row+1][col-1] === 1) {count++}
  }      
  if (row+1 < rows) {
    if (grid[row+1][col] === 1) {count++}
  }      
  if (row+1 < rows && col+1 < cols) {
    if (grid[row+1][col+1] === 1) {count++}
  }      
  return count;
}

// start everything

window.onload = initialize;