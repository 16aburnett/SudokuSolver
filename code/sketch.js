// Sudoku Solver
// By Amy Burnett
//========================================================================
// Globals

let sudokuBoard;

let globalTextFont = "Courier";

// Color Theme
let isDarkMode = false;

let isDragging = false;
let isSelecting = false;
let isShifting = false;
let cursorPosition = [0, 0];

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
    select ("#WHITE_BUTTON") .style ("background-color", `rgba(${RGBA_COLORS[COLOR_WHITE][0]}, ${RGBA_COLORS[COLOR_WHITE][1]}, ${RGBA_COLORS[COLOR_WHITE][2]}, ${RGBA_COLORS[COLOR_WHITE][3]})`)

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
    // select all - SHIFT+A
    if (isShifting && (key == "A" || key == 'a'))
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
        let direction = isShifting;
        // play tab
        if (editMode == MODE_PLAY)
        {
            cyclePlayMode (direction);
        }
        // board maker
        else if (editMode == MODE_BOARD_MAKER)
        {
            cycleBoardMakerMode (direction);
        }
    }

    // delete from selected
    if (keyCode == DELETE || keyCode == BACKSPACE)
    {
        sudokuBoard.inputDigit (EMPTY_CELL);
    }

    // cursor movement
    if (keyCode == UP_ARROW)
    {
        // 1. No Shift key
        //  each press should clear the selected cells
        if (!isShifting) sudokuBoard.clearSelectedCells ();

        // 2. Shift key down
        //  do not clear selected cells (do nothing)

        cursorPosition[0] = cursorPosition[0] != 0 ? cursorPosition[0] - 1 : sudokuBoard.rows-1;
        
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

        cursorPosition[1] = cursorPosition[1] < sudokuBoard.cols-1 ? cursorPosition[1] + 1 : 0;
        
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

        cursorPosition[0] = cursorPosition[0] < sudokuBoard.rows-1 ? cursorPosition[0] + 1 : 0;
        
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

        cursorPosition[1] = cursorPosition[1] != 0 ? cursorPosition[1] - 1 : sudokuBoard.cols-1;
        
        // mark new cursor position as selected
        sudokuBoard.selectedCells[cursorPosition[0]][cursorPosition[1]] = 1;
    }

    // number is pressed
    const validInputDigits = "0123456789abcdef";
    if (validInputDigits.includes(key))
    {
        // input the digit to all currently selected cells
        sudokuBoard.inputDigit (validInputDigits.indexOf(key));
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

    let cellPos = sudokuBoard.mousePositionToCell ();

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
        let cellPos = sudokuBoard.mousePositionToCell ();

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

function loadEasyBoard (boardIndex)
{
    createDecimalBoard ();

    for (let i = 0; i < sudokuBoard.rows; ++i)
        for (let j = 0; j < sudokuBoard.cols; ++j)
            sudokuBoard.board[i][j] = easyBoards[boardIndex][i][j];
}

//========================================================================

function loadMediumBoard (boardIndex)
{
    createDecimalBoard ();

    for (let i = 0; i < sudokuBoard.rows; ++i)
        for (let j = 0; j < sudokuBoard.cols; ++j)
            sudokuBoard.board[i][j] = mediumBoards[boardIndex][i][j];
}

//========================================================================

function loadHardBoard (boardIndex)
{
    createDecimalBoard ();

    for (let i = 0; i < sudokuBoard.rows; ++i)
        for (let j = 0; j < sudokuBoard.cols; ++j)
            sudokuBoard.board[i][j] = hardBoards[boardIndex][i][j];
}

//========================================================================

function loadExpertBoard (boardIndex)
{
    createDecimalBoard ();

    for (let i = 0; i < sudokuBoard.rows; ++i)
        for (let j = 0; j < sudokuBoard.cols; ++j)
            sudokuBoard.board[i][j] = expertBoards[boardIndex][i][j];
    
}

//========================================================================

function loadEvilBoard (boardIndex)
{
    createDecimalBoard ();

    for (let i = 0; i < sudokuBoard.rows; ++i)
        for (let j = 0; j < sudokuBoard.cols; ++j)
            sudokuBoard.board[i][j] = evilBoards[boardIndex][i][j];
}

//========================================================================

function loadIntermediateHexadecimalBoard (boardIndex)
{
    createHexadecimalBoard ();

    for (let i = 0; i < sudokuBoard.rows; ++i)
        for (let j = 0; j < sudokuBoard.cols; ++j)
            sudokuBoard.board[i][j] = intermediateHexadecimalBoards[boardIndex][i][j];
}

//========================================================================

function loadChallengingHexadecimalBoard (boardIndex)
{
    createHexadecimalBoard ();

    for (let i = 0; i < sudokuBoard.rows; ++i)
        for (let j = 0; j < sudokuBoard.cols; ++j)
            sudokuBoard.board[i][j] = challengingHexadecimalBoards[boardIndex][i][j];
}

//========================================================================

function loadToughHexadecimalBoard (boardIndex)
{
    createHexadecimalBoard ();

    for (let i = 0; i < sudokuBoard.rows; ++i)
        for (let j = 0; j < sudokuBoard.cols; ++j)
            sudokuBoard.board[i][j] = toughHexadecimalBoards[boardIndex][i][j];
}

//========================================================================

function loadCageBoard (boardIndex)
{
    createDecimalBoard ();

    for (let i = 0; i < sudokuBoard.rows; ++i)
        for (let j = 0; j < sudokuBoard.cols; ++j)
            sudokuBoard.board[i][j] = cagesBoards[boardIndex].board[i][j];
    // add cages
    for (let cagei = 0; cagei < cagesBoards[boardIndex].cages.length; ++cagei)
    {
        sudokuBoard.cages.push (cagesBoards[boardIndex].cages[cagei]);
    }
}

//========================================================================

function createDecimalBoard ()
{
    sudokuBoard = new SudokuBoard (9);

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
}

//========================================================================

function createHexadecimalBoard ()
{
    sudokuBoard = new SudokuBoard (16);

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

function cyclePlayMode (direction)
{
    // cycle forward
    if (direction == 0) 
    {
        ++playMode;
        if (playMode >= PLAY_MODE_END) playMode = PLAY_MODE_BASE;
    }
    // cycle backwards
    else // direction == 1
    {
        --playMode;
        if (playMode < PLAY_MODE_BASE) playMode = PLAY_MODE_END-1; 
    }

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


function cycleBoardMakerMode (direction)
{
    // cycle forward
    if (direction == 0) 
    {
        ++boardMakerMode;
        if (boardMakerMode >= BOARD_MAKER_MODE_END) boardMakerMode = BOARD_MAKER_MODE_BASE;
    }
    // cycle backwards
    else // direction == 1
    {
        --boardMakerMode;
        if (boardMakerMode < BOARD_MAKER_MODE_BASE) boardMakerMode = BOARD_MAKER_MODE_END-1; 
    }

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