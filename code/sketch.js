// Sudoku Solver
// By Amy Burnett
//========================================================================
// Globals

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

let givenDigits = [
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

// a set of cages
// a cage is a set of cells that must add up to the cage's sum and must not repeat
let cages = [
    [10, [[1,1], [2,1]]],
    [1+9+7+2, [[6,7], [5,6], [5,7], [5,8]]]
];
let cageBorderColor;
let cageSumColor;

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

// Color Theme
let isDarkMode = false;
let boardBackgroundColor;
let digitColor;
let borderColor;
// let selectionColor = [50, 50, 200, 220];
let selectionBorderColor = [50, 255, 255, 220];
let cursorBorderColor =    [250, 255, 50, 220];

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

let topDigits = [];

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

const MODE_DIGIT       = 0;
const MODE_TOP         = 1;
const MODE_PENCIL      = 2;
const MODE_COLOR       = 3;
const MODE_BOARD_MAKER = 4;
const MODE_BOARD       = 5;
const MODE_SOLVER      = 6;
const NUM_MODES        = 7;
let editMode = MODE_DIGIT;

let isSolved = false;

// [
//      timestep0: [board, pencilmarks, colors]
// ]
let history = [];

//========================================================================

const DARKMODE_BACKGROUND0 = "#000";
const DARKMODE_BACKGROUND1 = "#111";
const DARKMODE_BACKGROUND2 = "#222";

const DARKMODE_FOREGROUND0 = "#eee";
const DARKMODE_FOREGROUND1 = "#ddd";

function setDarkMode ()
{
    boardBackgroundColor = DARKMODE_BACKGROUND0;
    digitColor = DARKMODE_FOREGROUND0;
    borderColor = DARKMODE_FOREGROUND0;
    cageBorderColor = DARKMODE_FOREGROUND0;
    cageSumColor = DARKMODE_FOREGROUND0;
    select ("body").style ("background-color", DARKMODE_BACKGROUND0);
    select ("body").style ("color", DARKMODE_FOREGROUND0);
    select ("button").style ("color", DARKMODE_FOREGROUND0);

    select ("#rightPanel").style ("background-color", DARKMODE_BACKGROUND0);
    select ("#panelTabs").style ("background-color", DARKMODE_BACKGROUND0);
    for (let tab of selectAll (".panelTab"))
    {
        tab.style ("background-color", DARKMODE_BACKGROUND0);
        tab.style ("color", DARKMODE_FOREGROUND0);
        tab.style ("border", `2px solid ${DARKMODE_FOREGROUND0}`);
    }
    for (let tab of selectAll (".selectedTab"))
    {
        tab.style ("background-color", DARKMODE_BACKGROUND2);
        tab.style ("border-bottom", `2px solid ${DARKMODE_BACKGROUND2}`);
    }
    for (let tab of selectAll (".buttonPanel"))
    {
        tab.style ("background-color", DARKMODE_BACKGROUND2);
    }
    for (let element of selectAll (".color-foreground0"))
    {
        element.style ("color", DARKMODE_FOREGROUND0);
    }

    // subtabs
    for (let tab of selectAll (".boardMakerPanelLeftTab"))
    {
        tab.style ("background-color", DARKMODE_BACKGROUND0);
        tab.style ("color", DARKMODE_FOREGROUND0);
        tab.style ("border", `2px solid ${DARKMODE_FOREGROUND0}`);
    }
    for (let tab of selectAll (".boardMakerPanelSelectedTab"))
    {
        tab.style ("background-color", DARKMODE_BACKGROUND2);
    }

    selectionBorderColor = [50, 255, 255, 220];
    cursorBorderColor =    [250, 255, 50, 220];
    
    // change button
    select ("#darkModeBtn").html ("Light Mode");
    select ("#darkModeBtn").style ("background-color", DARKMODE_FOREGROUND0);
    select ("#darkModeBtn").style ("color", DARKMODE_BACKGROUND0);
}

//========================================================================

const LIGHTMODE_BACKGROUND0 = "#fff";
const LIGHTMODE_BACKGROUND1 = "#eee";
const LIGHTMODE_BACKGROUND2 = "#ddd";

const LIGHTMODE_FOREGROUND0 = "#111";
const LIGHTMODE_FOREGROUND1 = "#222";

function setLightMode ()
{
    boardBackgroundColor = LIGHTMODE_BACKGROUND0;
    digitColor = LIGHTMODE_FOREGROUND0;
    borderColor = LIGHTMODE_FOREGROUND0;
    cageBorderColor = LIGHTMODE_FOREGROUND0;
    cageSumColor = LIGHTMODE_FOREGROUND0;
    select ("body").style ("background-color", LIGHTMODE_BACKGROUND0);
    select ("body").style ("color", LIGHTMODE_FOREGROUND0);
    select ("button").style ("color", LIGHTMODE_FOREGROUND0);

    select ("#rightPanel").style ("background-color", LIGHTMODE_BACKGROUND0);
    select ("#panelTabs").style ("background-color", LIGHTMODE_BACKGROUND0);
    for (let tab of selectAll (".panelTab"))
    {
        tab.style ("background-color", LIGHTMODE_BACKGROUND0);
        tab.style ("color", LIGHTMODE_FOREGROUND0);
        tab.style ("border", `2px solid ${LIGHTMODE_FOREGROUND0}`);
    }
    for (let tab of selectAll (".selectedTab"))
    {
        tab.style ("background-color", LIGHTMODE_BACKGROUND2);
        tab.style ("border-bottom", `2px solid ${LIGHTMODE_BACKGROUND2}`);
    }
    for (let tab of selectAll (".buttonPanel"))
    {
        tab.style ("background-color", LIGHTMODE_BACKGROUND2);
    }
    for (let element of selectAll (".color-foreground0"))
    {
        element.style ("color", LIGHTMODE_FOREGROUND0);
    }

    // subtabs
    for (let tab of selectAll (".boardMakerPanelLeftTab"))
    {
        tab.style ("background-color", LIGHTMODE_BACKGROUND0);
        tab.style ("color", LIGHTMODE_FOREGROUND0);
        tab.style ("border", `2px solid ${LIGHTMODE_FOREGROUND0}`);
    }
    for (let tab of selectAll (".boardMakerPanelSelectedTab"))
    {
        tab.style ("background-color", LIGHTMODE_BACKGROUND2);
    }

    selectionBorderColor = [50, 50, 200, 220];
    cursorBorderColor =    [50, 255, 50, 220];

    // change button
    select ("#darkModeBtn").html ("Dark Mode");
    select ("#darkModeBtn").style ("background-color", LIGHTMODE_FOREGROUND0);
    select ("#darkModeBtn").style ("color", LIGHTMODE_BACKGROUND0);
}

//========================================================================

function toggleLightAndDark ()
{
    isDarkMode = ! isDarkMode;
    if (isDarkMode) setDarkMode (); else setLightMode ();
}

//========================================================================

function setup ()
{
    // darkmode setup
    if (isDarkMode)
    {
        setDarkMode ();
    }
    // lightmode setup
    else
    {
        setLightMode ();
    }

    let canvas = createCanvas (600, 600);
    canvas.parent ("#canvasDiv");
    background (boardBackgroundColor);

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
        topDigits  .push ([]);
        pencilMarks.push ([]);
        cellColors .push ([]);
        for (let j = 0; j < 9; ++j)
        {
            // push "must" digits (top digits)
            // digit              1 2 3 4 5 6 7 8 9
            // index              0 1 2 3 4 5 6 7 8
            topDigits[i]  .push ([0,0,0,0,0,0,0,0,0]);
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
            cellColors[i] .push ([0,0,0,0,0,0,0,0,0]);
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
    background (boardBackgroundColor);

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
            stroke (borderColor);
            strokeWeight (cellBorderWidth);
            noFill ();
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
            if (isCellConflicting (board, i, j))
            {
                // Digit is invalid, highlight it 
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
                noStroke ();
                fill (digitColor);
                textFont ("Courier");
                textAlign (CENTER, CENTER);
                textSize (cellHeight);
                text (board[i][j], cellCenterX, cellCenterY + 5);
            }
            // if digit is not filled in, draw any penciled-in digits
            else
            {
                // top digits
                let topDigitsStr = "";
                for (let p = 0; p < 9; ++p)
                {
                    if (topDigits[i][j][p])
                        topDigitsStr = topDigitsStr + (p+1);
                }

                // Ensure we have pencil marks
                if (topDigitsStr.length > 0)
                {
                    noStroke ();
                    fill (digitColor);
                    textFont ("Courier");
                    textAlign (CENTER, CENTER);
                    // iteratively decrease size until it fits
                    let strHeight = (cellHeight - 10) / 2;
                    textSize (--strHeight);
                    while (textWidth (topDigitsStr) >= cellWidth - 10)
                        textSize (--strHeight);
                    text (topDigitsStr, cellCenterX, y + ((cellHeight - 10) / 4));
                }


                // center pencil marks (small digits)
                let pencilMarksStr = "";
                for (let p = 0; p < 9; ++p)
                {
                    if (pencilMarks[i][j][p])
                        pencilMarksStr = pencilMarksStr + (p+1);
                }

                // Ensure we have pencil marks
                if (pencilMarksStr.length > 0)
                {
                    stroke (digitColor);
                    strokeWeight (1);
                    fill (digitColor);
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
            stroke (borderColor);
            strokeWeight (boxBorderWidth);
            noFill ();
            rect (x, y, boxWidth, boxHeight);
        }
    }

    drawCages ();

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
                    stroke (cursorBorderColor);
                // normal selected color - not cursor's position
                else
                    stroke (selectionBorderColor);
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
    // if (isBoardSolved () && !isSolved)
    // {
    //     alert ("Congrats! You solved it!");
    //     isSolved = true;
    // }

}

//========================================================================

// draws cages onto the board if there are any
function drawCages ()
{
    for (let c = 0; c < cages.length; ++c)
    {
        let cageSum = cages[c][0];
        let cageCells = cages[c][1];
        // find top left cell
        // aka the most left cell in the top row
        let topi = cageCells[0][0];
        for (let i = 0; i < cageCells.length; ++i)
        {
            if (cageCells[i][0] < topi)
            {
                topi = cageCells[i][0];
            }
        }
        let leftj = cageCells[0][1];
        for (let i = 0; i < cageCells.length; ++i)
        {
            if (cageCells[i][0] == topi)
            {
                if (cageCells[i][1] < leftj)
                {
                    leftj = cageCells[i][1];
                }
            }
        }

        // write cage num
        // for now just write over first cell
        stroke (cageSumColor);
        strokeWeight (1);
        fill (cageSumColor);
        let cageTextSize = 14;
        textSize (cageTextSize);
        text (cageSum, boardX + leftj * cellWidth + (cellWidth / 3), boardY + topi * cellHeight + (cageTextSize / 2))
        // console.warn (cage[0]);

        // draw cage outline
        for (let i = 0 ; i < cageCells.length; ++i)
        {
            let celli = cageCells[i][0];
            let cellj = cageCells[i][1];
            let isTopLeftCell = false;
            if (celli == topi && cellj == leftj) isTopLeftCell = true;

            let y = boardY + celli * cellHeight;
            let x = boardX + cellj * cellWidth;
            stroke (cageBorderColor);
            strokeWeight (1);
            drawingContext.setLineDash([5, 12]);
            let cageBorderPadding = 5;

            // ensure cage doesnt continue to the north
            let hasNorthCell = false;
            let hasEastCell  = false;
            let hasSouthCell = false;
            let hasWestCell  = false;
            for (let j = 0; j < cageCells.length; ++j)
            {
                if (i == j) continue;
                let cellii = cageCells[j][0];
                let celljj = cageCells[j][1];
                if (cellii == celli-1 && celljj == cellj) hasNorthCell = true;
                if (celljj == cellj+1 && cellii == celli) hasEastCell  = true;
                if (cellii == celli+1 && celljj == cellj) hasSouthCell = true;
                if (celljj == cellj-1 && cellii == celli) hasWestCell  = true;
            }
            if (!hasNorthCell)
                if (isTopLeftCell)
                    line (x+(cellWidth / 2)+cageBorderPadding, y+cageBorderPadding, x+cellWidth-cageBorderPadding, y+cageBorderPadding);
                else
                    line (x+cageBorderPadding, y+cageBorderPadding, x+cellWidth-cageBorderPadding, y+cageBorderPadding);
            if (!hasEastCell)
                line (x+cellWidth-cageBorderPadding, y+cageBorderPadding, x+cellWidth-cageBorderPadding, y+cellHeight-cageBorderPadding);
            if (!hasSouthCell)
                line (x+cageBorderPadding, y+cellHeight-cageBorderPadding, x+cellWidth-cageBorderPadding, y+cellHeight-cageBorderPadding);
            if (!hasWestCell)
                line (x+cageBorderPadding, y+cageBorderPadding, x+cageBorderPadding, y+cellHeight-cageBorderPadding);
            drawingContext.setLineDash([]);
        }
    }
}

//========================================================================

// turns the selected cells into a cage and prompts for the desired sum
// if selected cells are already a cage, then it removes the cage
// if selected cells are not orthogonally connected, then a cage cannot be made
function cageSelectedCells ()
{
    // ensure selected cells are orthogonally connected
    let dfsBoard = [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
    ];
    let firsti = -1;
    let firstj = -1;
    for (let i = 0; i < 9; ++i)
    {
        for (let j = 0; j < 9; ++j)
        {
            if (firsti == -1 && selectedCells[i][j])
            {
                firsti = i; firstj = j;
            }
            dfsBoard[i][j] = selectedCells[i][j];
        }
    }
    // ensure there was at least one selected cell
    if (firsti == -1)
    {
        console.error ("Error: Nothing selected. Cage creation failed");
        return;
    }
    // floodfill on first selectedCell
    let frontier = [[firsti,firstj]];
    while (frontier.length > 0)
    {
        [i, j] = frontier.pop ();
        // visit cell
        dfsBoard[i][j] = 0;
        // visit neighbors if they were selected
        if (dfsBoard[i-1][j  ] == 1) frontier.push ([i-1,j  ]);
        if (dfsBoard[i  ][j+1] == 1) frontier.push ([i  ,j+1]);
        if (dfsBoard[i+1][j  ] == 1) frontier.push ([i+1,j  ]);
        if (dfsBoard[i  ][j-1] == 1) frontier.push ([i  ,j-1]);
    }
    // first assume that all selected cells were in floodfill reach
    let areCellsOrthogonal = true;
    // now look for a contradictory case
    for (let i = 0; i < 9; ++i)
    {
        for (let j = 0; j < 9; ++j)
        {
            if (dfsBoard[i][j] == 1)
                // found a cell that wasnt orthogonal
                areCellsOrthogonal = false;
        }
    }
    if (!areCellsOrthogonal) 
    {
        console.error ("Error: Selected Cells are not orthogonal. Cage creation failed");
        return;
    }

    // ensure cells are not already a cage
    for (let i = 0; i < 9; ++i)
    {
        for (let j = 0; j < 9; ++j)
        {
            if (selectedCells[i][j])
            {
                for (let cg = 0; cg < cages.length; ++cg)
                {
                    let cage = cages[cg];
                    for (let c = 0; c < cage[1].length; ++c)
                    {
                        let [celli, cellj] = cage[1][c];
                        if (i == celli && j == cellj)
                        {
                            console.error ("Error: Overlapping cages. Cage creation failed");
                            return;
                        }
                    }
                }
            }
        }
    }

    // prompt user for the cage's sum
    let sum = parseInt (prompt ("Enter the desired cage sum"));

    // ensure valid sum provided
    if (isNaN (sum))
        return;

    // create cage
    alert (`Making cage with sum ${sum}`);
    let cells = [];
    for (let i = 0; i < 9; ++i)
    {
        for (let j = 0; j < 9; ++j)
        {
            if (selectedCells[i][j])
                cells.push ([i,j]);
        }
    }
    let cage = [sum, cells];
    cages.push (cage);
    
}

//========================================================================

// removes any cages that have intersecting cells with the current selected cells
function uncageSelectedCells ()
{
    for (let i = 0; i < 9; ++i)
    {
        for (let j = 0; j < 9; ++j)
        {
            if (selectedCells[i][j])
            {
                for (let cg = cages.length-1; cg >= 0; --cg)
                {
                    let cage = cages[cg];
                    for (let c = 0; c < cage[1].length; ++c)
                    {
                        let [celli, cellj] = cage[1][c];
                        if (i == celli && j == cellj)
                        {
                            // remove the whole cage at this cell
                            cages.splice (cg, 1);
                        }
                    }
                }
            }
        }
    }
}

//========================================================================

// returns true if the current board state is solved
// returns false if it is not solved or incomplete
function isBoardSolved ()
{
    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            if (board[i][j] == 0 || isCellConflicting (board, i, j))
                return false;
    
    // Reaches here if all numbers are filled in and there were
    // no conflicts found
    return true;
}

//========================================================================

// return true if there is a conflict with this cell
// by having the same digit in either the same row, col, or box.
// returns false if there is no conflict
function isCellConflicting (board, i, j)
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

function isDigitValid (board, i, j, digit)
{
    // check row
    for (let jj = 0; jj < 9; ++jj)
    {
        if (jj != j && board[i][jj] == digit && board[i][jj] != 0)
            return false;
    }
    // check col
    for (let ii = 0; ii < 9; ++ii)
    {
        if (ii != i && board[ii][j] == digit && board[ii][j] != 0)
            return false;
    }
    // check box
    let boxI = Math.floor (i / 3);
    let boxJ = Math.floor (j / 3);
    for (let bi = boxI * 3; bi < (boxI+1)*3; ++bi)
    {
        for (let bj = boxJ * 3; bj < (boxJ+1)*3; ++bj)
        {
            // ensure we are not looking at the same position
            if (!(bi == i && bj == j) && board[bi][bj] == digit && board[bi][bj] != 0)
                return false;
        }
    }

    // reaches here if we did not find a conflict
    return true;
}

//========================================================================

function clearSelectedCells ()
{
    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            selectedCells[i][j] = 0;
}

function clearBoard ()
{
    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            board[i][j] = 0;
}

function clearTopDigits ()
{
    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            for (let k = 0; k < 9; ++k)
                topDigits[i][j][k] = 0;
}

function clearPencilMarks ()
{
    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            for (let k = 0; k < 9; ++k)
                pencilMarks[i][j][k] = 0;
}

function clearColors ()
{
    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            for (let k = 0; k < 9; ++k)
                cellColors[i][j][k] = 0;
}

//========================================================================

function getPenciledDigits (i, j)
{
    let penciledDigits = [];
    for (let p = 0; p < 9; ++p)
        if (pencilMarks[i][j][p] == 1)
            penciledDigits.push (p+1);
    return penciledDigits;
}

//========================================================================

function getTopDigits (i, j)
{
    let topDigits_ = [];
    for (let p = 0; p < 9; ++p)
        if (topDigits[i][j][p] == 1)
            topDigits_.push (p+1);
    return topDigits_;
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
        cycleMode ();
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
                    else if (editMode == MODE_TOP && board[i][j] == 0)
                    {
                        for (let k = 0; k < 9; ++k)
                        {
                            topDigits[i][j][k] = 0;
                        }
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
                else if (editMode == MODE_TOP && board[i][j] == 0 && topDigits[i][j][digit-1] == 0)
                {
                    topDigits[i][j][digit-1] = 1;
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
                    else if (editMode == MODE_TOP && board[i][j] == 0)
                    {
                        topDigits[i][j][digit-1] = 0;
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

function loadEasyBoard (boardIndex)
{
    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            board[i][j] = easyBoards[boardIndex][i][j];
    
    clearSelectedCells ();
    clearTopDigits ();
    clearPencilMarks ();
    clearColors ();
    
}

//========================================================================

function loadMediumBoard (boardIndex)
{
    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            board[i][j] = mediumBoards[boardIndex][i][j];
    
    clearSelectedCells ();
    clearTopDigits ();
    clearPencilMarks ();
    clearColors ();
    
}

//========================================================================

function loadHardBoard (boardIndex)
{
    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            board[i][j] = hardBoards[boardIndex][i][j];
    
    clearSelectedCells ();
    clearTopDigits ();
    clearPencilMarks ();
    clearColors ();
    
}

//========================================================================

function loadExpertBoard (boardIndex)
{
    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            board[i][j] = expertBoards[boardIndex][i][j];
    
    clearSelectedCells ();
    clearTopDigits ();
    clearPencilMarks ();
    clearColors ();
    
}

//========================================================================

function loadEvilBoard (boardIndex)
{
    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            board[i][j] = evilBoards[boardIndex][i][j];
    
    clearSelectedCells ();
    clearTopDigits ();
    clearPencilMarks ();
    clearColors ();
    
}

//========================================================================

function cycleMode ()
{
    editMode = (editMode + 1) % NUM_MODES;
    if (editMode == MODE_DIGIT)
        digitTab ();
    else if (editMode == MODE_TOP)
        topDigitTab ();
    else if (editMode == MODE_PENCIL)
        smallDigitTab ();
    else if (editMode == MODE_COLOR)
        colorTab ();
    else if (editMode == MODE_BOARD_MAKER)
        boardMakerTab ();
    else if (editMode == MODE_BOARD)
        boardTab ();
    else if (editMode == MODE_SOLVER)
        solverTab ();
}

//========================================================================

function hideTabs ()
{
    select ("#digitPanel")     .style ("display", "none");
    select ("#topDigitPanel")  .style ("display", "none");
    select ("#smallDigitPanel").style ("display", "none");
    select ("#colorPanel")     .style ("display", "none");
    select ("#boardMakerPanel").style ("display", "none");
    select ("#boardPanel")     .style ("display", "none");
    select ("#solverPanel")    .style ("display", "none");

    select ("#digitTab")     .removeClass ("selectedTab");
    select ("#topDigitTab")  .removeClass ("selectedTab");
    select ("#smallDigitTab").removeClass ("selectedTab");
    select ("#colorTab")     .removeClass ("selectedTab");
    select ("#boardMakerTab").removeClass ("selectedTab");
    select ("#boardTab")     .removeClass ("selectedTab");
    select ("#solverTab")    .removeClass ("selectedTab");
}

//========================================================================

function digitTab ()
{
    hideTabs ();

    select ("#digitPanel")     .style ("display", "flex");

    select ("#digitTab")     .addClass ("selectedTab");

    if (isDarkMode) setDarkMode (); else setLightMode ();

    editMode = MODE_DIGIT;
}

//========================================================================

function topDigitTab ()
{
    hideTabs ();
    
    select ("#topDigitPanel").style ("display", "flex");

    select ("#topDigitTab").addClass ("selectedTab");
    
    if (isDarkMode) setDarkMode (); else setLightMode ();

    editMode = MODE_TOP;
}

//========================================================================

function smallDigitTab ()
{
    hideTabs ();
    
    select ("#smallDigitPanel").style ("display", "flex");

    select ("#smallDigitTab").addClass ("selectedTab");
    
    if (isDarkMode) setDarkMode (); else setLightMode ();

    editMode = MODE_PENCIL;
}

//========================================================================

function colorTab ()
{
    hideTabs ();
    
    select ("#colorPanel").style ("display", "flex");

    select ("#colorTab").addClass ("selectedTab");
    
    if (isDarkMode) setDarkMode (); else setLightMode ();

    editMode = MODE_COLOR;
}

//========================================================================

function boardMakerTab ()
{
    hideTabs ();
    
    select ("#boardMakerPanel").style ("display", "flex");

    select ("#boardMakerTab").addClass ("selectedTab");
    
    if (isDarkMode) setDarkMode (); else setLightMode ();

    editMode = MODE_BOARD_MAKER;
}

//========================================================================

function boardTab ()
{
    hideTabs ();
    
    select ("#boardPanel")     .style ("display", "flex");

    select ("#boardTab")     .addClass ("selectedTab");
    
    if (isDarkMode) setDarkMode (); else setLightMode ();

    editMode = MODE_BOARD;
}

//========================================================================

function solverTab ()
{
    hideTabs ();
    
    select ("#solverPanel")    .style ("display", "flex");

    select ("#solverTab")    .addClass ("selectedTab");
    
    if (isDarkMode) setDarkMode (); else setLightMode ();

    editMode = MODE_SOLVER;
}

//========================================================================

// board maker tabs

const BOARD_MAKER_MODE_DIGIT = 0;
const BOARD_MAKER_MODE_CAGES = 1;
const BOARD_MAKER_MODE_DOMINOES = 2;
const BOARD_MAKER_NUM_MODES = 3;
let boardMakerMode = BOARD_MAKER_MODE_DIGIT;

function cycleBoardMakerMode ()
{
    boardMakerMode = (boardMakerMode + 1) % BOARD_MAKER_NUM_MODES;
    if (boardMakerMode == BOARD_MAKER_MODE_DIGIT)
        boardMakerDigitTab ();
    else if (boardMakerMode == BOARD_MAKER_MODE_CAGES)
        topDigitTab ();
    else if (boardMakerMode == BOARD_MAKER_MODE_DOMINOES)
        smallDigitTab ();
    else
        console.warn ("Unknown board maker mode", boardMakerMode);
}

//========================================================================

function hideBoardMakerTabs ()
{
    select ("#boardMakerPanelDigitPanel")   .style ("display", "none");
    select ("#boardMakerPanelCagesPanel")   .style ("display", "none");
    select ("#boardMakerPanelDominoesPanel").style ("display", "none");

    select ("#boardMakerPanelDigitTab")   .removeClass ("boardMakerPanelSelectedTab");
    select ("#boardMakerPanelCagesTab")   .removeClass ("boardMakerPanelSelectedTab");
    select ("#boardMakerPanelDominoesTab").removeClass ("boardMakerPanelSelectedTab");
}

//========================================================================

function boardMakerPanelDigitTab ()
{
    hideBoardMakerTabs ();
    
    select ("#boardMakerPanelDigitPanel")    .style ("display", "flex");

    select ("#boardMakerPanelDigitTab")    .addClass ("boardMakerPanelSelectedTab");
    
    if (isDarkMode) setDarkMode (); else setLightMode ();

    editMode = BOARD_MAKER_MODE_DIGIT;
}

//========================================================================

function boardMakerPanelCagesTab ()
{
    hideBoardMakerTabs ();
    
    select ("#boardMakerPanelCagesPanel")    .style ("display", "flex");

    select ("#boardMakerPanelCagesTab")    .addClass ("boardMakerPanelSelectedTab");
    
    if (isDarkMode) setDarkMode (); else setLightMode ();

    editMode = BOARD_MAKER_MODE_CAGES;
}

//========================================================================

function boardMakerPanelDominoesTab ()
{
    hideBoardMakerTabs ();
    
    select ("#boardMakerPanelDominoesPanel")    .style ("display", "flex");

    select ("#boardMakerPanelDominoesTab")    .addClass ("boardMakerPanelSelectedTab");
    
    if (isDarkMode) setDarkMode (); else setLightMode ();

    editMode = BOARD_MAKER_MODE_DOMINOES;
}