// Sudoku Solver
// By Amy Burnett
//========================================================================
// Globals

let sudokuBoard;

let globalTextFont = "Arial";

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
    let smallestDimension = min (windowWidth * 0.50 - 10, windowHeight * 0.75 - 20);
    let canvas = createCanvas (smallestDimension, smallestDimension);
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

    // setup rule set
    updateRuleSet ();

}

//========================================================================

function draw ()
{
    // background ("#ff0000");
    background (sudokuBoard.boardBackgroundColor);

    sudokuBoard.show ();

    // ensure rules are updated
    // document.getElementById ("rules_normalSudoku").checked = true;
    // document.getElementById ("rules_uniqueCages").checked = true;
    // document.getElementById ("rules_fullDomino").checked = sudokuBoard.isFullDomino;

}

//========================================================================

function windowResized ()
{
    // we want the canvas to be square so use whatever is the more constrained dim
    let smallestDimension = min (windowWidth * 0.50 - 10, windowHeight * 0.75 - 20);
    resizeCanvas(smallestDimension, smallestDimension);
    sudokuBoard.resizeBoard ();
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
//=== Board Maker Interface ==============================================
//========================================================================

// prompts the user for a new name for the current board
// only changes name locally, board must be exported to JSON after
function addBoardName ()
{
    let name = prompt ("Enter the Name of the board", sudokuBoard.name);
    // ensure user did not cancel
    if (name === null)
        return;
    sudokuBoard.name = name;

    // Update Rule set of new puzzle to load new name
    // I know that this isnt a ruleset change,
    // so this should probably be a different function
    // but this seemed like the easiest/quickest solution
    updateRuleSet ();
}

//========================================================================

// prompts the user for the author(s) of the puzzle
// only changes name locally, board must be exported to JSON after
function addBoardAuthors ()
{
    let author = prompt ("Enter the Author(s) of the board", sudokuBoard.author);
    // ensure user did not cancel
    if (name === null)
        return;
    sudokuBoard.author = author;
    
    // Update Rule set of new puzzle to load new name
    // I know that this isnt a ruleset change,
    // so this should probably be a different function
    // but this seemed like the easiest/quickest solution
    updateRuleSet ();
}

//========================================================================

// prompts the user for the url source of the puzzle
// only changes name locally, board must be exported to JSON after
function addBoardURL ()
{
    let URL = prompt ("Enter the URL source of the board", sudokuBoard.URL);
    // ensure user did not cancel
    if (name === null)
        return;
    sudokuBoard.URL = URL;

    // Update Rule set of new puzzle to load new name
    // I know that this isnt a ruleset change,
    // so this should probably be a different function
    // but this seemed like the easiest/quickest solution
    updateRuleSet ();
}

//========================================================================

function clearEverything ()
{
    sudokuBoard = new SudokuBoard(sudokuBoard.numDigits);

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

    // Update Rule set of new puzzle
    updateRuleSet ();
}

//========================================================================

function loadBoardFromData (data)
{
    // ensure base was provided
    let base = 9;
    // if (!("base" in data))
    // {
    //     console.log ("Load Error: base is required");
    //     return;
    // }
    if ("base" in data)
    {
        base = data["base"];
    }

    // ensure we have a board
    let hasBoardKey = ("board" in data);
    let isArray = Array.isArray(data["board"])
    if (!hasBoardKey || !isArray)
    {
        console.log ("Load Error: board is required");
        return;
    }

    // try to determine base from board size
    if (data["board"].length == 9 || data["board"].length == 16)
    {
        base = data["board"].length;
    }
    else
    {
        console.log ("Load Error: board size must be 9 or 16, but got", data["board"].length);
        return;
    }

    newSudokuBoard = new SudokuBoard (base);
    
    // load credits
    if ("name" in data)
        newSudokuBoard.name = data["name"];
    if ("author" in data)
        newSudokuBoard.author = data["author"];
    if ("URL" in data)
        newSudokuBoard.URL = data["URL"];

    // load board
    for (let i = 0; i < newSudokuBoard.rows; ++i)
    {
        for (let j = 0; j < newSudokuBoard.cols; ++j)
        {
            newSudokuBoard.board[i][j] = data["board"][i][j];
            // treat each loaded digit as a given digit
            if (data["board"][i][j] != EMPTY_CELL)
                newSudokuBoard.givenDigits[i][j] = IS_A_GIVEN_DIGIT;
        }
    }

    // add cages, if there are any
    for (let cagei = 0; "cages" in data && cagei < data["cages"].length; ++cagei)
        newSudokuBoard.cages.push (data["cages"][cagei]);

    // add dominoes, if there are any
    if ("dominoes" in data)
        for (let i = 0; i < newSudokuBoard.rows; ++i)
            for (let j = 0; j < newSudokuBoard.cols; ++j)
                for (let d = 0; d < DOMINO_NUM_DIRS; ++d)
                    newSudokuBoard.dominoes[i][j][d] = data["dominoes"][i][j][d];
    if ("areAllKropkiWhiteGiven" in data)
        newSudokuBoard.areAllKropkiWhiteGiven = data["areAllKropkiWhiteGiven"];
    if ("areAllKropkiBlackGiven" in data)
        newSudokuBoard.areAllKropkiBlackGiven = data["areAllKropkiBlackGiven"];
    if ("areAllSumVGiven" in data)
        newSudokuBoard.areAllSumVGiven = data["areAllSumVGiven"];
    if ("areAllSumXGiven" in data)
        newSudokuBoard.areAllSumXGiven = data["areAllSumXGiven"];
    if ("areAllLessThanGiven" in data)
        newSudokuBoard.areAllLessThanGiven = data["areAllLessThanGiven"];
    if ("areAllGreaterThanGiven" in data)
        newSudokuBoard.areAllGreaterThanGiven = data["areAllGreaterThanGiven"];

    // swap in the newly loaded sudoku board
    sudokuBoard = newSudokuBoard;

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

    // Update Rule set of new puzzle
    updateRuleSet ();

}

//========================================================================

function loadEasyBoard (boardIndex)
{
    loadBoardFromData (easyBoards[boardIndex]);
}

//========================================================================

function loadMediumBoard (boardIndex)
{
    loadBoardFromData (mediumBoards[boardIndex]);
}

//========================================================================

function loadHardBoard (boardIndex)
{
    loadBoardFromData (hardBoards[boardIndex]);
}

//========================================================================

function loadExpertBoard (boardIndex)
{
    loadBoardFromData (expertBoards[boardIndex]);
    
}

//========================================================================

function loadEvilBoard (boardIndex)
{
    loadBoardFromData (evilBoards[boardIndex]);
}

//========================================================================

function loadIntermediateHexadecimalBoard (boardIndex)
{
    loadBoardFromData (intermediateHexadecimalBoards[boardIndex]);
}

//========================================================================

function loadChallengingHexadecimalBoard (boardIndex)
{
    loadBoardFromData (challengingHexadecimalBoards[boardIndex]);
}

//========================================================================

function loadToughHexadecimalBoard (boardIndex)
{
    loadBoardFromData (toughHexadecimalBoards[boardIndex]);
}

//========================================================================

function loadSuperToughHexadecimalBoard (boardIndex)
{
    loadBoardFromData (superToughHexadecimalBoards[boardIndex]);
}

//========================================================================

function loadCageBoard (boardIndex)
{
    loadBoardFromData (cagesBoards[boardIndex]);
}

//========================================================================

function loadDominoBoard (boardIndex)
{
    fetch(`puzzles/dominoPuzzle${boardIndex}.json`)
        .then(response => response.json())
        .then(json => loadBoardFromData (json));
}

//========================================================================

// Board Maker: Killer Cages Interface

function cageSelectedCells ()
{
    sudokuBoard.cageSelectedCells ();
    // Update Rule set since we changed a rule
    updateRuleSet ();
}

function uncageSelectedCells ()
{
    sudokuBoard.uncageSelectedCells ();
    // Update Rule set since we changed a rule
    updateRuleSet ();
}

function toggleCageUniqueness ()
{
    sudokuBoard.areCagedCellDigitsUnique = document.getElementById ("cageUniquenessSlider").checked;
    // Update Rule set since we changed a rule
    updateRuleSet ();
}

//========================================================================

// Board Maker: Dominoes Interface

function markDominoWithSelectedCells (domino_type)
{
    sudokuBoard.markDominoWithSelectedCells (domino_type);
    // Update Rule set since we changed a rule
    updateRuleSet ();
}

function clearAllDominoes ()
{
    sudokuBoard.clearDominoes ();
    // Update Rule set since we changed a rule
    updateRuleSet ();
}

function toggleDominoFullness (type)
{
    // Update rule in board
    if (type == DOMINO_KROPKI_WHITE)      sudokuBoard.areAllKropkiWhiteGiven = document.getElementById ("kropkiWhiteFullnessSlider").checked;
    else if (type == DOMINO_KROPKI_BLACK) sudokuBoard.areAllKropkiBlackGiven = document.getElementById ("kropkiBlackFullnessSlider").checked;
    else if (type == DOMINO_SUM_V)        sudokuBoard.areAllSumVGiven = document.getElementById ("sumVFullnessSlider").checked;
    else if (type == DOMINO_SUM_X)        sudokuBoard.areAllSumXGiven = document.getElementById ("sumXFullnessSlider").checked;
    else if (type == DOMINO_LESS_THAN)    sudokuBoard.areAllLessThanGiven = document.getElementById ("lessThanFullnessSlider").checked;
    else if (type == DOMINO_GREATER_THAN) sudokuBoard.areAllGreaterThanGiven = document.getElementById ("greaterThanFullnessSlider").checked;
    else console.log ("Error: unknown domino type", type);
    // Update Rule set since we changed a rule
    updateRuleSet ();
}

//========================================================================

// This function queries the current sudoku board to determine the rules
// needed to solve the puzzle.
function updateRuleSet ()
{
    // update credits
    // this should really be a different function
    document.getElementById ("rulesSectionBoardTitle").innerText   = sudokuBoard.name;
    document.getElementById ("rulesSectionBoardAuthors").innerText = sudokuBoard.author;
    document.getElementById ("rulesSectionBoardURL").href          = sudokuBoard.URL;

    let ruleSet = "";
    // determine if normal sudoku rules apply.
    if (sudokuBoard.isNormalSudokuRules && sudokuBoard.numDigits == NORMAL_SUDOKU_DIMENSIONS)
        ruleSet += "Normal Sudoku rules apply. The digits [1,9] must appear once each in every row, column, and 3x3 box. "
    else if (sudokuBoard.isNormalSudokuRules && sudokuBoard.numDigits == HEXADECIMAL_SUDOKU_DIMENSIONS)
        ruleSet += "Normal Hexadecimal Sudoku rules apply. The hexadecimal digits [0,F] must appear once each in every row, column, and 4x4 box. "
    else
        ruleSet += "Normal Sudoku rules do NOT apply. "
    
    // Variant Sudoku rules
    // Killer Cages
    if (sudokuBoard.hasKillerCages())
    {
        // Line breaks for readability + separation of rules
        ruleSet += "<br/><br/>";
        ruleSet += "<b>Killer Cages:</b> Digits in caged cells must sum to the clue in the top-left of the cage. "
        // determine if digits must be unique within the cages
        if (sudokuBoard.areCagedCellDigitsUnique)
            ruleSet += "Digits in cages may not repeat. "
    }

    // Dominoes
    // Kropki white
    if (sudokuBoard.hasKropkiWhiteDominoes())
    {
        // Line breaks for readability + separation of rules
        ruleSet += "<br/><br/>";
        // determine if negative constraint applies
        if (sudokuBoard.areAllKropkiWhiteGiven)
        {
            ruleSet += "<b>Full Kropki White:</b> Cells separated by a white dot contain consecutive digits; "
            ruleSet += "All possible such dots are given. "
        }
        else
        {
            ruleSet += "<b>Partial Kropki White:</b> Cells separated by a white dot contain consecutive digits; "
            ruleSet += "Not all such dots are given. "
        }
    }
    // Kropki black
    if (sudokuBoard.hasKropkiBlackDominoes())
    {
        // Line breaks for readability + separation of rules
        ruleSet += "<br/><br/>";
        // determine if negative constraint applies
        if (sudokuBoard.areAllKropkiBlackGiven)
        {
            ruleSet += "<b>Full Kropki Black:</b> Cells separated by a black dot contain digits that have a 1:2 ratio; "
            ruleSet += "All possible such dots are given. "
        }
        else
        {
            ruleSet += "<b>Partial Kropki Black:</b> Cells separated by a black dot contain digits that have a 1:2 ratio; "
            ruleSet += "Not all such dots are given. "
        }
    }
    // Both kropki + negative constraints
    // this shows up because we dont want the Player to think that
    // a black dot without a white dot means that digits must be 1:2 and not consecutive
    // when actually we allow the case of 1 and 2 being on a black or white dot
    // which are both consecutive and in a 1:2 relationship
    if (sudokuBoard.hasKropkiWhiteDominoes() && sudokuBoard.hasKropkiBlackDominoes() && (sudokuBoard.areAllKropkiWhiteGiven || sudokuBoard.areAllKropkiBlackGiven))
    {
        ruleSet += "A domino with the digits 1 and 2 can have either a white dot or a black dot. "
    }
    // Sum V
    if (sudokuBoard.hasSumVDominoes())
    {
        // Line breaks for readability + separation of rules
        ruleSet += "<br/><br/>";
        // determine if negative constraint applies
        if (sudokuBoard.areAllSumVGiven)
        {
            ruleSet += "<b>Full Sum V:</b> Cells separated by a V must sum to 5; "
            ruleSet += "All possible Vs are given. "
        }
        else
        {
            ruleSet += "<b>Partial Sum V:</b> Cells separated by a V must sum to 5; "
            ruleSet += "Not all Vs are given. "
        }
    }
    // Sum X
    if (sudokuBoard.hasSumXDominoes())
    {
        // Line breaks for readability + separation of rules
        ruleSet += "<br/><br/>";
        // determine if negative constraint applies
        if (sudokuBoard.areAllSumXGiven)
        {
            ruleSet += "<b>Full Sum X:</b> Cells separated by a X must sum to 10; "
            ruleSet += "All possible Xs are given. "
        }
        else
        {
            ruleSet += "<b>Partial Sum X:</b> Cells separated by a X must sum to 10; "
            ruleSet += "Not all Xs are given. "
        }
    }
    // less than
    if (sudokuBoard.hasLessThanDominoes())
    {
        // Line breaks for readability + separation of rules
        ruleSet += "<br/><br/>";
        // determine if negative constraint applies
        if (sudokuBoard.areAllLessThanGiven)
        {
            ruleSet += "<b>Full Less Than:</b> A < between two cells points to the smaller digit; "
            ruleSet += "All possible < dominoes are given. "
        }
        else
        {
            ruleSet += "<b>Partial Less Than:</b> A < between two cells points to the smaller digit; "
            ruleSet += "Not all possible < dominoes are given. "
        }
    }
    // greater than
    if (sudokuBoard.hasGreaterThanDominoes())
    {
        // Line breaks for readability + separation of rules
        ruleSet += "<br/><br/>";
        // determine if negative constraint applies
        if (sudokuBoard.areAllGreaterThanGiven)
        {
            ruleSet += "<b>Full Greater Than:</b> A > between two cells points to the smaller digit; "
            ruleSet += "All possible > dominoes are given. "
        }
        else
        {
            ruleSet += "<b>Partial Greater Than:</b> A > between two cells points to the smaller digit; "
            ruleSet += "Not all possible > dominoes are given. "
        }
    }

    // Update rule set
    document.getElementById ("rules").innerHTML = ruleSet;
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
    
    // Update Rule set since we changed a rule
    updateRuleSet ();
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
    
    // Update Rule set since we changed a rule
    updateRuleSet ();
}

//========================================================================

function exportBoardToJSON ()
{
    // gather board data/state
    let board_data = {
        base: sudokuBoard.numDigits,
        board: sudokuBoard.board,
        givenDigits: sudokuBoard.givenDigits,
        selectedCells: sudokuBoard.selectedCells,
        topDigits: sudokuBoard.topDigits,
        centerDigits: sudokuBoard.centerDigits,
        cellColors: sudokuBoard.cellColors,
        // [advanced sudoku features]
        cages: sudokuBoard.cages,
        dominoes: sudokuBoard.dominoes,
        isFullDomino: sudokuBoard.isFullDomino,
        areAllKropkiWhiteGiven: sudokuBoard.areAllKropkiWhiteGiven,
        areAllKropkiBlackGiven: sudokuBoard.areAllKropkiBlackGiven,
        areAllSumVGiven: sudokuBoard.areAllSumVGiven,
        areAllSumXGiven: sudokuBoard.areAllSumXGiven,
        areAllLessThanGiven: sudokuBoard.areAllLessThanGiven,
        areAllGreaterThanGiven: sudokuBoard.areAllGreaterThanGiven,
    };
    
    const filename = 'data.json';
    const jsonStr = JSON.stringify(board_data);

    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
    
    // Update Rule set since we changed a rule
    updateRuleSet ();
}

//========================================================================

function importBoardFromJSON ()
{
    let files = document.getElementById("importBoardFromJSON_btn").files;
    // ensure we got 1 file
    if (files.length != 1)
    {
        console.log ("Error: expected 1 file, but got", files.length)
        return;
    }
    
    let file_reader = new FileReader ();

    file_reader.onload = function (e) {

        let data = JSON.parse (e.target.result);
        console.log (data);

        loadBoardFromData (data);

    };
    file_reader.readAsText (files.item(0));
    
    // Update Rule set since we changed a rule
    updateRuleSet ();
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