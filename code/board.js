
const NORMAL_SUDOKU_DIMENSIONS = 9;
const HEXADECIMAL_SUDOKU_DIMENSIONS = 16;

const EMPTY_CELL = -1;
const NOT_A_GIVEN_DIGIT = 0;
const IS_A_GIVEN_DIGIT = 1;

const DOMINO_NONE = 0;
const DOMINO_KROPKI_WHITE = 1;
const DOMINO_KROPKI_BLACK = 2;
const DOMINO_SUM_V = 3;
const DOMINO_SUM_X = 4;
const DOMINO_LESS_THAN = 5;
const DOMINO_GREATER_THAN = 6;

// const DOMINO_NORTH = 0;
const DOMINO_EAST  = 0;
const DOMINO_SOUTH = 1;
// const DOMINO_WEST  = 3;
const DOMINO_NUM_DIRS = 2;

class SudokuBoard 
{
    constructor (base=9)
    {
        // Board credits
        this.name = "Untitled";
        this.author = "No Authors";
        this.URL = "";

        // Board structure
        // options are decimal (9) [1,9] or hexadecimal (16) [0,F]
        this.numDigits = base;
        this.rows = this.numDigits;
        this.cols = this.numDigits;
        this.numColors = 10;
        if (this.numDigits == 9)
        {
            this.boxRows = 3;
            this.boxCols = 3;
            this.low = 1;
            this.high = 10;
        }
        else if (this.numDigits == 16)
        {
            this.boxRows = 4;
            this.boxCols = 4;
            this.low = 0;
            this.high = 16;
        }

        // Board state/data
        // the board stores the filled-in, final digits for each cell
        this.board = [];
        // this represents given, unchangable digits (rows*cols)
        // this is just a boolean where 1 means a cell is given and 0 means it is not
        // we do this to keep the cell's final digits in the board
        this.givenDigits = [];
        // this stores which cells are currently selected
        this.selectedCells = [];
        // top pencil mark digits (rows*cols*num_digits)
        this.topDigits = [];
        // middle/center pencil mark digits (rows*cols*num_digits)
        this.centerDigits = [];
        // cell background colors (rows*cols*num_colors)
        this.cellColors = [];

        // [variant sudoku features]
        // this stores the killer cages
        // in the form of a list of cages
        // each cage stores a cage sum
        // and a list of cells that make up the cage
        this.cages = [];
        // Cages can be allowed/not-allowed to have repeated digits
        this.areCagedCellDigitsUnique = true;
        // dominoes
        // this stores the 9x9 board and 4 values per cell representing N E S W relationships
        this.dominoes = [];
        // full dominoes means that all dominoes are given
        // and that the absense of a domino means that those two cells do not follow the dominoe's rules
        // partial dominoes is the opposite where two cells could follow a dominoes rules but might not have a domino marked
        // this.isFullDomino = false;
        this.areAllKropkiWhiteGiven = false;
        this.areAllKropkiBlackGiven = false;
        this.areAllSumVGiven = false;
        this.areAllSumXGiven = false;
        this.areAllLessThanGiven = false;
        this.areAllGreaterThanGiven = false;

        // this is for reporting the rules
        // currently we only support puzzles that have normal sudoku rules
        this.isNormalSudokuRules = true;

        // initialize board state
        for (let i = 0; i < this.rows; ++i)
        {
            this.board        .push ([]);
            this.givenDigits  .push ([]);
            this.selectedCells.push ([]);
            this.topDigits    .push ([]);
            this.centerDigits .push ([]);
            this.cellColors   .push ([]);
            this.dominoes     .push ([]);
            for (let j = 0; j < this.cols; ++j)
            {
                this.board[i]        .push (EMPTY_CELL);
                this.givenDigits[i]  .push (0);
                this.selectedCells[i].push (0);
                this.topDigits[i]    .push ([]);
                this.centerDigits[i] .push ([]);
                this.cellColors[i]   .push ([]);
                this.dominoes[i]     .push ([]);
                // this starts at 0 because we include 0 even if this.low starts at 1
                for (let k = 0; k < this.high; ++k)
                {
                    this.topDigits[i][j]   .push (0);
                    this.centerDigits[i][j].push (0);
                }
                for (let k = 0; k < this.numColors; ++k)
                {
                    this.cellColors[i][j]  .push (0);
                }
                for (let d = 0; d < DOMINO_NUM_DIRS; ++d)
                    this.dominoes[i][j].push (DOMINO_NONE);
            }
        }

        // Board positioning/visual structure
        this.resizeBoard ();

        // Board coloring
        this.boardBackgroundColor = DARKMODE_BACKGROUND0;
        this.digitColor = "#009";
        this.givenDigitColor = DARKMODE_FOREGROUND0;
        this.digitOutline = DARKMODE_BACKGROUND0;
        this.borderColor = DARKMODE_FOREGROUND0;
        // let selectionColor = [50, 50, 200, 220];
        this.selectionBorderColor = [50, 255, 255, 220];
        this.cursorBorderColor =    [250, 255, 50, 220];

        this.cageBorderColor = DARKMODE_FOREGROUND0;
        this.cageSumColor = DARKMODE_FOREGROUND0;
        this.cageSumBackgroundColor = DARKMODE_BACKGROUND0;
        this.cageTextSize = 16;
        this.cageTextFont = "Arial";

        this.dominoBorderColor = DARKMODE_FOREGROUND0;
        this.dominoColor = DARKMODE_BACKGROUND0;
        this.dominoSize = 24;
    }

    //========================================================================
    
    resizeBoard ()
    {
        this.padding = 10;
        this.x = this.padding;
        this.y = this.padding;
        // we want the board to be square so just use whichever dimension is shorter
        let smallerDimension = min (width, height);
        this.width = smallerDimension - 2 * this.padding;
        this.height = smallerDimension - 2 * this.padding;
    
        this.boxWidth = this.width / this.boxCols;
        this.boxHeight = this.height / this.boxRows;
    
        let rowsPerBox = this.rows / this.boxRows;
        let colsPerBox = this.cols / this.boxCols;
        this.cellWidth = this.boxWidth / colsPerBox;
        this.cellHeight = this.boxHeight / rowsPerBox;

        this.cellBorderWidth = 1;
        this.boxBorderWidth = 3;
        this.selectBorderWidth = 6;
        this.selectBorderPadding = 3;
    }

    //========================================================================
    
    mousePositionToCell ()
    {
        for (let i = 0; i < this.rows; ++i)
        {
            let y = this.y + i * this.cellHeight;
            for (let j = 0; j < this.cols; ++j)
            {
                let x = this.x + j * this.cellWidth;
    
                // check if mouse is in this cell's bounds
                if (x < mouseX && mouseX < (x + this.cellWidth) &&
                    y < mouseY && mouseY < (y + this.cellHeight))
                {
                    return [i, j];
                }
            }
        }
        
        // Mouse is not over any cell
        return null;
    }

    //========================================================================
    
    // returns true if the current board state is solved
    // returns false if it is not solved or incomplete
    isBoardSolved ()
    {
        for (let i = 0; i < this.rows; ++i)
            for (let j = 0; j < this.cols; ++j)
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
        this.clearDominoes ();
    }
    
    //========================================================================
    
    clearCages ()
    {
        this.cages = [];
    }

    //========================================================================
    
    hasKillerCages ()
    {
        // if we have a cage, then we have the killer cages ruleset
        return this.cages.length != 0;
    }

    //========================================================================
    
    clearDominoes ()
    {
        this.dominoes = [];
        // initialize board state
        for (let i = 0; i < this.rows; ++i)
        {
            this.dominoes     .push ([]);
            for (let j = 0; j < this.cols; ++j)
            {
                //                           East         South      
                this.dominoes[i]     .push ([DOMINO_NONE, DOMINO_NONE]);
            }
        }
    }

    //========================================================================
    
    // returns true if there is a white kropki dot in the board
    // or if the negative white kropki dot constraint is set
    hasKropkiWhiteDominoes ()
    {
        // check if the negative constraint is set
        if (this.areAllKropkiWhiteGiven)
            return true;
        // search each cell/domino for kropki white
        for (let i = 0; i < this.rows; ++i)
        {
            for (let j = 0; j < this.cols; ++j)
            {
                // dominoes only keep track of east and south
                //                           East         South
                this.dominoes[i]     .push ([DOMINO_NONE, DOMINO_NONE]);
                if (this.dominoes[i][j][DOMINO_EAST] == DOMINO_KROPKI_WHITE || this.dominoes[i][j][DOMINO_SOUTH] == DOMINO_KROPKI_WHITE)
                {
                    // found a white kropki dot, so yes, the board has kropki white
                    return true;
                }
            }
        }
        // reaches here if no kropki white dots and no negative kropki white constraint
        return false;
    }

    //========================================================================
    
    // returns true if there is a black kropki dot in the board
    // or if the negative black kropki dot constraint is set
    hasKropkiBlackDominoes ()
    {
        // check if the negative constraint is set
        if (this.areAllKropkiBlackeGiven)
            return true;
        // search each cell/domino for kropki black
        for (let i = 0; i < this.rows; ++i)
        {
            for (let j = 0; j < this.cols; ++j)
            {
                // dominoes only keep track of east and south
                //                           East         South
                this.dominoes[i]     .push ([DOMINO_NONE, DOMINO_NONE]);
                if (this.dominoes[i][j][DOMINO_EAST] == DOMINO_KROPKI_BLACK || this.dominoes[i][j][DOMINO_SOUTH] == DOMINO_KROPKI_BLACK)
                {
                    // found a black kropki dot, so yes, the board has kropki black
                    return true;
                }
            }
        }
        // reaches here if no kropki black dots and no negative kropki black constraint
        return false;
    }

    //========================================================================
    
    // returns true if there is a sum V domino in the board
    // or if the negative sum V constraint is set
    hasSumVDominoes ()
    {
        // check if the negative constraint is set
        if (this.areAllSumVGiven)
            return true;
        // search each cell/domino for sum V
        for (let i = 0; i < this.rows; ++i)
        {
            for (let j = 0; j < this.cols; ++j)
            {
                // dominoes only keep track of east and south
                //                           East         South
                this.dominoes[i]     .push ([DOMINO_NONE, DOMINO_NONE]);
                if (this.dominoes[i][j][DOMINO_EAST] == DOMINO_SUM_V || this.dominoes[i][j][DOMINO_SOUTH] == DOMINO_SUM_V)
                {
                    // found a sum V domino, so yes, the board has sum V dominoes
                    return true;
                }
            }
        }
        // reaches here if no sum V dominoes and no negative sum V constraint
        return false;
    }

    //========================================================================
    
    // returns true if there is a sum X domino in the board
    // or if the negative sum X constraint is set
    hasSumXDominoes ()
    {
        // check if the negative constraint is set
        if (this.areAllSumXGiven)
            return true;
        // search each cell/domino for sum X
        for (let i = 0; i < this.rows; ++i)
        {
            for (let j = 0; j < this.cols; ++j)
            {
                // dominoes only keep track of east and south
                //                           East         South
                this.dominoes[i]     .push ([DOMINO_NONE, DOMINO_NONE]);
                if (this.dominoes[i][j][DOMINO_EAST] == DOMINO_SUM_X || this.dominoes[i][j][DOMINO_SOUTH] == DOMINO_SUM_X)
                {
                    // found a sum X domino, so yes, the board has sum X dominoes
                    return true;
                }
            }
        }
        // reaches here if no sum X dominoes and no negative sum X constraint
        return false;
    }

    //========================================================================
    
    // returns true if there is a less than domino in the board
    // or if the negative less than constraint is set
    hasLessThanDominoes ()
    {
        // check if the negative constraint is set
        if (this.areAllLessThanGiven)
            return true;
        // search each cell/domino for less than
        for (let i = 0; i < this.rows; ++i)
        {
            for (let j = 0; j < this.cols; ++j)
            {
                // dominoes only keep track of east and south
                //                           East         South
                this.dominoes[i]     .push ([DOMINO_NONE, DOMINO_NONE]);
                if (this.dominoes[i][j][DOMINO_EAST] == DOMINO_LESS_THAN || this.dominoes[i][j][DOMINO_SOUTH] == DOMINO_LESS_THAN)
                {
                    // found a less than domino, so yes, the board has less than dominoes
                    return true;
                }
            }
        }
        // reaches here if no less than dominoes and no negative less than constraint
        return false;
    }

    //========================================================================
    
    // returns true if there is a greater than domino in the board
    // or if the negative greater than constraint is set
    hasGreaterThanDominoes ()
    {
        // check if the negative constraint is set
        if (this.areAllGreaterThanGiven)
            return true;
        // search each cell/domino for greater than
        for (let i = 0; i < this.rows; ++i)
        {
            for (let j = 0; j < this.cols; ++j)
            {
                // dominoes only keep track of east and south
                //                           East         South
                this.dominoes[i]     .push ([DOMINO_NONE, DOMINO_NONE]);
                if (this.dominoes[i][j][DOMINO_EAST] == DOMINO_GREATER_THAN || this.dominoes[i][j][DOMINO_SOUTH] == DOMINO_GREATER_THAN)
                {
                    // found a greater than domino, so yes, the board has greater than dominoes
                    return true;
                }
            }
        }
        // reaches here if no greater than dominoes and no negative greater than constraint
        return false;
    }

    //========================================================================
    
    isAllCellsSelected ()
    {
        for (let i = 0; i < this.rows; ++i)
        {
            for (let j = 0; j < this.cols; ++j)
            {
                if (this.selectedCells[i][j] == 0)
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
                this.board[i][j] = EMPTY_CELL;
    }
    
    //========================================================================
    
    clearTopDigits ()
    {
        for (let i = 0; i < this.rows; ++i)
            for (let j = 0; j < this.cols; ++j)
                for (let k = this.low; k < this.high; ++k)
                    this.topDigits[i][j][k] = 0;
    }
    
    //========================================================================
    
    clearCenterDigits ()
    {
        for (let i = 0; i < this.rows; ++i)
            for (let j = 0; j < this.cols; ++j)
                for (let k = this.low; k < this.high; ++k)
                    this.centerDigits[i][j][k] = 0;
    }
    
    //========================================================================
    
    clearColors ()
    {
        for (let i = 0; i < this.rows; ++i)
            for (let j = 0; j < this.cols; ++j)
                for (let k = this.low; k < this.high; ++k)
                    this.cellColors[i][j][k] = 0;
    }
    
    //========================================================================
    
    getCenterDigits (i, j)
    {
        let penciledDigits = [];
        for (let p = this.low; p < this.high; ++p)
            if (this.centerDigits[i][j][p] == 1)
                penciledDigits.push (p);
        return penciledDigits;
    }
    
    //========================================================================
    
    getTopDigits (i, j)
    {
        let topDigits_ = [];
        for (let p = this.low; p < this.high; ++p)
            if (this.topDigits[i][j][p] == 1)
                topDigits_.push (p);
        return topDigits_;
    }

    //====================================================================

    // return true if there is a conflict with this cell
    // by having the same digit in either the same row, col, or box.
    // returns false if there is no conflict
    isCellConflicting (i, j)
    {
        // cell isnt conflicting if it's not filled in
        if (this.board[i][j] == EMPTY_CELL)
            return false;

        // check row
        for (let jj = 0; jj < this.cols; ++jj)
        {
            if (jj != j && this.board[i][jj] == this.board[i][j] && this.board[i][jj] != EMPTY_CELL)
                return true;
        }
        // check col
        for (let ii = 0; ii < this.rows; ++ii)
        {
            if (ii != i && this.board[ii][j] == this.board[i][j] && this.board[ii][j] != EMPTY_CELL)
                return true;
        }
        // check box
        let boxI = Math.floor (i / this.boxRows);
        let boxJ = Math.floor (j / this.boxCols);
        for (let bi = boxI * this.boxRows; bi < (boxI+1)*this.boxRows; ++bi)
        {
            for (let bj = boxJ * this.boxCols; bj < (boxJ+1)*this.boxCols; ++bj)
            {
                // ensure we are not looking at the same position
                if (!(bi == i && bj == j) && this.board[bi][bj] == this.board[i][j] && this.board[bi][bj] != EMPTY_CELL)
                    return true;
            }
        }

        // [additional constraints]
        // check that this digit does not break any containing cages
        for (let c = 0; c < this.cages.length; ++c)
        {
            let cage = this.cages[c];
            let expectedCageSum = cage[0];
            // ensure the given cell i,j is in this cage
            let containsGivenCell = false;
            for (let celli = 0; celli < cage[1].length; ++celli)
            {
                if (i == cage[1][celli][0] && j == cage[1][celli][1])
                    containsGivenCell = true;
            }
            if (!containsGivenCell) continue;

            let cageSize = cage[1].length;
            let numFilledInCells = 0;
            let currentCageSum = 0;
            // foreach cell in this cage
            for (let cc = 0; cc < cageSize; ++cc)
            {
                let [celli, cellj] = cage[1][cc];
                // don't need to ignore given cell at i,j
                // check if cell is filled in
                if (this.board[celli][cellj] != EMPTY_CELL)
                {
                    // it's filled in so count this cell
                    ++numFilledInCells;
                    // Also update the current running sum of the cage
                    currentCageSum += this.board[celli][cellj];
                }
            }
            // Case 0 : given cell is bad if it results in a larger current sum than the given cage sum
            // this ignores whether we have all digits filled in or not
            // because obviously if 3/5 cells of the cage sum up to a number that is larger than expected,
            // then it doesn't matter what the unfilled-in cells are since they cant be negative
            if (currentCageSum > expectedCageSum)
            {
                return true;
            }
            // Case 1 : if all digits are filled in, current sum must equal given cage sum
            let isFilled = numFilledInCells == cageSize;
            if (isFilled && currentCageSum != expectedCageSum)
            {
                return true;
            }
        }

        // dominoes
        let digit = this.board[i][j];
        this.board[i][j] = EMPTY_CELL;
        let result = this.isDigitValid (i, j, digit);
        this.board[i][j] = digit;

        if (!result)
            return true;

        // reaches here if we did not find a conflict
        return false;
    }

    //====================================================================

    isDigitValid (i, j, digit)
    {
        // check row
        for (let jj = 0; jj < this.cols; ++jj)
        {
            if (jj != j && this.board[i][jj] == digit && this.board[i][jj] != EMPTY_CELL)
                return false;
        }
        // check col
        for (let ii = 0; ii < this.rows; ++ii)
        {
            if (ii != i && this.board[ii][j] == digit && this.board[ii][j] != EMPTY_CELL)
                return false;
        }
        // check box
        let boxI = Math.floor (i / this.boxRows);
        let boxJ = Math.floor (j / this.boxCols);
        for (let bi = boxI * this.boxRows; bi < (boxI+1)*this.boxRows; ++bi)
        {
            for (let bj = boxJ * this.boxCols; bj < (boxJ+1)*this.boxCols; ++bj)
            {
                // ensure we are not looking at the same position
                if (!(bi == i && bj == j) && this.board[bi][bj] == digit && this.board[bi][bj] != EMPTY_CELL)
                    return false;
            }
        }

        // [variant sudoku constraints]
        // === Killer Cages
        // check that this digit does not break any containing cages
        for (let c = 0; c < this.cages.length; ++c)
        {
            let cage = this.cages[c];
            let expectedCageSum = cage[0];
            // ensure the given cell is in this cage
            let containsGivenCell = false;
            for (let celli = 0; celli < cage[1].length; ++celli)
            {
                if (i == cage[1][celli][0] && j == cage[1][celli][1])
                    containsGivenCell = true;
            }
            if (!containsGivenCell) continue;

            let cageSize = cage[1].length;
            let numFilledInCells = 0;
            let currentCageSum = 0;
            // foreach cell in this cage
            for (let cc = 0; cc < cageSize; ++cc)
            {
                let [celli, cellj] = cage[1][cc];
                // ignore if it is the given cell (this is a safety incase given cell is already filled in)
                if (i == celli && j == cellj) continue;
                // check if cell is filled in
                if (this.board[celli][cellj] != EMPTY_CELL)
                {
                    // it's filled in so count this cell
                    ++numFilledInCells;
                    // Also update the current running sum of the cage
                    currentCageSum += this.board[celli][cellj];
                }
            }
            // Case 0 : given digit is bad if it results in a larger current sum than the given cage sum
            currentCageSum += digit;
            if (currentCageSum > expectedCageSum)
            {
                return false;
            }
            // Case 1 : if all digits are filled in, current sum must equal given cage sum
            // +1 to count this current digit
            let isFilled = (numFilledInCells + 1) == cageSize;
            if (isFilled && currentCageSum != expectedCageSum)
            {
                return false;
            }
        }

        // === Dominoes
        // check the dominoes in each direction from the given cell
        for (let d = 0; d < 4; ++d)
        {
            let otheri = i;
            let otherj = j;
            let domino_type = DOMINO_NONE;
            let isNorthWest = false;
            
            // North
            if (d == 0)
            {
                otheri = i-1;
                otherj = j;
                // ignore if no cell to the north
                if (otheri < 0)
                    continue;
                // check North's south - we do not save north dominoes
                domino_type = this.dominoes[otheri][otherj][DOMINO_SOUTH];
                isNorthWest = true;
            }

            // East
            else if (d == 1)
            {
                otheri = i;
                otherj = j+1;
                // ignore if no cell to the east
                if (otherj >= this.cols)
                    continue;
                domino_type = this.dominoes[i][j][DOMINO_EAST];
                isNorthWest =  false;
            }

            // South
            else if (d == 2)
            {
                otheri = i+1;
                otherj = j;
                // ignore if no cell to the south
                if (otheri >= this.rows)
                    continue;
                domino_type = this.dominoes[i][j][DOMINO_SOUTH];
                isNorthWest =  false;
            }

            // West
            else if (d == 3)
            {
                otheri = i;
                otherj = j-1;
                // ignore if no cell to the west
                if (otherj < 0)
                    continue;
                // check West's east - we do not save West dominoes
                domino_type = this.dominoes[otheri][otherj][DOMINO_EAST];
                isNorthWest = true;
            }

            // validate based on the domino's type
            if (domino_type == DOMINO_KROPKI_WHITE)
            {
                // Kropki White means that the pair should be consecutive

                // ensure both digits are filled in
                let otherDigit = this.board[otheri][otherj];
                let isOtherFilledIn = otherDigit != EMPTY_CELL;
                if (isOtherFilledIn)
                {
                    // ensure this digit is consecutive
                    if (!(otherDigit-1 == digit || otherDigit+1 == digit))
                        // not consecutive
                        return false;
                }

            }
            else if (domino_type == DOMINO_KROPKI_BLACK)
            {
                // Kropki black means that the pair should have a 1:2 relationship (aka double)

                // without having the other digit, we already can eliminate 5, 7, and 9
                // **this is only true for board size of 9
                if (this.numDigits == 9)
                {
                    // reject 5, 7, and 9
                    if (digit == 5 || digit == 7 || digit == 9)
                        return false;
                }

                // ensure both digits are filled in
                let otherDigit = this.board[otheri][otherj];
                let isOtherFilledIn = otherDigit != EMPTY_CELL;
                if (isOtherFilledIn)
                {
                    // ensure this digit is 1:2
                    if (!(otherDigit*2 == digit || otherDigit == digit*2))
                        // not 1:2
                        return false;
                }
                
            }
            else if (domino_type == DOMINO_SUM_V)
            {
                // Sum V means that the pair must sum to 5

                // without having the other digit, we already can eliminate anything 5 or higher
                // because they will already be higher than 5
                // ** 5 is acceptable for hexadecimal because 0 is valid
                if (this.numDigits == 9)
                {
                    // reject 5 or higher
                    if (digit >= 5)
                        return false;
                }
                else if (this.numDigits == 16)
                {
                    // reject higher than 5
                    if (digit > 5)
                        return false;
                }

                // ensure both digits are filled in
                let otherDigit = this.board[otheri][otherj];
                let isOtherFilledIn = otherDigit != EMPTY_CELL;
                if (isOtherFilledIn)
                {
                    // ensure they sum to 5
                    if (!(otherDigit + digit == 5))
                        // not sum = 5
                        return false;
                }

            }
            else if (domino_type == DOMINO_SUM_X)
            {
                // Sum X means that the pair must sum to 10

                // without having the other digit, we already can eliminate anything 11 or higher
                // because they will already be higher than 10
                // **this is only for hexadecimal since 10+ isnt valid in 9sudoku
                if (this.numDigits == 16)
                {
                    // reject higher than 10
                    if (digit > 10)
                        return false;
                }

                // ensure both digits are filled in
                let otherDigit = this.board[otheri][otherj];
                let isOtherFilledIn = otherDigit != EMPTY_CELL;
                if (isOtherFilledIn)
                {
                    // ensure they sum to 10
                    if (!(otherDigit + digit == 10))
                        // not sum = 10
                        return false;
                }

            }
            else if (domino_type == DOMINO_LESS_THAN)
            {
                // Less than means that this cell must be less than the other cell
                // Note: that this reads left to right and top down so lhs < rhs even if rhs is the given cell

                // ensure both digits are filled in
                let otherDigit = this.board[otheri][otherj];
                let isOtherFilledIn = otherDigit != EMPTY_CELL;
                if (isOtherFilledIn)
                {
                    if (isNorthWest)
                    {
                        // ensure lhs < rhs
                        if (!(otherDigit < digit))
                            return false;
                    }
                    else
                    {
                        // ensure lhs < rhs
                        if (!(digit < otherDigit))
                            return false;
                    }
                }

            }
            else if (domino_type == DOMINO_GREATER_THAN)
            {
                // Greater than means that this cell must be greater than the other cell
                // Note: that this reads left to right and top down so lhs > rhs even if rhs is the given cell

                // ensure both digits are filled in
                let otherDigit = this.board[otheri][otherj];
                let isOtherFilledIn = otherDigit != EMPTY_CELL;
                if (isOtherFilledIn)
                {
                    if (isNorthWest)
                    {
                        // ensure lhs > rhs
                        if (!(otherDigit > digit))
                            return false;
                    }
                    else
                    {
                        // ensure lhs > rhs
                        if (!(digit > otherDigit))
                            return false;
                    }
                }
                
            }

            // Negative domino constraints
            // Kropki white
            // kropki black can be consecutive too
            if (this.areAllKropkiWhiteGiven && domino_type != DOMINO_KROPKI_WHITE && domino_type != DOMINO_KROPKI_BLACK)
            {
                // ensure both digits are filled in
                let otherDigit = this.board[otheri][otherj];
                let isOtherFilledIn = otherDigit != EMPTY_CELL;
                if (isOtherFilledIn)
                {
                    // since we know all kropki white dots are given,
                    // then dominoes without a white dot should NOT be consecutive
                    // lets ensure these dominoes are NOT consecutive
                    if (otherDigit-1 == digit || otherDigit+1 == digit)
                        // consecutive
                        return false;
                }
            }
            // Kropki black
            // kropki white can be 1:2 too
            if (this.areAllKropkiBlackGiven && domino_type != DOMINO_KROPKI_WHITE && domino_type != DOMINO_KROPKI_BLACK)
            {
                // ensure both digits are filled in
                let otherDigit = this.board[otheri][otherj];
                let isOtherFilledIn = otherDigit != EMPTY_CELL;
                if (isOtherFilledIn)
                {
                    // since we know all kropki black dots are given,
                    // then dominoes without a black dot should NOT be 1:2
                    // lets ensure these dominoes are NOT 1:2
                    if (otherDigit*2 == digit || otherDigit == digit*2)
                        // consecutive
                        return false;
                }
            }
            // Sum V
            if (this.areAllSumVGiven && domino_type != DOMINO_SUM_V)
            {
                // ensure both digits are filled in
                let otherDigit = this.board[otheri][otherj];
                let isOtherFilledIn = otherDigit != EMPTY_CELL;
                if (isOtherFilledIn)
                {
                    // since we know all Vs are given,
                    // then dominoes without a V should NOT sum to 5
                    // lets ensure these dominoes dont sum to 5
                    if (otherDigit + digit == 5)
                        // sums to 5
                        return false;
                }
            }
            // Sum X
            if (this.areAllSumXGiven && domino_type != DOMINO_SUM_X)
            {
                // ensure both digits are filled in
                let otherDigit = this.board[otheri][otherj];
                let isOtherFilledIn = otherDigit != EMPTY_CELL;
                if (isOtherFilledIn)
                {
                    // since we know all Xs are given,
                    // then dominoes without a X should NOT sum to 10
                    // lets ensure these dominoes dont sum to 10
                    if (otherDigit + digit == 10)
                        // sums to 10
                        return false;
                }
            }
            // ** ignoring less than and greater than for now


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
        let dfsBoard = [];
        let firsti = -1;
        let firstj = -1;

        // loop over ever cell and find first selected cell
        // also initialize dfs board
        for (let i = 0; i < this.rows; ++i)
        {
            // initialize this row
            dfsBoard.push ([]);
            for (let j = 0; j < this.cols; ++j)
            {
                // initialize this col
                dfsBoard[i].push (0);
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
        for (let i = 0; i < this.rows; ++i)
        {
            for (let j = 0; j < this.cols; ++j)
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
        for (let i = 0; i < this.rows; ++i)
        {
            for (let j = 0; j < this.cols; ++j)
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
        // **** fix this - shouldnt be in board code
        let sum = parseInt (prompt ("Enter the desired cage sum"));

        // ensure valid sum provided
        if (isNaN (sum))
            return;

        // create cage
        console.log (`Making cage with sum ${sum}`);
        let cells = [];
        for (let i = 0; i < this.rows; ++i)
        {
            for (let j = 0; j < this.cols; ++j)
            {
                if (this.selectedCells[i][j])
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

    // turns the selected pair of cells into a domino
    // if selected cells are not orthogonally connected, then a domino cannot be made
    // if number of selected cells are not 2, then we have too many or two little for a domino
    markDominoWithSelectedCells (domino_type=DOMINO_NONE)
    {
        let num_selected = 0;
        let i0 = -1;
        let j0 = -1;
        let i1 = -1;
        let j1 = -1;
        for (let i = 0; i < this.rows; ++i)
        {
            for (let j = 0; j < this.cols; ++j)
            {
                if (this.selectedCells[i][j] == 1)
                {
                    ++num_selected;
                    if (num_selected == 1)
                    {
                        i0 = i;
                        j0 = j;
                    }
                    else if (num_selected == 2)
                    {
                        i1 = i;
                        j1 = j;
                    }
                }
            }
        }

        // ensure only 2 cells were selected
        if (num_selected != 2)
        {
            console.log ("Domino Error: expected 2 selected cells, but got", num_selected);
            return;
        }

        // ensure cells are adjacent
        // cell1 North of cell0
        if (i0 - 1 == i1 && j0 == j1)
        {
            console.log ("North");
        }
        // cell1 East of cell0
        else if (i0 == i1 && j0 + 1 == j1)
        {
            console.log ("East");
        }
        // cell1 South of cell0
        else if (i0 + 1 == i1 && j0 == j1)
        {
            console.log ("South");
        }
        // cell1 West of cell0
        else if (i0 == i1 && j0 - 1 == j1)
        {
            console.log ("West");
        }
        // not adjacent
        else
        {
            console.log ("Domino Error: Selected cells are not adjacent");
            return;
        }

        // add the domino relationship between the two cells
        // cell1 North of cell0
        if (i0 - 1 == i1 && j0 == j1)
        {
            // cell0's North
            // this.dominoes[i0][j0][DOMINO_NORTH] = domino_type;
            // cell1's South
            this.dominoes[i1][j1][DOMINO_SOUTH] = domino_type;
        }
        // cell1 East of cell0
        else if (i0 == i1 && j0 + 1 == j1)
        {
            // cell0's East
            this.dominoes[i0][j0][DOMINO_EAST] = domino_type;
            // cell1's West
            // this.dominoes[i1][j1][DOMINO_WEST] = domino_type;
        }
        // cell1 South of cell0
        else if (i0 + 1 == i1 && j0 == j1)
        {
            // cell0's South
            this.dominoes[i0][j0][DOMINO_SOUTH] = domino_type;
            // cell1's North
            // this.dominoes[i1][j1][DOMINO_NORTH] = domino_type;
        }
        // cell1 West of cell0
        else if (i0 == i1 && j0 - 1 == j1)
        {
            // cell0's West
            // this.dominoes[i0][j0][DOMINO_WEST] = domino_type;
            // cell1's East
            this.dominoes[i1][j1][DOMINO_EAST] = domino_type;
        }
        
    }

    //========================================================================
    
    // Applies a given digit to each of the currently selected cells
    // and in the current mode. If all selected cells already contain this
    // digit, then the digit is instead removed from all of the selected cells
    inputDigit (digit)
    {
        // ensure valid range
        if (playMode != PLAY_MODE_COLOR && digit != EMPTY_CELL && (digit < this.low || digit >= this.high))
        {
            console.log ("Invalid digit", digit);
            return;
        }

        // ensure valid color
        let isColorValid = 0 <= digit && digit < this.numColors;
        if (editMode == MODE_PLAY && playMode == PLAY_MODE_COLOR && !isColorValid && digit != EMPTY_CELL)
        {
            console.log ("Invalid color", digit);
            return;
        }

        // 1. given digit is -1 - should clear all info from selected
        //   for the given mode
        if (digit == EMPTY_CELL)
        {    
            for (let i = 0; i < this.rows; ++i)
            {
                for (let j = 0; j < this.cols; ++j)
                {
                    // delete if cell is selected
                    if (this.selectedCells[i][j])
                    {
                        if (editMode == MODE_PLAY && playMode == PLAY_MODE_DIGIT)
                        {
                            // ensure cell is not a given digit
                            // given digits cannot be changed
                            if (this.givenDigits[i][j] == NOT_A_GIVEN_DIGIT)
                            {
                                this.board[i][j] = EMPTY_CELL;
                            }
                        }
                        else if (editMode == MODE_BOARD_MAKER && boardMakerMode == BOARD_MAKER_MODE_DIGIT)
                        {
                            this.board[i][j] = EMPTY_CELL;
                            this.givenDigits[i][j] = NOT_A_GIVEN_DIGIT;
                        }
                        else if (editMode == MODE_PLAY && playMode == PLAY_MODE_TOP && this.board[i][j] == EMPTY_CELL)
                        {
                            for (let k = this.low; k < this.high; ++k)
                            {
                                this.topDigits[i][j][k] = 0;
                            }
                        }
                        else if (editMode == MODE_PLAY && playMode == PLAY_MODE_SMALL && this.board[i][j] == EMPTY_CELL)
                        {
                            for (let k = this.low; k < this.high; ++k)
                            {
                                this.centerDigits[i][j][k] = 0;
                            }
                        }
                        else if (editMode == MODE_PLAY && playMode == PLAY_MODE_COLOR)
                        {
                            for (let k = 0; k < this.numColors; ++k)
                            {
                                this.cellColors[i][j][k] = 0;
                            }
                        }
                    }
                }
            }
        }
    
        let wasChanged = false;
        for (let i = 0; i < this.rows; ++i)
        {
            for (let j = 0; j < this.cols; ++j)
            {
                // check if cell is selected
                if (this.selectedCells[i][j])
                {
                    if (editMode == MODE_PLAY && playMode == PLAY_MODE_DIGIT && this.board[i][j] != digit)
                    {
                        // ensure cell is not a given digit
                        // given digits cannot be changed
                        if (this.givenDigits[i][j] == NOT_A_GIVEN_DIGIT)
                        {
                            this.board[i][j] = digit;
                            wasChanged = true;
                        }
                    }
                    else if (editMode == MODE_BOARD_MAKER && boardMakerMode == BOARD_MAKER_MODE_DIGIT && (this.board[i][j] != digit || this.givenDigits[i][j] != IS_A_GIVEN_DIGIT))
                    {
                        this.board[i][j] = digit;
                        this.givenDigits[i][j] = IS_A_GIVEN_DIGIT;
                        wasChanged = true;
                    }
                    else if (editMode == MODE_PLAY && playMode == PLAY_MODE_TOP && this.board[i][j] == EMPTY_CELL && this.topDigits[i][j][digit] == 0)
                    {
                        this.topDigits[i][j][digit] = 1;
                        wasChanged = true;
                    }
                    else if (editMode == MODE_PLAY && playMode == PLAY_MODE_SMALL && this.board[i][j] == EMPTY_CELL && this.centerDigits[i][j][digit] == 0)
                    {
                        this.centerDigits[i][j][digit] = 1;
                        wasChanged = true;
                    }
                    else if (editMode == MODE_PLAY && playMode == PLAY_MODE_COLOR && this.cellColors[i][j][digit] == 0)
                    {
                        this.cellColors[i][j][digit] = 1;
                        wasChanged = true;
                    }
                }
            }
        }
        
        // delete key if it was already set
        if (!wasChanged)
        {
            for (let i = 0; i < this.rows; ++i)
            {
                for (let j = 0; j < this.cols; ++j)
                {
                    if (this.selectedCells[i][j])
                    {
                        if (editMode == MODE_PLAY && playMode == PLAY_MODE_DIGIT)
                        {
                            // ensure cell is not a given digit
                            // given digits cannot be changed
                            if (this.givenDigits[i][j] == NOT_A_GIVEN_DIGIT)
                            {
                                this.board[i][j] = EMPTY_CELL;
                            }
                        }
                        else if (editMode == MODE_BOARD_MAKER && boardMakerMode == BOARD_MAKER_MODE_DIGIT)
                        {
                            this.board[i][j] = EMPTY_CELL;
                            this.givenDigits[i][j] = NOT_A_GIVEN_DIGIT;
                        }
                        else if (editMode == MODE_PLAY && playMode == PLAY_MODE_TOP && this.board[i][j] == EMPTY_CELL)
                        {
                            this.topDigits[i][j][digit] = 0;
                        }
                        else if (editMode == MODE_PLAY && playMode == PLAY_MODE_SMALL && this.board[i][j] == EMPTY_CELL)
                        {
                            this.centerDigits[i][j][digit] = 0;
                        }
                        else if (editMode == MODE_PLAY && playMode == PLAY_MODE_COLOR)
                        {
                            this.cellColors[i][j][digit] = 0;
                            wasChanged = true;
                        }
                    }
                }
            }
        }
    
    }    

    //====================================================================

    setDarkMode ()
    {
        this.boardBackgroundColor = DARKMODE_BACKGROUND0;
        this.digitColor = "#7777ff";
        this.givenDigitColor = DARKMODE_FOREGROUND0;
        this.digitOutline = DARKMODE_BACKGROUND0;
        this.borderColor = DARKMODE_FOREGROUND0;
        this.selectionBorderColor = [50, 255, 255, 220];
        this.cursorBorderColor =    [250, 255, 50, 220];

        this.cageBorderColor = DARKMODE_FOREGROUND0;
        this.cageSumColor = DARKMODE_FOREGROUND0;
        this.cageSumBackgroundColor = DARKMODE_BACKGROUND0;
        this.dominoBorderColor = DARKMODE_BACKGROUND0;
        this.dominoColor = DARKMODE_FOREGROUND0;
    }

    //====================================================================

    setLightMode ()
    {
        this.boardBackgroundColor = LIGHTMODE_BACKGROUND0;
        this.digitColor = "#0000ee";
        this.givenDigitColor = LIGHTMODE_FOREGROUND0;
        this.digitOutline = LIGHTMODE_BACKGROUND0;
        this.borderColor = LIGHTMODE_FOREGROUND0;
        this.selectionBorderColor = [50, 50, 200, 220];
        this.cursorBorderColor =    [50, 255, 50, 220];

        this.cageBorderColor = LIGHTMODE_FOREGROUND0;
        this.cageSumColor = LIGHTMODE_FOREGROUND0;
        this.cageSumBackgroundColor = LIGHTMODE_BACKGROUND0;
        this.dominoBorderColor = LIGHTMODE_BACKGROUND0;
        this.dominoColor = LIGHTMODE_FOREGROUND0;
    }

    //====================================================================

    // draws the board to the canvas
    show ()
    {
        textStyle (NORMAL);

        let digitMapping = "0123456789abcdef";
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

                // add cell color/highlight - if exists
                let numColors = this.cellColors[i][j].reduce((partialSum, a) => partialSum + a, 0);
                if (numColors != 0)
                {
                    let colorStripeWidth = this.cellWidth / numColors;
                    let colorsUsedSoFar = 0;
                    // this starts at 0 instead of this.low because white is 0
                    for (let c = 0; c < this.numColors; ++c)
                    {
                        // ensure this color is present in this cell
                        if (this.cellColors[i][j][c] == 1)
                        {
                            let cellColor = RGBA_COLORS[c];
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

                // draw filled-in digit, if filled-in
                if (this.board[i][j] != EMPTY_CELL)
                {
                    stroke (this.digitOutline);
                    strokeWeight(2);
                    // determine if digit is given or filled-in
                    if (this.givenDigits[i][j] == IS_A_GIVEN_DIGIT)
                        fill (this.givenDigitColor);
                    else
                        fill (this.digitColor);
                    textFont (globalTextFont);
                    textAlign (CENTER, CENTER);
                    textSize (this.cellHeight-10);
                    text (digitMapping[this.board[i][j]], cellCenterX, cellCenterY + 3);
                }
                // if digit is not filled in, draw any penciled-in digits
                else
                {
                    // top digits
                    let topDigitsStr = "";
                    for (let p = this.low; p < this.high; ++p)
                    {
                        if (this.topDigits[i][j][p])
                            topDigitsStr = topDigitsStr + digitMapping[p];
                    }

                    // Ensure we have top digit pencil marks
                    if (topDigitsStr.length > 0)
                    {
                        stroke (this.digitOutline);
                        strokeWeight (1);
                        fill (this.givenDigitColor);
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
                    for (let p = this.low; p < this.high; ++p)
                    {
                        if (this.centerDigits[i][j][p])
                            pencilMarksStr = pencilMarksStr + digitMapping[p];
                    }

                    // Ensure we have center digit pencil marks
                    if (pencilMarksStr.length > 0)
                    {
                        stroke (this.digitOutline);
                        strokeWeight (1);
                        fill (this.givenDigitColor);
                        textFont (globalTextFont);
                        textAlign (CENTER, CENTER);
                        // iteratively decrease size until it fits
                        let strHeight = (this.cellHeight - 10) / 2;
                        textSize (strHeight);
                        while (textWidth (pencilMarksStr) >= this.cellWidth - 10)
                            textSize (--strHeight);
                        text (pencilMarksStr, cellCenterX, cellCenterY);
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
        this.drawDominoes ();

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
                    if (j == this.cols-1 || !this.selectedCells[i][j+1] || isCursorPosition)
                        line (x+this.cellWidth-selectPadding, y+selectPadding, x+this.cellWidth-selectPadding, y+this.cellHeight-selectPadding);
                    // South Line
                    if (i == this.rows-1 || !this.selectedCells[i+1][j] || isCursorPosition)
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
                strokeWeight (1.5);
                drawingContext.setLineDash([5]);
                let cageBorderPadding = 4;

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
                    // if (isTopLeftCell)
                    //     line (x+(this.cellWidth / 2)+cageBorderPadding, y+cageBorderPadding, x+this.cellWidth-cageBorderPadding, y+cageBorderPadding);
                    // else
                        line (x+cageBorderPadding, y+cageBorderPadding, x+this.cellWidth-cageBorderPadding, y+cageBorderPadding);
                if (!hasEastCell)
                    line (x+this.cellWidth-cageBorderPadding, y+cageBorderPadding, x+this.cellWidth-cageBorderPadding, y+this.cellHeight-cageBorderPadding);
                if (!hasSouthCell)
                    line (x+cageBorderPadding, y+this.cellHeight-cageBorderPadding, x+this.cellWidth-cageBorderPadding, y+this.cellHeight-cageBorderPadding);
                if (!hasWestCell)
                    line (x+cageBorderPadding, y+cageBorderPadding, x+cageBorderPadding, y+this.cellHeight-cageBorderPadding);
                drawingContext.setLineDash([]);
            }
            
            // draw cage sum's backdrop
            fill (this.cageSumBackgroundColor);
            noStroke ();
            rect (this.x + leftj * this.cellWidth + 2, this.y + topi * this.cellHeight + 2, this.cageTextSize * 1.5, this.cageTextSize);

            // write cage sum
            fill (this.cageSumColor);
            noStroke ();
            textFont (this.cageTextFont);
            textSize (this.cageTextSize);
            let topPadding = 3;
            text (cageSum, this.x + leftj * this.cellWidth + this.cageTextSize / 1.5 + 3, this.y + topi * this.cellHeight + (this.cageTextSize / 2) + topPadding)
            // console.warn (cage[0]);
        }
    }

    //====================================================================

    // draws domino markers on the board if there are any
    drawDominoes ()
    {
        for (let i = 0; i < this.rows; ++i)
        {
            let y = this.y + i * this.cellHeight;
            for (let j = 0; j < this.cols; ++j)
            {
                let x = this.x + j * this.cellWidth;

                let cellCenterX = x + this.cellWidth / 2;
                let cellCenterY = y + this.cellHeight / 2;

                // draw domino marker for each domino direction (i.e. north east south and west)
                for (let d = 0; d < DOMINO_NUM_DIRS; ++d)
                {
                    // direction
                    let domino_marker_x = cellCenterX;
                    let domino_marker_y = cellCenterY;
                    let domino_type = DOMINO_NONE;
                    // North
                    // if (d == DOMINO_NORTH)
                    // {
                    //     domino_marker_x = cellCenterX;
                    //     domino_marker_y = y;
                    //     domino_type = this.dominoes[i][j][d];
                    // }

                    // East
                    if (d == DOMINO_EAST)
                    {
                        domino_marker_x = x+this.cellWidth;
                        domino_marker_y = cellCenterY;
                        domino_type = this.dominoes[i][j][d];
                    }

                    // South
                    else if (d == DOMINO_SOUTH)
                    {
                        domino_marker_x = cellCenterX;
                        domino_marker_y = y+this.cellHeight;
                        domino_type = this.dominoes[i][j][d];
                    }

                    // West
                    // else if (d == DOMINO_WEST)
                    // {
                    //     domino_marker_x = x;
                    //     domino_marker_y = cellCenterY;
                    //     domino_type = this.dominoes[i][j][d];
                    // }
                    
                    // draw the domino
                    strokeWeight (1);
                    if (domino_type == DOMINO_KROPKI_WHITE)
                    {
                        stroke (0);
                        fill (255);
                        let circle_redius = this.dominoSize-6;
                        circle (domino_marker_x, domino_marker_y, circle_redius);
                    }
                    else if (domino_type == DOMINO_KROPKI_BLACK)
                    {
                        stroke (255);
                        fill (0);
                        let circle_redius = this.dominoSize-6;
                        circle (domino_marker_x, domino_marker_y, circle_redius);
                    }
                    else if (domino_type == DOMINO_SUM_V)
                    {
                        stroke (this.dominoBorderColor);
                        fill (this.dominoColor);
                        textSize (this.dominoSize);
                        textFont ("monospace");
                        textStyle (BOLD);
                        textAlign (CENTER, CENTER);
                        text ("V", domino_marker_x, domino_marker_y);
                    }
                    else if (domino_type == DOMINO_SUM_X)
                    {
                        stroke (this.dominoBorderColor);
                        fill (this.dominoColor);
                        textSize (this.dominoSize);
                        textFont ("monospace");
                        textStyle (BOLD);
                        textAlign (CENTER, CENTER);
                        text ("X", domino_marker_x, domino_marker_y);
                    }
                    else if (domino_type == DOMINO_LESS_THAN)
                    {
                        stroke (this.dominoBorderColor);
                        fill (this.dominoColor);
                        textSize (this.dominoSize);
                        textFont ("monospace");
                        textStyle (BOLD);
                        textAlign (CENTER, CENTER);
                        text ("<", domino_marker_x, domino_marker_y);
                    }
                    else if (domino_type == DOMINO_GREATER_THAN)
                    {
                        stroke (this.dominoBorderColor);
                        fill (this.dominoColor);
                        textSize (this.dominoSize);
                        textFont ("monospace");
                        textStyle (BOLD);
                        textAlign (CENTER, CENTER);
                        text (">", domino_marker_x, domino_marker_y);
                    }
                    else
                    {
                        // draw nothing because no dot
                    }
                } // end for - each domino direction


            }
        }
    }

}

