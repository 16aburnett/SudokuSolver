

class SudokuBoard 
{
    constructor ()
    {
        // Board structure
        this.numDigits = 9;
        this.rows = 9;
        this.cols = 9;
        this.boxRows = 3;
        this.boxCols = 3;

        // Board state/data
        // the board stores the filled in digits for each cell
        this.board = [];
        // this represents given, unchangable digits
        this.givenDigits = [];
        // this stores which cells are currently selected
        this.selectedCells = [];
        // top pencil mark digits (rows*cols*num_digits)
        this.topDigits = [];
        // middle/center pencil mark digits (rows*cols*num_digits)
        this.centerDigits = [];
        // cell background colors (rows*cols*num_colors)
        this.cellColors = [];

        // [advanced sudoku features]
        // this stores the killer cages
        // in the form of a list of cages
        // each cage stores a cage sum
        // and a list of cells that make up the cage
        this.cages = [];

        // initialize board state
        for (let i = 0; i < this.rows; ++i)
        {
            this.board        .push ([]);
            this.givenDigits  .push ([]);
            this.selectedCells.push ([]);
            this.topDigits    .push ([]);
            this.centerDigits .push ([]);
            this.cellColors   .push ([]);
            for (let j = 0; j < this.cols; ++j)
            {
                this.board[i]        .push (0);
                this.givenDigits[i]  .push (0);
                this.selectedCells[i].push (0);
                this.topDigits[i]    .push ([]);
                this.centerDigits[i] .push ([]);
                this.cellColors[i]   .push ([]);
                for (let k = 0; k < this.numDigits; ++k)
                {
                    this.topDigits[i][j]   .push (0);
                    this.centerDigits[i][j].push (0);
                    this.cellColors[i][j]  .push (0);
                }
            }
        }

        // Board positioning/visual structure
        this.padding = 10;
        this.x = this.padding;
        this.y = this.padding;
        this.width = width - 2 * this.padding;
        this.height = height - 2 * this.padding;
    
        this.boxWidth = this.width / this.boxCols;
        this.boxHeight = this.height / this.boxRows;
    
        let rowsPerBox = this.rows / this.boxRows;
        let colsPerBox = this.cols / this.boxCols;
        this.cellWidth = this.boxWidth / rowsPerBox;
        this.cellHeight = this.boxHeight / colsPerBox;

        this.cellBorderWidth = 1;
        this.boxBorderWidth = 3;
        this.selectBorderWidth = 6;
        this.selectBorderPadding = 3;

        // Board coloring
        this.boardBackgroundColor = DARKMODE_BACKGROUND0;
        this.digitColor = DARKMODE_FOREGROUND0;
        this.borderColor = DARKMODE_FOREGROUND0;
        // let selectionColor = [50, 50, 200, 220];
        this.selectionBorderColor = [50, 255, 255, 220];
        this.cursorBorderColor =    [250, 255, 50, 220];

        this.cageBorderColor = DARKMODE_FOREGROUND0;
        this.cageSumColor = DARKMODE_FOREGROUND0;
        this.cageTextSize = 12;
        this.cageTextFont = "Sans";
    }

    //========================================================================
    
    // returns true if the current board state is solved
    // returns false if it is not solved or incomplete
    isBoardSolved ()
    {
        for (let i = 0; i < 9; ++i)
            for (let j = 0; j < 9; ++j)
                if (this.board[i][j] == 0 || this.isCellConflicting (i, j))
                    return false;
        
        // Reaches here if all numbers are filled in and there were
        // no conflicts found
        return true;
    }

    //====================================================================

    clearEverything ()
    {
        this.clearSelectedCells ();
        this.clearAllMarks ();
        // advanced sudoku features
        this.clearCages ();
    }
    
    //========================================================================
    
    clearCages ()
    {
        this.cages = [];
    }
    
    //========================================================================
    
    isAllCellsSelected ()
    {
        for (let i = 0; i < 9; ++i)
        {
            for (let j = 0; j < 9; ++j)
            {
                if (sudokuBoard.selectedCells[i][j] == 0)
                {
                    return false;
                }
            }
        }
        // reaches here if we don't find an unselected cell
        // meaning that all cells are selected
        return true;
    }
    
    //========================================================================
    
    selectAllCells ()
    {
        for (let i = 0; i < this.rows; ++i)
            for (let j = 0; j < this.cols; ++j)
                this.selectedCells[i][j] = 1;
    }
    
    //========================================================================
    
    clearSelectedCells ()
    {
        for (let i = 0; i < this.rows; ++i)
            for (let j = 0; j < this.cols; ++j)
                this.selectedCells[i][j] = 0;
    }
    
    //========================================================================
    
    clearAllMarks ()
    {
        this.clearBoard ();
        this.clearTopDigits ();
        this.clearCenterDigits ();
        this.clearColors ();
    }
    
    //========================================================================
    
    clearBoard ()
    {
        for (let i = 0; i < this.rows; ++i)
            for (let j = 0; j < this.cols; ++j)
                sudokuBoard.board[i][j] = 0;
    }
    
    //========================================================================
    
    clearTopDigits ()
    {
        for (let i = 0; i < this.rows; ++i)
            for (let j = 0; j < this.cols; ++j)
                for (let k = 0; k < this.numDigits; ++k)
                    sudokuBoard.topDigits[i][j][k] = 0;
    }
    
    //========================================================================
    
    clearCenterDigits ()
    {
        for (let i = 0; i < this.rows; ++i)
            for (let j = 0; j < this.cols; ++j)
                for (let k = 0; k < this.numDigits; ++k)
                    sudokuBoard.centerDigits[i][j][k] = 0;
    }
    
    //========================================================================
    
    clearColors ()
    {
        for (let i = 0; i < this.rows; ++i)
            for (let j = 0; j < this.cols; ++j)
                for (let k = 0; k < this.numDigits; ++k)
                    sudokuBoard.cellColors[i][j][k] = 0;
    }
    
    //========================================================================
    
    getCenterDigits (i, j)
    {
        let penciledDigits = [];
        for (let p = 0; p < 9; ++p)
            if (this.centerDigits[i][j][p] == 1)
                penciledDigits.push (p+1);
        return penciledDigits;
    }
    
    //========================================================================
    
    getTopDigits (i, j)
    {
        let topDigits_ = [];
        for (let p = 0; p < 9; ++p)
            if (this.topDigits[i][j][p] == 1)
                topDigits_.push (p+1);
        return topDigits_;
    }

    //====================================================================

    // return true if there is a conflict with this cell
    // by having the same digit in either the same row, col, or box.
    // returns false if there is no conflict
    isCellConflicting (i, j)
    {
        // check row
        for (let jj = 0; jj < this.cols; ++jj)
        {
            if (jj != j && this.board[i][jj] == this.board[i][j] && this.board[i][jj] != 0)
                return true;
        }
        // check col
        for (let ii = 0; ii < this.rows; ++ii)
        {
            if (ii != i && this.board[ii][j] == this.board[i][j] && this.board[ii][j] != 0)
                return true;
        }
        // check box
        let boxI = Math.floor (i / this.boxRows);
        let boxJ = Math.floor (j / this.boxCols);
        for (let bi = boxI * 3; bi < (boxI+1)*3; ++bi)
        {
            for (let bj = boxJ * 3; bj < (boxJ+1)*3; ++bj)
            {
                // ensure we are not looking at the same position
                if (!(bi == i && bj == j) && this.board[bi][bj] == this.board[i][j] && this.board[bi][bj] != 0)
                    return true;
            }
        }

        // reaches here if we did not find a conflict
        return false;
    }

    //====================================================================

    isDigitValid (i, j, digit)
    {
        // check row
        for (let jj = 0; jj < this.cols; ++jj)
        {
            if (jj != j && this.board[i][jj] == digit && this.board[i][jj] != 0)
                return false;
        }
        // check col
        for (let ii = 0; ii < this.rows; ++ii)
        {
            if (ii != i && this.board[ii][j] == digit && this.board[ii][j] != 0)
                return false;
        }
        // check box
        let boxI = Math.floor (i / this.boxRows);
        let boxJ = Math.floor (j / this.boxCols);
        for (let bi = boxI * 3; bi < (boxI+1)*3; ++bi)
        {
            for (let bj = boxJ * 3; bj < (boxJ+1)*3; ++bj)
            {
                // ensure we are not looking at the same position
                if (!(bi == i && bj == j) && this.board[bi][bj] == digit && this.board[bi][bj] != 0)
                    return false;
            }
        }

        // reaches here if we did not find a conflict
        return true;
    }


    //====================================================================

    // turns the selected cells into a cage and prompts for the desired sum
    // if selected cells are already a cage, then it removes the cage
    // if selected cells are not orthogonally connected, then a cage cannot be made
    cageSelectedCells ()
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
                if (firsti == -1 && this.selectedCells[i][j])
                {
                    firsti = i; firstj = j;
                }
                dfsBoard[i][j] = this.selectedCells[i][j];
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
            let [i, j] = frontier.pop ();
            // visit cell
            dfsBoard[i][j] = 0;
            // visit neighbors if they were selected
            if (i-1 >= 0 && dfsBoard[i-1][j  ] == 1) frontier.push ([i-1,j  ]);
            if (j+1 <  9 && dfsBoard[i  ][j+1] == 1) frontier.push ([i  ,j+1]);
            if (i+1 <  9 && dfsBoard[i+1][j  ] == 1) frontier.push ([i+1,j  ]);
            if (j-1 >= 0 && dfsBoard[i  ][j-1] == 1) frontier.push ([i  ,j-1]);
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
                if (this.selectedCells[i][j])
                {
                    for (let cg = 0; cg < this.cages.length; ++cg)
                    {
                        let cage = this.cages[cg];
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
        console.log (`Making cage with sum ${sum}`);
        let cells = [];
        for (let i = 0; i < 9; ++i)
        {
            for (let j = 0; j < 9; ++j)
            {
                if (sudokuBoard.selectedCells[i][j])
                    cells.push ([i,j]);
            }
        }
        let cage = [sum, cells];
        this.cages.push (cage);
        
    }

    //========================================================================
    
    // removes any cages that have intersecting cells with the current selected cells
    uncageSelectedCells ()
    {
        for (let i = 0; i < this.rows; ++i)
        {
            for (let j = 0; j < this.cols; ++j)
            {
                if (this.selectedCells[i][j])
                {
                    for (let cg = this.cages.length-1; cg >= 0; --cg)
                    {
                        let cage = this.cages[cg];
                        for (let c = 0; c < cage[1].length; ++c)
                        {
                            let [celli, cellj] = cage[1][c];
                            if (i == celli && j == cellj)
                            {
                                // remove the whole cage at this cell
                                this.cages.splice (cg, 1);
                            }
                        }
                    }
                }
            }
        }
    }
    //========================================================================
    
    // Applies a given digit to each of the currently selected cells
    // and in the current mode. If all selected cells already contain this
    // digit, then the digit is instead removed from all of the selected cells
    inputDigit (digit)
    {
        // ** temporarily treat board maker digits as play digits
        let prevEditMode = editMode;
        if (editMode == MODE_BOARD_MAKER && boardMakerMode == BOARD_MAKER_MODE_DIGIT) 
        {
            editMode = MODE_PLAY;
            playMode = PLAY_MODE_DIGIT;
        }
        // 1. given digit is 0 - should clear all info from selected
        //   for the given mode
        if (digit == 0)
        {    
            for (let i = 0; i < 9; ++i)
            {
                for (let j = 0; j < 9; ++j)
                {
                    // delete if cell is selected
                    if (this.selectedCells[i][j])
                    {
                        if (editMode == MODE_PLAY && playMode == PLAY_MODE_DIGIT)
                        {
                            this.board[i][j] = 0;
                        }
                        else if (editMode == MODE_PLAY && playMode == PLAY_MODE_TOP && this.board[i][j] == 0)
                        {
                            for (let k = 0; k < 9; ++k)
                            {
                                this.topDigits[i][j][k] = 0;
                            }
                        }
                        else if (editMode == MODE_PLAY && playMode == PLAY_MODE_SMALL && this.board[i][j] == 0)
                        {
                            for (let k = 0; k < 9; ++k)
                            {
                                this.centerDigits[i][j][k] = 0;
                            }
                        }
                        else if (editMode == MODE_PLAY && playMode == PLAY_MODE_COLOR)
                        {
                            for (let k = 0; k < 9; ++k)
                            {
                                this.cellColors[i][j][k] = 0;
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
                if (this.selectedCells[i][j])
                {
                    if (editMode == MODE_PLAY && playMode == PLAY_MODE_DIGIT && this.board[i][j] != digit)
                    {
                        this.board[i][j] = digit;
                        wasChanged = true;
                    }
                    else if (editMode == MODE_PLAY && playMode == PLAY_MODE_TOP && this.board[i][j] == 0 && this.topDigits[i][j][digit-1] == 0)
                    {
                        this.topDigits[i][j][digit-1] = 1;
                        wasChanged = true;
                    }
                    else if (editMode == MODE_PLAY && playMode == PLAY_MODE_SMALL && this.board[i][j] == 0 && this.centerDigits[i][j][digit-1] == 0)
                    {
                        this.centerDigits[i][j][digit-1] = 1;
                        wasChanged = true;
                    }
                    else if (editMode == MODE_PLAY && playMode == PLAY_MODE_COLOR && this.cellColors[i][j][digit-1] == 0)
                    {
                        this.cellColors[i][j][digit-1] = 1;
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
                    if (this.selectedCells[i][j])
                    {
                        if (editMode == MODE_PLAY && playMode == PLAY_MODE_DIGIT)
                        {
                            this.board[i][j] = 0;
                        }
                        else if (editMode == MODE_PLAY && playMode == PLAY_MODE_TOP && this.board[i][j] == 0)
                        {
                            this.topDigits[i][j][digit-1] = 0;
                        }
                        else if (editMode == MODE_PLAY && playMode == PLAY_MODE_SMALL && this.board[i][j] == 0)
                        {
                            this.centerDigits[i][j][digit-1] = 0;
                        }
                        else if (editMode == MODE_PLAY && playMode == PLAY_MODE_COLOR)
                        {
                            this.cellColors[i][j][digit-1] = 0;
                            wasChanged = true;
                        }
                    }
                }
            }
        }
    
        // ** temporary
        editMode = prevEditMode;
    
    }    

    //====================================================================

    setDarkMode ()
    {
        this.boardBackgroundColor = DARKMODE_BACKGROUND0;
        this.digitColor = DARKMODE_FOREGROUND0;
        this.borderColor = DARKMODE_FOREGROUND0;
        this.cageBorderColor = DARKMODE_FOREGROUND0;
        this.cageSumColor = DARKMODE_FOREGROUND0;
        this.selectionBorderColor = [50, 255, 255, 220];
        this.cursorBorderColor =    [250, 255, 50, 220];
    }

    //====================================================================

    setLightMode ()
    {
        this.boardBackgroundColor = LIGHTMODE_BACKGROUND0;
        this.digitColor = LIGHTMODE_FOREGROUND0;
        this.borderColor = LIGHTMODE_FOREGROUND0;
        this.cageBorderColor = LIGHTMODE_FOREGROUND0;
        this.cageSumColor = LIGHTMODE_FOREGROUND0;
        this.selectionBorderColor = [50, 50, 200, 220];
        this.cursorBorderColor =    [50, 255, 50, 220];
    }

    //====================================================================

    // draws the board to the canvas
    show ()
    {
        // draw each cell
        for (let i = 0; i < this.rows; ++i)
        {
            let y = this.y + i * this.cellHeight;
            for (let j = 0; j < this.cols; ++j)
            {
                let x = this.x + j * this.cellWidth;

                let cellCenterX = x + this.cellWidth / 2;
                let cellCenterY = y + this.cellHeight / 2;

                // draw cell
                stroke (this.borderColor);
                strokeWeight (this.cellBorderWidth);
                noFill ();
                rect (x, y, this.cellWidth, this.cellHeight);

                // add cell color - if exists
                let numColors = this.cellColors[i][j].reduce((partialSum, a) => partialSum + a, 0);
                if (numColors != 0)
                {
                    let colorStripeWidth = this.cellWidth / numColors;
                    let colorsUsedSoFar = 0;
                    for (let c = 0; c < 9; ++c)
                    {
                        // ensure this color is present in this cell
                        if (this.cellColors[i][j][c] == 1)
                        {
                            let cellColor = RGBA_COLORS[c+1];
                            let colorX = x + colorsUsedSoFar * colorStripeWidth;
                            noStroke ();
                            fill (cellColor);
                            rect (colorX, y, colorStripeWidth, this.cellHeight);
                            ++colorsUsedSoFar;
                        }
                    }
                }

                // Ensure digit does not conflict
                if (this.isCellConflicting (i, j))
                {
                    // Digit is invalid, highlight it 
                    stroke (0);
                    strokeWeight (this.cellBorderWidth);
                    fill (240, 70, 70, 255);
                    rect (x, y, this.cellWidth, this.cellHeight); 

                    stroke (200, 50, 50, 220);
                    strokeWeight (this.selectBorderWidth);
                    noFill ();
                    let selectPadding = this.selectBorderPadding;
                    // North line
                    line (x+selectPadding, y+selectPadding, x+this.cellWidth-selectPadding, y+selectPadding);
                    // East Line
                    line (x+this.cellWidth-selectPadding, y+selectPadding, x+this.cellWidth-selectPadding, y+this.cellHeight-selectPadding);
                    // South Line
                    line (x+selectPadding, y+this.cellHeight-selectPadding, x+this.cellWidth-selectPadding, y+this.cellHeight-selectPadding);
                    // West Line
                    line (x+selectPadding, y+selectPadding, x+selectPadding, y+this.cellHeight-selectPadding);
                }

                // draw filled digit, if filled in (non-zero)
                if (this.board[i][j] != 0)
                {
                    noStroke ();
                    fill (this.digitColor);
                    textFont (globalTextFont);
                    textAlign (CENTER, CENTER);
                    textSize (this.cellHeight-10);
                    text (this.board[i][j], cellCenterX, cellCenterY + 5);
                }
                // if digit is not filled in, draw any penciled-in digits
                else
                {
                    // top digits
                    let topDigitsStr = "";
                    for (let p = 0; p < this.numDigits; ++p)
                    {
                        if (this.topDigits[i][j][p])
                            topDigitsStr = topDigitsStr + (p+1);
                    }

                    // Ensure we have pencil marks
                    if (topDigitsStr.length > 0)
                    {
                        noStroke ();
                        fill (this.digitColor);
                        textFont (globalTextFont);
                        textAlign (CENTER, CENTER);
                        // iteratively decrease size until it fits
                        let strHeight = (this.cellHeight - 10) / 2;
                        textSize (--strHeight);
                        while (textWidth (topDigitsStr) >= this.cellWidth - 10)
                            textSize (--strHeight);
                        text (topDigitsStr, cellCenterX, y + ((this.cellHeight - 10) / 4));
                    }


                    // center pencil marks (small digits)
                    let pencilMarksStr = "";
                    for (let p = 0; p < this.numDigits; ++p)
                    {
                        if (this.centerDigits[i][j][p])
                            pencilMarksStr = pencilMarksStr + (p+1);
                    }

                    // Ensure we have pencil marks
                    if (pencilMarksStr.length > 0)
                    {
                        stroke (this.digitColor);
                        strokeWeight (1);
                        fill (this.digitColor);
                        textFont (globalTextFont);
                        textAlign (CENTER, CENTER);
                        // iteratively decrease size until it fits
                        let strHeight = (this.cellHeight - 10) / 2;
                        textSize (strHeight);
                        while (textWidth (pencilMarksStr) >= this.cellWidth - 10)
                            textSize (--strHeight);
                        text (pencilMarksStr, cellCenterX, cellCenterY + 5);
                    }
                }
            }
        }

        // draw box borders
        for (let i = 0; i < this.boxRows; ++i)
        {
            let y = this.y + i * this.boxWidth;
            for (let j = 0; j < this.boxCols; ++j)
            {
                let x = this.x + j * this.boxHeight;
                stroke (this.borderColor);
                strokeWeight (this.boxBorderWidth);
                noFill ();
                rect (x, y, this.boxWidth, this.boxHeight);
            }
        }

        this.drawCages ();

        // highlight selected tiles
        for (let i = 0; i < this.rows; ++i)
        {
            let y = this.y + i * this.cellHeight;
            for (let j = 0; j < this.cols; ++j)
            {
                let x = this.x + j * this.cellWidth;

                // draw selection if this cell is selected
                if (this.selectedCells[i][j])
                {
                    let isCursorPosition = i == cursorPosition[0] && j == cursorPosition[1];
                    // cursor position gets a different color
                    if (isCursorPosition)
                        stroke (this.cursorBorderColor);
                    // normal selected color - not cursor's position
                    else
                        stroke (this.selectionBorderColor);
                    strokeWeight (this.selectBorderWidth);
                    noFill ();
                    let selectPadding = this.selectBorderPadding;
                    // North line
                    if (i == 0 || !this.selectedCells[i-1][j] || isCursorPosition)
                        line (x+selectPadding, y+selectPadding, x+this.cellWidth-selectPadding, y+selectPadding);
                    // East Line
                    if (j == 8 || !this.selectedCells[i][j+1] || isCursorPosition)
                        line (x+this.cellWidth-selectPadding, y+selectPadding, x+this.cellWidth-selectPadding, y+this.cellHeight-selectPadding);
                    // South Line
                    if (i == 8 || !this.selectedCells[i+1][j] || isCursorPosition)
                        line (x+selectPadding, y+this.cellHeight-selectPadding, x+this.cellWidth-selectPadding, y+this.cellHeight-selectPadding);
                    // West Line
                    if (j == 0 || !this.selectedCells[i][j-1] || isCursorPosition)
                        line (x+selectPadding, y+selectPadding, x+selectPadding, y+this.cellHeight-selectPadding);
                    // rect (x+selectPadding, y+selectPadding, cellWidth-2*selectPadding, cellHeight-2*selectPadding);

                    // opacity over cell
                    noStroke ();
                    // cursor position gets a different color
                    if (isCursorPosition)
                        fill (150, 240, 150, 50);
                    // normal selected color - not cursor's position
                    else
                        fill (150, 150, 240, 50);
                    rect (x, y, this.cellWidth, this.cellHeight);
                }
            }
        }
    }

    //====================================================================

    // draws cages onto the board if there are any
    drawCages ()
    {
        for (let c = 0; c < this.cages.length; ++c)
        {
            let cageSum = this.cages[c][0];
            let cageCells = this.cages[c][1];
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
            fill (this.cageSumColor);
            noStroke ();
            textFont (this.cageTextFont);
            textSize (this.cageTextSize);
            let topPadding = 3;
            text (cageSum, this.x + leftj * this.cellWidth + (this.cellWidth / 3), this.y + topi * this.cellHeight + (this.cageTextSize / 2) + topPadding)
            // console.warn (cage[0]);

            // draw cage outline
            for (let i = 0 ; i < cageCells.length; ++i)
            {
                let celli = cageCells[i][0];
                let cellj = cageCells[i][1];
                let isTopLeftCell = false;
                if (celli == topi && cellj == leftj) isTopLeftCell = true;

                let y = this.y + celli * this.cellHeight;
                let x = this.x + cellj * this.cellWidth;
                stroke (this.cageBorderColor);
                strokeWeight (2);
                drawingContext.setLineDash([5]);
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
                        line (x+(this.cellWidth / 2)+cageBorderPadding, y+cageBorderPadding, x+this.cellWidth-cageBorderPadding, y+cageBorderPadding);
                    else
                        line (x+cageBorderPadding, y+cageBorderPadding, x+this.cellWidth-cageBorderPadding, y+cageBorderPadding);
                if (!hasEastCell)
                    line (x+this.cellWidth-cageBorderPadding, y+cageBorderPadding, x+this.cellWidth-cageBorderPadding, y+this.cellHeight-cageBorderPadding);
                if (!hasSouthCell)
                    line (x+cageBorderPadding, y+this.cellHeight-cageBorderPadding, x+this.cellWidth-cageBorderPadding, y+this.cellHeight-cageBorderPadding);
                if (!hasWestCell)
                    line (x+cageBorderPadding, y+cageBorderPadding, x+cageBorderPadding, y+this.cellHeight-cageBorderPadding);
                drawingContext.setLineDash([]);
            }
        }
    }

}

