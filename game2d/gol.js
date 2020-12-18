const rows = 50;
const cols = 80;

// Need 2D arrays. These are 1D
let currGen = [rows];
let nextGen = [rows];
let control = [3];
let started = false;// Set to true when use clicks start
let timer;//To control evolutions
let evolutionSpeed = 150;// One second between generations
let drawingMode = false;

// Creates two-dimensional arrays
function createGenArrays() {
    for (let i = 0; i < rows; i++) {
        currGen[i] = new Array(cols);
        nextGen[i] = new Array(cols);
    }
}
function initGenArrays() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            currGen[i][j] = 0;
            nextGen[i][j] = 0;
        }
    }
}

function createControlGrid() {
    let tab = document.querySelector('#configGrid');
    for (let i = 0; i < 3; i++) {
        control[i] = new Array(3);
        let tr = document.createElement('tr');
        for (let j = 0; j < 3; j++) {
            // control[i][j]=1;
            let cell = document.createElement('td')
            cell.setAttribute('id', i + '_' + j);
            //cell.setAttribute('class', 'control');
            cell.setAttribute('class', 'selected');
            control[i][j] = 1;
            //cell.setAttribute('class', 'unselected');
            cell.addEventListener('click', controlCellClick);
            if (i == 1 && j == 1) {
                cell.setAttribute('class', 'centerCell');
                cell.removeEventListener('click', controlCellClick)
            }
            tr.appendChild(cell);
        }
        tab.appendChild(tr);
    }

}

function controlCellClick() {
    let loc = this.id.split("_");
    let row = Number(loc[0]);//Get i
    let col = Number(loc[1]);//Get j
    // Toggle cell alive or dead
    if (this.className === 'selected') {
        this.setAttribute('class', 'unselected');
        //console.log('row', row, 'col',col)
        control[row][col] = 0;

    } else {
        this.setAttribute('class', 'selected');
        control[row][col] = 1;

    }
}

function createWorld() {
    let world = document.querySelector('#world');

    let tbl = document.createElement('table');
    tbl.setAttribute('id', 'worldgrid');
    for (let i = 0; i < rows; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement('td');
            cell.setAttribute('id', i + '_' + j);
            cell.setAttribute('class', 'dead');
            cell.addEventListener('click', cellClick);
            cell.addEventListener('dblclick', cellDbClick)
            cell.addEventListener('mouseenter', cellHover);

            tr.appendChild(cell);
        }
        tbl.appendChild(tr);
    }
    world.appendChild(tbl);
}
window.onload = () => {
    createWorld();
    createControlGrid();
    createGenArrays();// current and next generations
    initGenArrays();//Set all array locations to 0=deads

    let speed = document.querySelector('#speed');
    speed.addEventListener('change', function () {
        //console.log(evolutionSpeed)
        evolutionSpeed = parseInt(this.value);
        //alert("change")
    })
}


function startStopGol() {
    let startstop = document.querySelector('#btnstartstop');
    if (!started) {
        started = true;
        startstop.value = ' || ';
        startstop.className = 'btnstop';
        evolve();

    } else {
        started = false;
        startstop.value = ' ▶ ';
        startstop.className = 'btnstart';
        clearTimeout(timer);
    }
}

function cellClick() {
    let loc = this.id.split("_");
    let row = Number(loc[0]);//Get i
    let col = Number(loc[1]);//Get j
    // Toggle cell alive or dead
    if (this.className === 'alive') {
        this.setAttribute('class', 'dead');
        currGen[row][col] = 0;

    } else {
        this.setAttribute('class', 'alive');
        currGen[row][col] = 1;

    }
}

function cellDbClick() {
    drawingMode = !drawingMode
}

function cellHover(e) {
    if (drawingMode) {
        let loc = this.id.split("_");
        let row = Number(loc[0]); //Get i
        let col = Number(loc[1]); //Get j
        // Toggle cell alive or dead

        this.setAttribute('class', 'alive');
        currGen[row][col] = 1;
    }

}

function getNeighborCount(row, col) {
    let count = 0;
    let nrow = Number(row);
    let ncol = Number(col);

    // Make sure we are not at the first row
    if (nrow - 1 >= 0) {
        if (control[0][1]) {

            // Check top neighbor
            if (currGen[nrow - 1][ncol] == 1) {

                count++;
            }
        }
    }
    // Make sure we are not in the first cell
    // Upper left corner
    if (nrow - 1 >= 0 && ncol - 1 >= 0) {
        if (control[0][0]) {

            //Check upper left neighbor
            if (currGen[nrow - 1][ncol - 1] == 1) {

                count++;
            }
        }
    }
    // Make sure we are not on the first row last column
    // Upper right corner
    if (nrow - 1 >= 0 && ncol + 1 < cols) {
        if (control[0][2]) {

            //Check upper right neighbor
            if (currGen[nrow - 1][ncol + 1] == 1) {

                count++;
            }
        }
    }
    // Make sure we are not on the first column
    if (ncol - 1 >= 0) {
        if (control[1][0]) {

            //Check left neighbor
            if (currGen[nrow][ncol - 1] == 1) {

                count++;
            }
        }
    }
    // Make sure we are not on the last column
    if (ncol + 1 < cols) {
        if (control[1][2]) {

            //Check right neighbor
            if (currGen[nrow][ncol + 1] == 1) {

                count++;
            }
        }
    }
    // Make sure we are not on the bottom left corner
    if (nrow + 1 < rows && ncol - 1 >= 0) {
        if (control[2][0]) {

            //Check bottom left neighbor
            if (currGen[nrow + 1][ncol - 1] == 1) {

                count++;
            }
        }
    }
    // Make sure we are not on the bottom right
    if (nrow + 1 < rows && ncol + 1 < cols) {
        if (control[2][2]) {

            //Check bottom right neighbor
            if (currGen[nrow + 1][ncol + 1] == 1) {

                count++;
            }
        }
    }

    // Make sure we are not on the last row
    if (nrow + 1 < rows) {
        if (control[2][1]) {

            //Check bottom neighbor
            if (currGen[nrow + 1][ncol] == 1) {

                count++;
            }
        }
    }


    return count;
}

function createNextGen() {
    for (row in currGen) {
        for (col in currGen[row]) {

            let neighbors = getNeighborCount(row, col);

            // Check the rules
            // If Alive
            if (currGen[row][col] == 1) {

                if (neighbors < 2 || neighbors > 3) {
                    nextGen[row][col] = 0;
                } else if (neighbors == 2 || neighbors == 3) {
                    nextGen[row][col] = 1;
                }
            } else if (currGen[row][col] == 0) {
                // If Dead or Empty

                if (neighbors == 3) {
                    // Propogate the species
                    nextGen[row][col] = 1;//Birth?
                }
            }
        }
    }

}

function updateCurrGen() {

    for (row in currGen) {
        for (col in currGen[row]) {
            // Update the current generation with
            // the results of createNextGen function
            currGen[row][col] = nextGen[row][col];
            // Set nextGen back to empty
            nextGen[row][col] = 0;
        }
    }

}

function updateWorld() {
    let cell = '';
    for (row in currGen) {
        for (col in currGen[row]) {
            cell = document.getElementById(row + '_' + col);
            if (currGen[row][col] == 0) {
                cell.setAttribute('class', 'dead');
            } else {
                cell.setAttribute('class', 'alive');
            }
        }
    }
}

function evolve() {

    createNextGen();//Apply the rules
    updateCurrGen();//Set Current values from new generation
    updateWorld();//Update the world view
    if (started) {
        timer = setTimeout(evolve, evolutionSpeed);
    }
}

function resetWorld() {
    location.reload();
}