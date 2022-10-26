// Sudoku Solver
// By Amy Burnett
//========================================================================
// Globals

let sudokuBoard;

// let board = [
// //   0  1  2   3  4  5   6  7  8
//     [4, 9, 7,  0, 3, 0,  6, 0, 0], // 0
//     [1, 0, 6,  5, 9, 0,  7, 3, 0], // 1
//     [5, 0, 3,  0, 0, 4,  0, 1, 0], // 2

//     [9, 3, 1,  0, 0, 0,  0, 0, 0], // 3
//     [0, 0, 0,  0, 1, 5,  3, 4, 2], // 4
//     [0, 0, 0,  0, 0, 0,  0, 0, 0], // 5

//     [0, 5, 4,  8, 0, 1,  9, 0, 6], // 6
//     [0, 1, 0,  2, 0, 6,  0, 7, 3], // 7
//     [0, 6, 0,  0, 4, 9,  8, 0, 0]  // 8
// ];

// let givenDigits = [
// //   0  1  2   3  4  5   6  7  8
//     [0, 0, 0,  0, 0, 0,  0, 0, 0], // 0
//     [0, 0, 0,  0, 0, 0,  0, 0, 0], // 1
//     [0, 0, 0,  0, 0, 0,  0, 0, 0], // 2

//     [0, 0, 0,  0, 0, 0,  0, 0, 0], // 3
//     [0, 0, 0,  0, 0, 0,  0, 0, 0], // 4
//     [0, 0, 0,  0, 0, 0,  0, 0, 0], // 5

//     [0, 0, 0,  0, 0, 0,  0, 0, 0], // 6
//     [0, 0, 0,  0, 0, 0,  0, 0, 0], // 7
//     [0, 0, 0,  0, 0, 0,  0, 0, 0]  // 8
// ];

// a set of cages
// a cage is a set of cells that must add up to the cage's sum and must not repeat
// let cages = [
//     [10, [[1,1], [2,1]]],
//     [1+9+7+2, [[6,7], [5,6], [5,7], [5,8]]]
// ];
// let cageBorderColor;
// let cageSumColor;
// let cageTextSize = 12;
// let cageTextFont = "Sans";

// list of cages
// a cage consists of a cage sum and a list of cells that define the caged region
// let cages = [];

// Cell structure
// let boardX;
// let boardY;
// let boardWidth;
// let boardHeight;
// let boxWidth;
// let boxHeight;
// let cellWidth;
// let cellHeight;
// let cellBorderWidth = 1;
// let boxBorderWidth = 3;
// let selectBorderWidth = 6;
// let selectBorderPadding = 3;

let globalTextFont = "Courier";

// Color Theme
let isDarkMode = false;
// let boardBackgroundColor;
// let digitColor;
// let borderColor;
// // let selectionColor = [50, 50, 200, 220];
// let selectionBorderColor = [50, 255, 255, 220];
// let cursorBorderColor =    [250, 255, 50, 220];

// let selectedCells = [
// //   0  1  2   3  4  5   6  7  8
//     [0, 0, 0,  0, 0, 0,  0, 0, 0], // 0
//     [0, 0, 0,  0, 0, 0,  0, 0, 0], // 1
//     [0, 0, 0,  0, 0, 0,  0, 0, 0], // 2

//     [0, 0, 0,  0, 0, 0,  0, 0, 0], // 3
//     [0, 0, 0,  0, 0, 0,  0, 0, 0], // 4
//     [0, 0, 0,  0, 0, 0,  0, 0, 0], // 5

//     [0, 0, 0,  0, 0, 0,  0, 0, 0], // 6
//     [0, 0, 0,  0, 0, 0,  0, 0, 0], // 7
//     [0, 0, 0,  0, 0, 0,  0, 0, 0]  // 8
// ];
let isDragging = false;
let isSelecting = false;
let isShifting = false;
let cursorPosition = [0, 0];

// let topDigits = [];

// let pencilMarks = [];

// let cellColors = [];
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

const MODE_PLAY        = 0;
const MODE_DIGIT       = 1;
const MODE_TOP         = 2;
const MODE_PENCIL      = 3;
const MODE_COLOR       = 4;
const MODE_BOARD_MAKER = 5;
const MODE_BOARD       = 6;
const MODE_SOLVER      = 7;
const NUM_MODES        = 8;
let editMode = MODE_PLAY;

const PLAY_MODE_BASE   = 20;
const PLAY_MODE_DIGIT  = PLAY_MODE_BASE + 0;
const PLAY_MODE_TOP    = PLAY_MODE_BASE + 1;
const PLAY_MODE_SMALL  = PLAY_MODE_BASE + 2;
const PLAY_MODE_COLOR  = PLAY_MODE_BASE + 3;
const PLAY_MODE_END    = PLAY_MODE_BASE + 4;
let playMode = PLAY_MODE_BASE;

const BOARD_MAKER_MODE_BASE     = 50;
const BOARD_MAKER_MODE_BOARD    = BOARD_MAKER_MODE_BASE + 0;
const BOARD_MAKER_MODE_DIGIT    = BOARD_MAKER_MODE_BASE + 1;
const BOARD_MAKER_MODE_CAGES    = BOARD_MAKER_MODE_BASE + 2;
const BOARD_MAKER_MODE_DOMINOES = BOARD_MAKER_MODE_BASE + 3;
const BOARD_MAKER_MODE_END      = BOARD_MAKER_MODE_BASE + 4;
let boardMakerMode = BOARD_MAKER_MODE_BASE;

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
    sudokuBoard.setDarkMode ();

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
    select ("#boardMakerPanelTabContainer").style ("border-right", `solid 2px ${DARKMODE_FOREGROUND0}`);

    // play panel
    for (let tab of selectAll (".playPanelLeftTab"))
    {
        tab.style ("background-color", DARKMODE_BACKGROUND0);
        tab.style ("color", DARKMODE_FOREGROUND0);
        tab.style ("border", `2px solid ${DARKMODE_FOREGROUND0}`);
    }
    for (let tab of selectAll (".playPanelSelectedTab"))
    {
        tab.style ("background-color", DARKMODE_BACKGROUND2);
    }
    select ("#playPanelTabContainer").style ("border-right", `solid 2px ${DARKMODE_FOREGROUND0}`);
    
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
    sudokuBoard.setLightMode ();

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
    select ("#boardMakerPanelTabContainer").style ("border-right", `solid 2px ${LIGHTMODE_FOREGROUND0}`);

    // play panel
    for (let tab of selectAll (".playPanelLeftTab"))
    {
        tab.style ("background-color", LIGHTMODE_BACKGROUND0);
        tab.style ("color", LIGHTMODE_FOREGROUND0);
        tab.style ("border", `2px solid ${LIGHTMODE_FOREGROUND0}`);
    }
    for (let tab of selectAll (".playPanelSelectedTab"))
    {
        tab.style ("background-color", LIGHTMODE_BACKGROUND2);
    }
    select ("#playPanelTabContainer").style ("border-right", `solid 2px ${LIGHTMODE_FOREGROUND0}`);

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

    let canvas = createCanvas (600, 600);
    canvas.parent ("#canvasDiv");

    sudokuBoard = new SudokuBoard ();

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
    background (sudokuBoard.boardBackgroundColor);

    sudokuBoard.show ();

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
        if (!sudokuBoard.isAllCellsSelected ())
        {
            sudokuBoard.selectAllCells ();
        }
        else
        {
            sudokuBoard.clearSelectedCells ();
        }
    }

    // switch mode - spacebar
    if (key == " ")
    {
        // play tab
        if (editMode == MODE_PLAY)
        {
            cyclePlayMode ();
        }
        // board maker
        else if (editMode == MODE_BOARD_MAKER)
        {
            cycleBoardMakerMode ();
        }
    }

    // delete from selected
    if (keyCode == DELETE || keyCode == BACKSPACE)
    {
        sudokuBoard.inputDigit (0);
    }

    // cursor movement
    if (keyCode == UP_ARROW)
    {
        // 1. No Shift key
        //  each press should clear the selected cells
        if (!isShifting) sudokuBoard.clearSelectedCells ();

        // 2. Shift key down
        //  do not clear selected cells (do nothing)

        cursorPosition[0] = cursorPosition[0] != 0 ? cursorPosition[0] - 1 : 8;
        
        // mark new cursor position as selected
        sudokuBoard.selectedCells[cursorPosition[0]][cursorPosition[1]] = 1;
    }
    else if (keyCode == RIGHT_ARROW)
    {
        // 1. No Shift key
        //  each press should clear the selected cells
        if (!isShifting) sudokuBoard.clearSelectedCells ();

        // 2. Shift key down
        //  do not clear selected cells (do nothing)

        cursorPosition[1] = cursorPosition[1] < 8 ? cursorPosition[1] + 1 : 0;
        
        // mark new cursor position as selected
        sudokuBoard.selectedCells[cursorPosition[0]][cursorPosition[1]] = 1;
    }
    else if (keyCode == DOWN_ARROW)
    {
        // 1. No Shift key
        //  each press should clear the selected cells
        if (!isShifting) sudokuBoard.clearSelectedCells ();

        // 2. Shift key down
        //  do not clear selected cells (do nothing)

        cursorPosition[0] = cursorPosition[0] < 8 ? cursorPosition[0] + 1 : 0;
        
        // mark new cursor position as selected
        sudokuBoard.selectedCells[cursorPosition[0]][cursorPosition[1]] = 1;
    }
    else if (keyCode == LEFT_ARROW)
    {
        // 1. No Shift key
        //  each press should clear the selected cells
        if (!isShifting) sudokuBoard.clearSelectedCells ();

        // 2. Shift key down
        //  do not clear selected cells (do nothing)

        cursorPosition[1] = cursorPosition[1] != 0 ? cursorPosition[1] - 1 : 8;
        
        // mark new cursor position as selected
        sudokuBoard.selectedCells[cursorPosition[0]][cursorPosition[1]] = 1;
    }

    // number is pressed
    if ("0123456789".includes(key))
    {
        sudokuBoard.inputDigit (parseInt(key));
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
        sudokuBoard.clearSelectedCells ();
    }

    // 1. if user clicked on a selected cell, then we are deselecting
    if (cellPos != null && sudokuBoard.selectedCells[cellPos[0]][cellPos[1]])
    {
        // deselect
        sudokuBoard.selectedCells[cellPos[0]][cellPos[1]] = 0;
        isSelecting = false;
    }

    // 2. if user clicked on an unselected cell, then we are selecting
    else if (cellPos != null && !sudokuBoard.selectedCells[cellPos[0]][cellPos[1]])
    {
        // select
        sudokuBoard.selectedCells[cellPos[0]][cellPos[1]] = 1;
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
        if (cellPos != null && isSelecting && !sudokuBoard.selectedCells[cellPos[0]][cellPos[1]])
        {
            // select the cell
            sudokuBoard.selectedCells[cellPos[0]][cellPos[1]] = 1;
        }

        // 2. if user is not selecting and is mouseOver a selected cell,
        // then unselected the cell
        if (cellPos != null && !isSelecting && sudokuBoard.selectedCells[cellPos[0]][cellPos[1]])
        {
            // select the cell
            sudokuBoard.selectedCells[cellPos[0]][cellPos[1]] = 0;
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
        let y = sudokuBoard.y + i * sudokuBoard.cellHeight;
        for (let j = 0; j < 9; ++j)
        {
            let x = sudokuBoard.x + j * sudokuBoard.cellWidth;

            // check if mouse is in this cell's bounds
            if (x < mouseX && mouseX < (x + sudokuBoard.cellWidth) &&
                y < mouseY && mouseY < (y + sudokuBoard.cellHeight))
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
    sudokuBoard.clearEverything ();

    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            sudokuBoard.board[i][j] = easyBoards[boardIndex][i][j];
}

//========================================================================

function loadMediumBoard (boardIndex)
{
    sudokuBoard.clearEverything ();

    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            sudokuBoard.board[i][j] = mediumBoards[boardIndex][i][j];
}

//========================================================================

function loadHardBoard (boardIndex)
{
    sudokuBoard.clearEverything ();

    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            sudokuBoard.board[i][j] = hardBoards[boardIndex][i][j];
}

//========================================================================

function loadExpertBoard (boardIndex)
{
    sudokuBoard.clearEverything ();

    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            sudokuBoard.board[i][j] = expertBoards[boardIndex][i][j];
    
}

//========================================================================

function loadEvilBoard (boardIndex)
{
    sudokuBoard.clearEverything ();

    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            sudokuBoard.board[i][j] = evilBoards[boardIndex][i][j];
}

//========================================================================

function loadCageBoard (boardIndex)
{
    sudokuBoard.clearEverything ();

    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            sudokuBoard.board[i][j] = cagesBoards[boardIndex].board[i][j];
    // add cages
    for (let cagei = 0; cagei < cagesBoards[boardIndex].cages.length; ++cagei)
    {
        sudokuBoard.cages.push (cagesBoards[boardIndex].cages[cagei]);
    }
}

//========================================================================

function hideTabs ()
{
    select ("#playPanel")      .style ("display", "none");
    select ("#boardMakerPanel").style ("display", "none");
    select ("#boardPanel")     .style ("display", "none");
    select ("#solverPanel")    .style ("display", "none");

    select ("#playTab")      .removeClass ("selectedTab");
    select ("#boardMakerTab").removeClass ("selectedTab");
    select ("#boardTab")     .removeClass ("selectedTab");
    select ("#solverTab")    .removeClass ("selectedTab");
}

//========================================================================

function playTab ()
{
    hideTabs ();

    select ("#playPanel")     .style ("display", "flex");

    select ("#playTab")     .addClass ("selectedTab");

    if (isDarkMode) setDarkMode (); else setLightMode ();

    editMode = MODE_PLAY;
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

// play tab

function cyclePlayMode ()
{
    ++playMode;
    if (playMode >= PLAY_MODE_END) playMode = PLAY_MODE_BASE;

    if (playMode == PLAY_MODE_DIGIT)
        playPanelDigitTab ();
    else if (playMode == PLAY_MODE_TOP)
        playPanelTopDigitTab ();
    else if (playMode == PLAY_MODE_SMALL)
        playPanelSmallDigitTab ();
    else if (playMode == PLAY_MODE_COLOR)
        playPanelColorTab ();
    else
        console.warn ("Unknown play mode ", playMode);
}

//========================================================================

function hidePlayTabs ()
{
    select ("#playPanelDigitPanel")     .style ("display", "none");
    select ("#playPanelTopDigitPanel")  .style ("display", "none");
    select ("#playPanelSmallDigitPanel").style ("display", "none");
    select ("#playPanelColorPanel")     .style ("display", "none");

    select ("#playPanelDigitTab")     .removeClass ("playPanelSelectedTab");
    select ("#playPanelTopDigitTab")  .removeClass ("playPanelSelectedTab");
    select ("#playPanelSmallDigitTab").removeClass ("playPanelSelectedTab");
    select ("#playPanelColorTab")     .removeClass ("playPanelSelectedTab");
}

//========================================================================

function playPanelDigitTab ()
{
    hidePlayTabs ();
    
    select ("#playPanelDigitPanel")    .style ("display", "flex");

    select ("#playPanelDigitTab")    .addClass ("playPanelSelectedTab");
    
    if (isDarkMode) setDarkMode (); else setLightMode ();

    playMode = PLAY_MODE_DIGIT;
}

//========================================================================

function playPanelTopDigitTab ()
{
    hidePlayTabs ();
    
    select ("#playPanelTopDigitPanel")    .style ("display", "flex");

    select ("#playPanelTopDigitTab")    .addClass ("playPanelSelectedTab");
    
    if (isDarkMode) setDarkMode (); else setLightMode ();

    playMode = PLAY_MODE_TOP;
}

//========================================================================

function playPanelSmallDigitTab ()
{
    hidePlayTabs ();
    
    select ("#playPanelSmallDigitPanel")    .style ("display", "flex");

    select ("#playPanelSmallDigitTab")    .addClass ("playPanelSelectedTab");
    
    if (isDarkMode) setDarkMode (); else setLightMode ();

    playMode = PLAY_MODE_SMALL;
}

//========================================================================

function playPanelColorTab ()
{
    hidePlayTabs ();
    
    select ("#playPanelColorPanel")    .style ("display", "flex");

    select ("#playPanelColorTab")    .addClass ("playPanelSelectedTab");
    
    if (isDarkMode) setDarkMode (); else setLightMode ();

    playMode = PLAY_MODE_COLOR;
}

//========================================================================

// board maker tabs


function cycleBoardMakerMode ()
{
    ++boardMakerMode;
    if (boardMakerMode >= BOARD_MAKER_MODE_END) boardMakerMode = BOARD_MAKER_MODE_BASE;

    if (boardMakerMode == BOARD_MAKER_MODE_BOARD)
        boardMakerPanelBoardTab ();
    else if (boardMakerMode == BOARD_MAKER_MODE_DIGIT)
        boardMakerPanelDigitTab ();
    else if (boardMakerMode == BOARD_MAKER_MODE_CAGES)
        boardMakerPanelCagesTab ();
    else if (boardMakerMode == BOARD_MAKER_MODE_DOMINOES)
        boardMakerPanelDominoesTab ();
    else
        console.warn ("Unknown board maker mode ", boardMakerMode);
}

//========================================================================

function hideBoardMakerTabs ()
{
    select ("#boardMakerPanelBoardPanel")   .style ("display", "none");
    select ("#boardMakerPanelDigitPanel")   .style ("display", "none");
    select ("#boardMakerPanelCagesPanel")   .style ("display", "none");
    select ("#boardMakerPanelDominoesPanel").style ("display", "none");

    select ("#boardMakerPanelBoardTab")   .removeClass ("boardMakerPanelSelectedTab");
    select ("#boardMakerPanelDigitTab")   .removeClass ("boardMakerPanelSelectedTab");
    select ("#boardMakerPanelCagesTab")   .removeClass ("boardMakerPanelSelectedTab");
    select ("#boardMakerPanelDominoesTab").removeClass ("boardMakerPanelSelectedTab");
}

//========================================================================

function boardMakerPanelBoardTab ()
{
    hideBoardMakerTabs ();
    
    select ("#boardMakerPanelBoardPanel")    .style ("display", "flex");

    select ("#boardMakerPanelBoardTab")    .addClass ("boardMakerPanelSelectedTab");
    
    if (isDarkMode) setDarkMode (); else setLightMode ();

    boardMakerMode = BOARD_MAKER_MODE_BOARD;
}

//========================================================================

function boardMakerPanelDigitTab ()
{
    hideBoardMakerTabs ();
    
    select ("#boardMakerPanelDigitPanel")    .style ("display", "flex");

    select ("#boardMakerPanelDigitTab")    .addClass ("boardMakerPanelSelectedTab");
    
    if (isDarkMode) setDarkMode (); else setLightMode ();

    boardMakerMode = BOARD_MAKER_MODE_DIGIT;
}

//========================================================================

function boardMakerPanelCagesTab ()
{
    hideBoardMakerTabs ();
    
    select ("#boardMakerPanelCagesPanel")    .style ("display", "flex");

    select ("#boardMakerPanelCagesTab")    .addClass ("boardMakerPanelSelectedTab");
    
    if (isDarkMode) setDarkMode (); else setLightMode ();

    boardMakerMode = BOARD_MAKER_MODE_CAGES;
}

//========================================================================

function boardMakerPanelDominoesTab ()
{
    hideBoardMakerTabs ();
    
    select ("#boardMakerPanelDominoesPanel")    .style ("display", "flex");

    select ("#boardMakerPanelDominoesTab")    .addClass ("boardMakerPanelSelectedTab");
    
    if (isDarkMode) setDarkMode (); else setLightMode ();

    boardMakerMode = BOARD_MAKER_MODE_DOMINOES;
}