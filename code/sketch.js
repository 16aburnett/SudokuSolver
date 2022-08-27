// Sudoku Solver
// By Amy Burnett
//========================================================================

let board = [
//   0  1  2   3  4  5   6  7  8
    [4, 9, 7,  0, 3, 0,  6, 0, 0], // 0
    [1, 0, 6,  5, 9, 0,  7, 3, 0], // 1
    [5, 0, 3,  0, 0, 4,  0, 1, 0], // 2

    [9, 3, 1,  0, 0, 0,  0, 0, 0], // 3
    [0, 0, 0,  0, 1, 5,  3, 4, 2], // 4
    [0, 0, 0,  0, 0, 0,  0, 0, 0], // 5

    [0, 5, 4,  8, 0, 1,  9, 0, 6], // 6
    [0, 1, 0,  2, 0, 6,  0, 7, 3], // 7
    [0, 6, 0,  0, 4, 9,  8, 0, 0]  // 8
];


// Cell structure
let boardX;
let boardY;
let boardWidth;
let boardHeight;
let boxWidth;
let boxHeight;
let cellWidth;
let cellHeight;
let cellBorderWidth = 1;
let boxBorderWidth = 4;
let selectBorderWidth = 6;
let selectBorderPadding = 3;

let selectedCells = [
//   0  1  2   3  4  5   6  7  8
    [0, 0, 0,  0, 0, 0,  0, 0, 0], // 0
    [0, 0, 0,  0, 0, 0,  0, 0, 0], // 1
    [0, 0, 0,  0, 0, 0,  0, 0, 0], // 2

    [0, 0, 0,  0, 0, 0,  0, 0, 0], // 3
    [0, 0, 0,  0, 0, 0,  0, 0, 0], // 4
    [0, 0, 0,  0, 0, 0,  0, 0, 0], // 5

    [0, 0, 0,  0, 0, 0,  0, 0, 0], // 6
    [0, 0, 0,  0, 0, 0,  0, 0, 0], // 7
    [0, 0, 0,  0, 0, 0,  0, 0, 0]  // 8
];
let isDragging = false;
let isSelecting = false;
let isShifting = false;
let cursorPosition = [0, 0];

let pencilMarks = [];

let cellColors = [];
const COLOR_WHITE  = 0; 
const COLOR_RED    = 1;  
const COLOR_ORANGE = 2; 
const COLOR_YELLOW = 3; 
const COLOR_GREEN  = 4; 
const COLOR_BLUE   = 5; 
const COLOR_PURPLE = 6; 
const COLOR_PINK   = 7; 
const COLOR_GRAY   = 8; 
const COLOR_BLACK  = 9; 
const RGBA_COLORS = [
    [255, 255, 255, 175], // WHITE 
    [255,  80,  80, 175], // RED   
    [255, 190,  80, 175], // ORANGE
    [255, 255,  80, 175], // YELLOW
    [ 80, 255,  80, 175], // GREEN 
    [137, 196, 244, 175], // BLUE  
    [160, 125, 253, 175], // PURPLE
    [230, 190, 230, 175], // PINK  
    [150, 150, 150, 175], // GRAY  
    [ 75,  75,  75, 175], // BLACK 
];

const MODE_DIGIT = 0;
const MODE_PENCIL = 1;
const MODE_COLOR = 2;
const NUM_MODES = 3;
let editMode = MODE_DIGIT;

let isSolved = false;

// [
//      timestep0: [board, pencilmarks, colors]
// ]
let history = [];

//========================================================================

function setup ()
{
    let canvas = createCanvas (600, 600);
    canvas.parent ("#canvasDiv");
    background (240);

    let padding = 10;

    boardX = padding;
    boardY = padding;
    boardWidth = width - 2 * padding;
    boardHeight = height - 2 * padding;

    boxWidth = boardWidth / 3;
    boxHeight = boardHeight / 3;

    cellWidth = boxWidth / 3;
    cellHeight = boxHeight / 3;

    for (let i = 0; i < 9; ++i)
    {
        // push row
        pencilMarks.push ([]);
        cellColors.push ([]);
        for (let j = 0; j < 9; ++j)
        {
            // push possible digits
            // digit              1 2 3 4 5 6 7 8 9
            // index              0 1 2 3 4 5 6 7 8
            pencilMarks[i].push ([0,0,0,0,0,0,0,0,0]);
            // push possible colors
            //                    R O Y G B P P G B
            //                    E R E R L U I R L
            //                    D A L E U R N A A
            //                      N L E E P K Y C
            //                      G O N   L     K
            //                      E W     E      
            // color id           1 2 3 4 5 6 7 8 9
            // index              0 1 2 3 4 5 6 7 8
            cellColors[i].push  ([0,0,0,0,0,0,0,0,0]);
        }
    }

    // Sync colors with HTML color buttons
    select ("#RED_BUTTON")   .style ("background-color", `rgba(${RGBA_COLORS[COLOR_RED][0]}, ${RGBA_COLORS[COLOR_RED][1]}, ${RGBA_COLORS[COLOR_RED][2]}, ${RGBA_COLORS[COLOR_RED][3]})`)
    select ("#ORANGE_BUTTON").style ("background-color", `rgba(${RGBA_COLORS[COLOR_ORANGE][0]}, ${RGBA_COLORS[COLOR_ORANGE][1]}, ${RGBA_COLORS[COLOR_ORANGE][2]}, ${RGBA_COLORS[COLOR_ORANGE][3]})`)
    select ("#YELLOW_BUTTON").style ("background-color", `rgba(${RGBA_COLORS[COLOR_YELLOW][0]}, ${RGBA_COLORS[COLOR_YELLOW][1]}, ${RGBA_COLORS[COLOR_YELLOW][2]}, ${RGBA_COLORS[COLOR_YELLOW][3]})`)
    select ("#GREEN_BUTTON") .style ("background-color", `rgba(${RGBA_COLORS[COLOR_GREEN][0]}, ${RGBA_COLORS[COLOR_GREEN][1]}, ${RGBA_COLORS[COLOR_GREEN][2]}, ${RGBA_COLORS[COLOR_GREEN][3]})`)
    select ("#BLUE_BUTTON")  .style ("background-color", `rgba(${RGBA_COLORS[COLOR_BLUE][0]}, ${RGBA_COLORS[COLOR_BLUE][1]}, ${RGBA_COLORS[COLOR_BLUE][2]}, ${RGBA_COLORS[COLOR_BLUE][3]})`)
    select ("#PURPLE_BUTTON").style ("background-color", `rgba(${RGBA_COLORS[COLOR_PURPLE][0]}, ${RGBA_COLORS[COLOR_PURPLE][1]}, ${RGBA_COLORS[COLOR_PURPLE][2]}, ${RGBA_COLORS[COLOR_PURPLE][3]})`)
    select ("#PINK_BUTTON")  .style ("background-color", `rgba(${RGBA_COLORS[COLOR_PINK][0]}, ${RGBA_COLORS[COLOR_PINK][1]}, ${RGBA_COLORS[COLOR_PINK][2]}, ${RGBA_COLORS[COLOR_PINK][3]})`)
    select ("#GRAY_BUTTON")  .style ("background-color", `rgba(${RGBA_COLORS[COLOR_GRAY][0]}, ${RGBA_COLORS[COLOR_GRAY][1]}, ${RGBA_COLORS[COLOR_GRAY][2]}, ${RGBA_COLORS[COLOR_GRAY][3]})`)
    select ("#BLACK_BUTTON") .style ("background-color", `rgba(${RGBA_COLORS[COLOR_BLACK][0]}, ${RGBA_COLORS[COLOR_BLACK][1]}, ${RGBA_COLORS[COLOR_BLACK][2]}, ${RGBA_COLORS[COLOR_BLACK][3]})`)

}

//========================================================================

function draw ()
{
    background (240);

    // draw each cell
    for (let i = 0; i < 9; ++i)
    {
        let y = boardY + i * cellHeight;
        for (let j = 0; j < 9; ++j)
        {
            let x = boardX + j * cellWidth;

            let cellCenterX = x + cellWidth / 2;
            let cellCenterY = y + cellHeight / 2;

            // draw cell
            stroke (0);
            strokeWeight (cellBorderWidth);
            fill (255);
            rect (x, y, cellWidth, cellHeight);

            // add cell color - if exists
            let numColors = cellColors[i][j].reduce((partialSum, a) => partialSum + a, 0);
            if (numColors != 0)
            {
                let colorStripeWidth = cellWidth / numColors;
                let colorsUsedSoFar = 0;
                for (let c = 0; c < 9; ++c)
                {
                    // ensure this color is present in this cell
                    if (cellColors[i][j][c] == 1)
                    {
                        let cellColor = RGBA_COLORS[c+1];
                        let colorX = x + colorsUsedSoFar * colorStripeWidth;
                        noStroke ();
                        fill (cellColor);
                        rect (colorX, y, colorStripeWidth, cellHeight);
                        ++colorsUsedSoFar;
                    }
                }
            }

            // Ensure digit does not conflict
            if (isCellConflicting (i, j))
            {
                stroke (0);
                strokeWeight (cellBorderWidth);
                fill (240, 70, 70, 255);
                rect (x, y, cellWidth, cellHeight); 

                stroke (200, 50, 50, 220);
                strokeWeight (selectBorderWidth);
                noFill ();
                let selectPadding = selectBorderPadding;
                // North line
                line (x+selectPadding, y+selectPadding, x+cellWidth-selectPadding, y+selectPadding);
                // East Line
                line (x+cellWidth-selectPadding, y+selectPadding, x+cellWidth-selectPadding, y+cellHeight-selectPadding);
                // South Line
                line (x+selectPadding, y+cellHeight-selectPadding, x+cellWidth-selectPadding, y+cellHeight-selectPadding);
                // West Line
                line (x+selectPadding, y+selectPadding, x+selectPadding, y+cellHeight-selectPadding);
            }
            

            // draw filled digit, if filled in (non-zero)
            if (board[i][j] != 0)
            {
                stroke (0);
                strokeWeight (1);
                fill (0);
                textFont ("Courier");
                textAlign (CENTER, CENTER);
                textSize (cellHeight);
                text (board[i][j], cellCenterX, cellCenterY + 5);
            }
            // if digit is not filled in, draw any penciled-in digits
            else
            {
                let pencilMarksStr = "";
                for (let p = 0; p < 9; ++p)
                {
                    if (pencilMarks[i][j][p])
                        pencilMarksStr = pencilMarksStr + (p+1);
                }

                // Ensure we have pencil marks
                if (pencilMarksStr.length > 0)
                {
                    stroke (0);
                    strokeWeight (1);
                    fill (0);
                    textFont ("Courier");
                    textAlign (CENTER, CENTER);
                    // iteratively decrease size until it fits
                    let strHeight = (cellHeight - 10) / 2;
                    textSize (strHeight);
                    while (textWidth (pencilMarksStr) >= cellWidth - 10)
                        textSize (--strHeight);
                    text (pencilMarksStr, cellCenterX, cellCenterY + 5);
                }
            }
        }
    }

    // draw box borders
    for (let i = 0; i < 3; ++i)
    {
        let y = boardY + i * boxWidth;
        for (let j = 0; j < 3; ++j)
        {
            let x = boardX + j * boxHeight;
            stroke (0);
            strokeWeight (boxBorderWidth);
            noFill ();
            rect (x, y, boxWidth, boxHeight);
        }
    }

    // highlight selected tiles
    for (let i = 0; i < 9; ++i)
    {
        let y = boardY + i * cellHeight;
        for (let j = 0; j < 9; ++j)
        {
            let x = boardX + j * cellWidth;

            // draw selection if this cell is selected
            if (selectedCells[i][j])
            {
                let isCursorPosition = i == cursorPosition[0] && j == cursorPosition[1];
                // cursor position gets a different color
                if (isCursorPosition)
                    stroke (50, 200, 50, 220);
                // normal selected color - not cursor's position
                else
                    stroke (50, 50, 200, 220);
                strokeWeight (selectBorderWidth);
                noFill ();
                let selectPadding = selectBorderPadding;
                // North line
                if (i == 0 || !selectedCells[i-1][j] || isCursorPosition)
                    line (x+selectPadding, y+selectPadding, x+cellWidth-selectPadding, y+selectPadding);
                // East Line
                if (j == 8 || !selectedCells[i][j+1] || isCursorPosition)
                    line (x+cellWidth-selectPadding, y+selectPadding, x+cellWidth-selectPadding, y+cellHeight-selectPadding);
                // South Line
                if (i == 8 || !selectedCells[i+1][j] || isCursorPosition)
                    line (x+selectPadding, y+cellHeight-selectPadding, x+cellWidth-selectPadding, y+cellHeight-selectPadding);
                // West Line
                if (j == 0 || !selectedCells[i][j-1] || isCursorPosition)
                    line (x+selectPadding, y+selectPadding, x+selectPadding, y+cellHeight-selectPadding);
                // rect (x+selectPadding, y+selectPadding, cellWidth-2*selectPadding, cellHeight-2*selectPadding);

                // opacity over cell
                noStroke ();
                // cursor position gets a different color
                if (isCursorPosition)
                    fill (150, 240, 150, 50);
                // normal selected color - not cursor's position
                else
                    fill (150, 150, 240, 50);
                rect (x, y, cellWidth, cellHeight);
            }
        }
    }

    // check if board is solved
    if (isBoardSolved () && !isSolved)
    {
        alert ("Congrats! You solved it!");
        isSolved = true;
    }

}

//========================================================================

// returns true if the current board state is solved
// returns false if it is not solved or incomplete
function isBoardSolved ()
{
    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            if (board[i][j] == 0 || isCellConflicting (i, j))
                return false;
    
    // Reaches here if all numbers are filled in and there were
    // no conflicts found
    return true;
}

//========================================================================

// return true if there is a conflict with this cell
// by having the same digit in either the same row, col, or box.
// returns false if there is no conflict
function isCellConflicting (i, j)
{
    // check row
    for (let jj = 0; jj < 9; ++jj)
    {
        if (jj != j && board[i][jj] == board[i][j] && board[i][jj] != 0)
            return true;
    }
    // check col
    for (let ii = 0; ii < 9; ++ii)
    {
        if (ii != i && board[ii][j] == board[i][j] && board[ii][j] != 0)
            return true;
    }
    // check box
    let boxI = Math.floor (i / 3);
    let boxJ = Math.floor (j / 3);
    for (let bi = boxI * 3; bi < (boxI+1)*3; ++bi)
    {
        for (let bj = boxJ * 3; bj < (boxJ+1)*3; ++bj)
        {
            // ensure we are not looking at the same position
            if (!(bi == i && bj == j) && board[bi][bj] == board[i][j] && board[bi][bj] != 0)
                return true;
        }
    }

    // reaches here if we did not find a conflict
    return false;
}

//========================================================================

function clearSelectedCells ()
{
    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            selectedCells[i][j] = 0;
}

//========================================================================

function keyPressed ()
{
    if (keyCode == SHIFT)
    {
        isShifting = true;
    }
    // select all
    if (key == "a")
    {
        // check if all are selected already
        let isAlreadyAllSelected = true;
        for (let i = 0; i < 9; ++i)
        {
            for (let j = 0; j < 9; ++j)
            {
                if (selectedCells[i][j] == 0)
                {
                    isAlreadyAllSelected = false;
                    break;
                }
            }
        }

        if (!isAlreadyAllSelected)
        {
            for (let i = 0; i < 9; ++i)
                for (let j = 0; j < 9; ++j)
                    selectedCells[i][j] = 1;
        }
        else
        {
            clearSelectedCells ();
        }
    }

    // switch mode
    if (key == " ")
    {
        console.log (editMode);
        editMode = (editMode + 1) % NUM_MODES;
        console.log (editMode);
        if (editMode == MODE_DIGIT)
            digitTab ();
        else if (editMode == MODE_PENCIL)
            smallDigitTab ();
        else // if editMode == MODE_COLOR
            colorTab ();
    }

    // delete from selected
    if (keyCode == DELETE || keyCode == BACKSPACE)
    {
        inputDigit (0);
    }

    // cursor movement
    if (keyCode == UP_ARROW)
    {
        // 1. No Shift key
        //  each press should clear the selected cells
        if (!isShifting) clearSelectedCells ();

        // 2. Shift key down
        //  do not clear selected cells (do nothing)

        cursorPosition[0] = cursorPosition[0] != 0 ? cursorPosition[0] - 1 : 8;
        
        // mark new cursor position as selected
        selectedCells[cursorPosition[0]][cursorPosition[1]] = 1;
    }
    else if (keyCode == RIGHT_ARROW)
    {
        // 1. No Shift key
        //  each press should clear the selected cells
        if (!isShifting) clearSelectedCells ();

        // 2. Shift key down
        //  do not clear selected cells (do nothing)

        cursorPosition[1] = cursorPosition[1] < 8 ? cursorPosition[1] + 1 : 0;
        
        // mark new cursor position as selected
        selectedCells[cursorPosition[0]][cursorPosition[1]] = 1;
    }
    else if (keyCode == DOWN_ARROW)
    {
        // 1. No Shift key
        //  each press should clear the selected cells
        if (!isShifting) clearSelectedCells ();

        // 2. Shift key down
        //  do not clear selected cells (do nothing)

        cursorPosition[0] = cursorPosition[0] < 8 ? cursorPosition[0] + 1 : 0;
        
        // mark new cursor position as selected
        selectedCells[cursorPosition[0]][cursorPosition[1]] = 1;
    }
    else if (keyCode == LEFT_ARROW)
    {
        // 1. No Shift key
        //  each press should clear the selected cells
        if (!isShifting) clearSelectedCells ();

        // 2. Shift key down
        //  do not clear selected cells (do nothing)

        cursorPosition[1] = cursorPosition[1] != 0 ? cursorPosition[1] - 1 : 8;
        
        // mark new cursor position as selected
        selectedCells[cursorPosition[0]][cursorPosition[1]] = 1;
    }

    // number is pressed
    if ("0123456789".includes(key))
    {
        inputDigit (parseInt(key));
    }
}

//========================================================================

// Applies a given digit to each of the currently selected cells
// and in the current mode. If all selected cells already contain this
// digit, then the digit is instead removed from all of the selected cells
function inputDigit (digit)
{

    // 1. given digit is 0 - should clear all info from selected
    //   for the given mode
    if (digit == 0)
    {    
        for (let i = 0; i < 9; ++i)
        {
            for (let j = 0; j < 9; ++j)
            {
                // delete if cell is selected
                if (selectedCells[i][j])
                {
                    if (editMode == MODE_DIGIT)
                    {
                        board[i][j] = 0;
                    }
                    else if (editMode == MODE_PENCIL && board[i][j] == 0)
                    {
                        for (let k = 0; k < 9; ++k)
                        {
                            pencilMarks[i][j][k] = 0;
                        }
                    }
                    else if (editMode == MODE_COLOR)
                    {
                        for (let k = 0; k < 9; ++k)
                        {
                            cellColors[i][j][k] = 0;
                        }
                    }
                }
            }
        }
    }

    let wasChanged = false;
    for (let i = 0; i < 9; ++i)
    {
        for (let j = 0; j < 9; ++j)
        {
            // delete if cell is selected
            if (selectedCells[i][j])
            {
                if (editMode == MODE_DIGIT && board[i][j] != digit)
                {
                    board[i][j] = digit;
                    wasChanged = true;
                }
                else if (editMode == MODE_PENCIL && board[i][j] == 0 && pencilMarks[i][j][digit-1] == 0)
                {
                    pencilMarks[i][j][digit-1] = 1;
                    wasChanged = true;
                }
                else if (editMode == MODE_COLOR && cellColors[i][j][digit-1] == 0)
                {
                    cellColors[i][j][digit-1] = 1;
                    wasChanged = true;
                }
            }
        }
    }
    
    // delete key if it was already set
    if (!wasChanged)
    {
        for (let i = 0; i < 9; ++i)
        {
            for (let j = 0; j < 9; ++j)
            {
                // delete if cell is selected
                if (selectedCells[i][j])
                {
                    if (editMode == MODE_DIGIT)
                    {
                        board[i][j] = 0;
                    }
                    else if (editMode == MODE_PENCIL && board[i][j] == 0)
                    {
                        pencilMarks[i][j][digit-1] = 0;
                    }
                    else if (editMode == MODE_COLOR)
                    {
                        cellColors[i][j][digit-1] = 0;
                        wasChanged = true;
                    }
                }
            }
        }
    }
}

//========================================================================

function keyReleased ()
{
    if (keyCode == SHIFT)
    {
        isShifting = false;
    }
}

//========================================================================

function mousePressed ()
{
    // ensure it was a left click
    if (mouseButton != LEFT) return;

    isDragging = true;

    let cellPos = mousePositionToCell ();

    // Ensure mouse clicked on board
    if (cellPos == null)
        return;

    // Save cursor position
    cursorPosition = cellPos;

    // clear previous selection if shift isn't being pressed
    if (!isShifting && cellPos != null)
    {
        selectedCells = [
        //   0  1  2   3  4  5   6  7  8
            [0, 0, 0,  0, 0, 0,  0, 0, 0], // 0
            [0, 0, 0,  0, 0, 0,  0, 0, 0], // 1
            [0, 0, 0,  0, 0, 0,  0, 0, 0], // 2
        
            [0, 0, 0,  0, 0, 0,  0, 0, 0], // 3
            [0, 0, 0,  0, 0, 0,  0, 0, 0], // 4
            [0, 0, 0,  0, 0, 0,  0, 0, 0], // 5
        
            [0, 0, 0,  0, 0, 0,  0, 0, 0], // 6
            [0, 0, 0,  0, 0, 0,  0, 0, 0], // 7
            [0, 0, 0,  0, 0, 0,  0, 0, 0]  // 8
        ];
    }

    // 1. if user clicked on a selected cell, then we are deselecting
    if (cellPos != null && selectedCells[cellPos[0]][cellPos[1]])
    {
        // deselect
        selectedCells[cellPos[0]][cellPos[1]] = 0;
        isSelecting = false;
    }

    // 2. if user clicked on an unselected cell, then we are selecting
    else if (cellPos != null && !selectedCells[cellPos[0]][cellPos[1]])
    {
        // select
        selectedCells[cellPos[0]][cellPos[1]] = 1;
        isSelecting = true;
    }

    // 3. if user didnt click on a cell, then we are selecting by default
    else 
    {
        isSelecting = true;
    }

}

//========================================================================

function mouseReleased ()
{
    isDragging = false;
}

//========================================================================

function mouseDragged ()
{
    if (isDragging)
    {
        let cellPos = mousePositionToCell ();

        // Ensure user is over the board
        if (cellPos == null) return;

        // Save cursor position
        cursorPosition = cellPos;

        // 1. if user is selecting and is mouseOver an unselected cell,
        // then selected the cell
        if (cellPos != null && isSelecting && !selectedCells[cellPos[0]][cellPos[1]])
        {
            // select the cell
            selectedCells[cellPos[0]][cellPos[1]] = 1;
        }

        // 2. if user is not selecting and is mouseOver a selected cell,
        // then unselected the cell
        if (cellPos != null && !isSelecting && selectedCells[cellPos[0]][cellPos[1]])
        {
            // select the cell
            selectedCells[cellPos[0]][cellPos[1]] = 0;
        }

        // 3. otherwise, do nothing
        else
        {

        }

    }
}

//========================================================================

function mousePositionToCell ()
{
    for (let i = 0; i < 9; ++i)
    {
        let y = boardY + i * cellHeight;
        for (let j = 0; j < 9; ++j)
        {
            let x = boardX + j * cellWidth;

            // check if mouse is in this cell's bounds
            if (x < mouseX && mouseX < (x + cellWidth) &&
                y < mouseY && mouseY < (y + cellHeight))
            {
                return [i, j];
            }
        }
    }
    
    // Mouse is not over any cell
    return null;
}

//========================================================================

function digitTab ()
{
    select ("#digitPanel")     .style ("display", "flex");
    select ("#smallDigitPanel").style ("display", "none");
    select ("#colorPanel")     .style ("display", "none");

    select ("#digitTab")     .addClass ("selectedTab");
    select ("#smallDigitTab").removeClass ("selectedTab");
    select ("#colorTab")     .removeClass ("selectedTab");

    editMode = MODE_DIGIT;
}

//========================================================================

function smallDigitTab ()
{
    select ("#digitPanel")     .style ("display", "none");
    select ("#smallDigitPanel").style ("display", "flex");
    select ("#colorPanel")     .style ("display", "none");

    select ("#digitTab")     .removeClass ("selectedTab");
    select ("#smallDigitTab").addClass ("selectedTab");
    select ("#colorTab")     .removeClass ("selectedTab");

    editMode = MODE_PENCIL;
}

//========================================================================

function colorTab ()
{
    select ("#digitPanel")     .style ("display", "none");
    select ("#smallDigitPanel").style ("display", "none");
    select ("#colorPanel")     .style ("display", "flex");

    select ("#digitTab")     .removeClass ("selectedTab");
    select ("#smallDigitTab").removeClass ("selectedTab");
    select ("#colorTab")     .addClass ("selectedTab");

    editMode = MODE_COLOR;
}