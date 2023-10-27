// Basic Sudoku Solver
//========================================================================


//========================================================================



// 1. pencil in possible digits for each cell

// 2. reduce penciled in digits using logic techniques?

// 3. fill in digits for cells with only one pencil mark

// 4, repeat

//========================================================================

// applies multiple sudoku solving techniques in order to attempt to solve
// the current sudoku.
function basicSolverSolve ()
{
    while (true)
    {
        // save previous board state to check for changes
        let prevBoard = [];
        for (let i = 0; i < sudokuBoard.rows; ++i)
        {
            prevBoard.push ([]);
            for (let j = 0; j < sudokuBoard.cols; ++j)
            {
                prevBoard[i].push (sudokuBoard.board[i][j]);
            }
        }

        basicSolverPencilDigits ();

        let numReductions = 10;
        for (let i = 0; i < numReductions; ++i)
            basicSolverReducePenciledDigits ();

        basicSolverFillDigits ();

        // stop repeating if we are not making progress
        let hasChanged = false;
        for (let i = 0; i < sudokuBoard.rows; ++i)
            for (let j = 0; j < sudokuBoard.cols; ++j)
                if (prevBoard[i][j] != sudokuBoard.board[i][j])
                    hasChanged = true;
        if (!hasChanged) break;
    }

}

//========================================================================

function basicSolverPencilDigits ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_SMALL;
    // clear previous selections
    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    for (let i = 0; i < sudokuBoard.rows; ++i)
    {
        for (let j = 0; j < sudokuBoard.cols; ++j)
        {
            // ensure cell isn't already filled in
            if (sudokuBoard.board[i][j] == EMPTY_CELL)
            {
                // clear previous pencil marks
                sudokuBoard.selectedCells[i][j] = 1;
                sudokuBoard.inputDigit (EMPTY_CELL);
                for (let d = sudokuBoard.low; d < sudokuBoard.high; ++d)
                {
                    if (sudokuBoard.isDigitValid (i, j, d))
                    {
                        // pencil in digit
                        sudokuBoard.inputDigit (d);
                    }
                }
                // deselect cell
                sudokuBoard.selectedCells[i][j] = 0;
            }
        }
    }

    editMode = MODE_SOLVER;
}

//========================================================================

function basicSolverReducePenciledDigits ()
{
    // clear previous selections
    sudokuBoard.clearSelectedCells ();

    hiddenSinglesInRow ();
    hiddenSinglesInCol ();
    hiddenSinglesInBox ();
    nakedPairsInRow ();
    nakedPairsInCol ();
    nakedPairsInBox ();
    hiddenPairsInRow ();
    hiddenPairsInCol ();
    hiddenPairsInBox ();
    nakedTriplesInRow ();
    nakedTriplesInCol ();
    nakedTriplesInBox ();
    hiddenTriplesInRow ();
    hiddenTriplesInCol ();
    hiddenTriplesInBox ();
    lockedDigitInRow ();
    lockedDigitInCol ();
    lockedDigitInBox ();
    restrictDominoes ();

    editMode = MODE_SOLVER;
}

//========================================================================

function basicSolverFillDigits ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_DIGIT;
    // clear previous selections
    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    for (let i = 0; i < sudokuBoard.rows; ++i)
    {
        for (let j = 0; j < sudokuBoard.cols; ++j)
        {
            // ensure cell isn't already filled in
            if (sudokuBoard.board[i][j] == EMPTY_CELL)
            {
                // ensure cell only has one penciled in digit
                let numPenciledInDigits = 0;
                let penciledInDigit = 0;
                for (let p = sudokuBoard.low; p < sudokuBoard.high; ++p)
                {
                    if (sudokuBoard.centerDigits[i][j][p] == 1)
                    {
                        numPenciledInDigits++;
                        penciledInDigit = p;
                    }
                }
                if (numPenciledInDigits == 1)
                {
                    sudokuBoard.selectedCells[i][j] = 1;
                    sudokuBoard.inputDigit (penciledInDigit);
                    sudokuBoard.selectedCells[i][j] = 0;
                }
            }
        }
    }

    editMode = MODE_SOLVER;
}

//========================================================================

// reduces pencil marks if a digit only has one possible location in a row
// this covers naked singles and hidden singles
function hiddenSinglesInRow ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_SMALL;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    let hasChanged = false;
    for (let i = 0; i < sudokuBoard.rows; ++i)
    {
        for (let d = sudokuBoard.low; d < sudokuBoard.high; ++d)
        {
            let possibleLocations = 0;
            let possibleLocation = 0;
            for (let j = 0; j < sudokuBoard.cols; ++j)
            {
                // ensure cell isn't already filled in
                if (sudokuBoard.board[i][j] == EMPTY_CELL && sudokuBoard.isDigitValid (i, j, d))
                {
                    // check to see if digit is penciled in
                    if (sudokuBoard.centerDigits[i][j][d] == 1)
                    {
                        possibleLocations++;
                        possibleLocation = j;
                    }
                }
            }
            if (possibleLocations == 1)
            {
                // theres only one place that d can go, so place it here
                sudokuBoard.selectedCells[i][possibleLocation] = 1;
                // highlight it red if there are other digits
                let numPossibleDigits = sudokuBoard.getCenterDigits(i, possibleLocation).length;
                if (numPossibleDigits > 1)
                {
                    sudokuBoard.cellColors[i][possibleLocation][COLOR_RED] = 1;
                }
                sudokuBoard.cellColors[i][possibleLocation][COLOR_GREEN] = 1;
                // clear other pencil marks
                sudokuBoard.inputDigit (EMPTY_CELL);
                sudokuBoard.inputDigit (d);
                sudokuBoard.selectedCells[i][possibleLocation] = 0;
                hasChanged = true;
            }
        }
    }
    editMode = MODE_SOLVER;
    return hasChanged;
}

//========================================================================

// reduces pencil marks if a digit only has one possible location in a column
// this covers naked singles and hidden singles
function hiddenSinglesInCol ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_SMALL;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    let hasChanged = false;
    for (let j = 0; j < sudokuBoard.cols; ++j)
    {
        for (let d = sudokuBoard.low; d < sudokuBoard.high; ++d)
        {
            let possibleLocations = 0;
            let possibleLocation = 0;
            for (let i = 0; i < sudokuBoard.rows; ++i)
            {
                // ensure cell isn't already filled in
                if (sudokuBoard.board[i][j] == EMPTY_CELL && sudokuBoard.isDigitValid (i, j, d))
                {
                    // check to see if digit is penciled in
                    if (sudokuBoard.centerDigits[i][j][d] == 1)
                    {
                        possibleLocations++;
                        possibleLocation = i;
                    }
                }
            }
            if (possibleLocations == 1)
            {
                // theres only one place that d can go, so place it here
                sudokuBoard.selectedCells[possibleLocation][j] = 1;
                // highlight it red if there are other digits
                let numPossibleDigits = sudokuBoard.getCenterDigits(possibleLocation, j).length;
                if (numPossibleDigits > 1)
                {
                    sudokuBoard.cellColors[possibleLocation][j][COLOR_RED] = 1;
                }
                sudokuBoard.cellColors[possibleLocation][j][COLOR_GREEN] = 1;
                // clear other pencil marks
                sudokuBoard.inputDigit (EMPTY_CELL);
                sudokuBoard.inputDigit (d);
                sudokuBoard.selectedCells[possibleLocation][j] = 0;
                hasChanged = true;
            }
        }
    }
    editMode = MODE_SOLVER;
    return hasChanged;
}

//========================================================================

// reduces pencil marks if a digit only has one possible location in a box
// this covers naked singles and hidden singles
function hiddenSinglesInBox ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_SMALL;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    let hasChanged = false;

    for (let boxi = 0; boxi < sudokuBoard.boxRows; ++boxi)
    {
        for (let boxj = 0; boxj < sudokuBoard.boxCols; ++boxj)
        {
            for (let d = sudokuBoard.low; d < sudokuBoard.high; ++d)
            {
                let possibleLocations = 0;
                let possiblei = 0;
                let possiblej = 0;
                for (let i = sudokuBoard.boxRows*boxi; i < (boxi+1)*sudokuBoard.boxRows; ++i)
                {
                    for (let j = boxj*sudokuBoard.boxCols; j < (boxj+1)*sudokuBoard.boxCols; ++j)
                    {
                        // ensure cell isn't already filled in
                        // and that this digit is valid here
                        if (sudokuBoard.board[i][j] == EMPTY_CELL && sudokuBoard.isDigitValid (i, j, d))
                        {
                            // check to see if digit is penciled in
                            if (sudokuBoard.centerDigits[i][j][d] == 1)
                            {
                                possibleLocations++;
                                possiblei = i;
                                possiblej = j;
                            }
                        }
                    }
                }
                if (possibleLocations == 1)
                {
                    // theres only one place that d can go, so place it here
                    sudokuBoard.selectedCells[possiblei][possiblej] = 1;
                    // highlight it red if there are other digits
                    let numPossibleDigits = sudokuBoard.getCenterDigits(possiblei, possiblej).length;
                    if (numPossibleDigits > 1)
                    {
                        sudokuBoard.cellColors[possiblei][possiblej][COLOR_RED] = 1;
                    }
                    sudokuBoard.cellColors[possiblei][possiblej][COLOR_GREEN] = 1;
                    // clear other pencil marks
                    sudokuBoard.inputDigit (EMPTY_CELL);
                    sudokuBoard.inputDigit (d);
                    sudokuBoard.selectedCells[possiblei][possiblej] = 0;
                    hasChanged = true;
                }
            }
        }
    }
    editMode = MODE_SOLVER;
    return hasChanged;
}

//========================================================================

// searches for naked pairs of digits in a row, 
// and removes their digits from elsewhere in the row
function nakedPairsInRow ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_SMALL;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    // row pairs
    for (let i = 0; i < sudokuBoard.rows; ++i)
    {
        // first, look for a cell with only two penciled in digits
        for (let j = 0; j < sudokuBoard.cols; ++j)
        {
            let penciledDigitsj = sudokuBoard.getCenterDigits (i, j);
            // ensure it has two digits
            if (penciledDigitsj.length == 2)
            {
                // then find a matching cell with the same two penciled in digits
                for (let k = j+1; k < sudokuBoard.cols; ++k)
                {
                    let penciledDigitsk = sudokuBoard.getCenterDigits (i, k);
                    // ensure it has two digits and matching digits
                    if (penciledDigitsk.length == 2 && penciledDigitsj[0] == penciledDigitsk[0] && penciledDigitsj[1] == penciledDigitsk[1])
                    {
                        // found a pair!
                        sudokuBoard.cellColors[i][j][COLOR_GREEN] = 1;
                        sudokuBoard.cellColors[i][k][COLOR_GREEN] = 1;
                        // highlight this row
                        for (let jj = 0; jj < sudokuBoard.cols; ++jj)
                        {
                            // ensure it is not one of the pair cells
                            if (jj == j || jj == k) continue;
                            sudokuBoard.cellColors[i][jj][COLOR_YELLOW] = 1;
                        }
                        // since this pair exists, we know that neither of these digits
                        // can appear in other cells in this row
                        // so lets remove any pencilmarks
                        for (let jj = 0; jj < sudokuBoard.cols; ++jj)
                        {
                            // ensure this cell is not either pairing cell
                            if (j != jj && k != jj)
                            {
                                // remove pair's digits if it exists
                                let penciledDigitsijj = sudokuBoard.getCenterDigits (i, jj);
                                for (let x = 0; x < penciledDigitsj.length; ++x)
                                {
                                    if (penciledDigitsijj.includes (penciledDigitsj[x]))
                                    {
                                        sudokuBoard.centerDigits[i][jj][penciledDigitsj[x]] = 0;
                                        // highlight this cell to denote that it was reduced
                                        sudokuBoard.cellColors[i][jj][COLOR_RED] = 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    editMode = MODE_SOLVER;
    return true;
}

//========================================================================

function nakedPairsInCol ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_SMALL;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    // column pairs
    for (let j = 0; j < sudokuBoard.cols; ++j)
    {
        // first, look for a cell with only two penciled in digits
        for (let i = 0; i < sudokuBoard.rows; ++i)
        {
            let penciledDigitsi = sudokuBoard.getCenterDigits (i, j);
            // ensure it has two digits
            if (penciledDigitsi.length == 2)
            {
                // then find a matching cell with the same two penciled in digits
                for (let k = i+1; k < sudokuBoard.rows; ++k)
                {
                    let penciledDigitsk = sudokuBoard.getCenterDigits (k, j);
                    // ensure it has two digits and matching digits
                    if (penciledDigitsk.length == 2 && penciledDigitsi[0] == penciledDigitsk[0] && penciledDigitsi[1] == penciledDigitsk[1])
                    {
                        // found a pair!
                        sudokuBoard.cellColors[i][j][COLOR_GREEN] = 1;
                        sudokuBoard.cellColors[k][j][COLOR_GREEN] = 1;
                        // highlight this column
                        for (let ii = 0; ii < sudokuBoard.rows; ++ii)
                        {
                            // ensure it is not one of the pair cells
                            if (ii == i || ii == k) continue;
                            sudokuBoard.cellColors[ii][j][COLOR_YELLOW] = 1;
                        }
                        // since this pair exists, we know that neither of these digits
                        // can appear in other cells in this column
                        // so lets remove any pencilmarks
                        for (let ii = 0; ii < sudokuBoard.rows; ++ii)
                        {
                            // ensure this cell is not either pairing cell
                            if (i != ii && k != ii)
                            {
                                // remove pair's digits if it exists
                                let penciledDigitsiij = sudokuBoard.getCenterDigits (ii, j);
                                for (let x = 0; x < penciledDigitsi.length; ++x)
                                {
                                    if (penciledDigitsiij.includes (penciledDigitsi[x]))
                                    {
                                        sudokuBoard.centerDigits[ii][j][penciledDigitsi[x]] = 0;
                                        // highlight this cell to be sure
                                        sudokuBoard.cellColors[ii][j][COLOR_RED] = 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    editMode = MODE_SOLVER;
    return true;
}

//========================================================================

function nakedPairsInBox ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_SMALL;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    // for each box
    for (let boxi = 0; boxi < sudokuBoard.boxRows; ++boxi)
    {
        for (let boxj = 0; boxj < sudokuBoard.boxCols; ++boxj)
        {
            // first, look for a cell with only two penciled in digits
            for (let i = boxi*sudokuBoard.boxRows; i < (boxi+1)*sudokuBoard.boxRows; ++i)
            {
                for (let j = boxj*sudokuBoard.boxCols; j < (boxj+1)*sudokuBoard.boxCols; ++j)
                {
                    let penciledDigitsij = sudokuBoard.getCenterDigits (i, j);
                    // ensure it has two digits
                    if (penciledDigitsij.length == 2)
                    {
                        // then find a matching cell with the same two penciled in digits
                        let next_col0 = j+1;
                        for (let k = i; k < (boxi+1)*sudokuBoard.boxRows; ++k)
                        {
                            // reset column index if we advanced to next row
                            if (k!=i) next_col0 = boxj*sudokuBoard.boxCols;
                            for (let l = next_col0; l < (boxj+1)*sudokuBoard.boxCols; ++l)
                            {
                                let penciledDigitskl = sudokuBoard.getCenterDigits (k, l);
                                // ensure it has two digits and matching digits
                                // and ensure it is not the same cell
                                if (!(i==k&&j==l) && penciledDigitskl.length == 2 && penciledDigitsij[0] == penciledDigitskl[0] && penciledDigitsij[1] == penciledDigitskl[1])
                                {
                                    // found a pair!
                                    // since this pair exists, we know that neither of these digits
                                    // can appear in other cells in this box
                                    // so lets remove any pencilmarks
                                    for (let ii = boxi*sudokuBoard.boxRows; ii < (boxi+1)*sudokuBoard.boxRows; ++ii)
                                    {
                                        for (let jj = boxj*sudokuBoard.boxCols; jj < (boxj+1)*sudokuBoard.boxCols; ++jj)
                                        {
                                            // ensure this cell is not either pairing cell
                                            if (!(i==ii&&j==jj) && !(k==ii&&l==jj))
                                            {
                                                // remove pair's digits if it exists
                                                let hasReduced = false;
                                                let penciledDigitsiijj = sudokuBoard.getCenterDigits (ii, jj);
                                                for (let x = 0; x < penciledDigitsij.length; ++x)
                                                {
                                                    // includes pair's digits
                                                    if (penciledDigitsiijj.includes (penciledDigitsij[x]))
                                                    {
                                                        sudokuBoard.centerDigits[ii][jj][penciledDigitsij[x]] = 0;
                                                        // highlight this cell to be sure
                                                        sudokuBoard.cellColors[ii][jj][COLOR_RED] = 1;
                                                        hasReduced = true;
                                                    }
                                                }
                                                // if we didnt reduce a digit, then color the cell yellow
                                                if (!hasReduced)
                                                {
                                                    sudokuBoard.cellColors[ii][jj][COLOR_YELLOW] = 1;
                                                }
                                            }
                                            // this cell is one of the pairs
                                            else
                                            {
                                                sudokuBoard.cellColors[ii][jj][COLOR_GREEN] = 1;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    editMode = MODE_SOLVER;
    return true;
}

//========================================================================

// searches for hidden pairs of digits and isolates them 
// by removing other penciled digits from the pair's cells
function hiddenPairsInRow ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_SMALL;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    // for each row
    for (let i = 0; i < sudokuBoard.rows; ++i)
    {
        // we need two digits that mutually occupy the same two cells in the same row
        // lets start with finding a digit that occupies only two cells
        for (let d0 = sudokuBoard.low; d0 < sudokuBoard.high; ++d0)
        {
            // find possible positions of this digit in this row
            let isAlreadyFilledIn = false;
            let possibleLocationsJ = [];
            for (let j = 0; j < sudokuBoard.cols; ++j)
            {
                // this is a possible location
                // if d0 is penciled here
                if (sudokuBoard.centerDigits[i][j][d0] == 1 && sudokuBoard.board[i][j] == EMPTY_CELL)
                    possibleLocationsJ.push (j);

                // we can also ignore if d0 was already filled in this row
                if (sudokuBoard.board[i][j] == d0) 
                {
                    isAlreadyFilledIn = true;
                    break;
                }
            }
            // ensure digit wasnt already filled in
            if (isAlreadyFilledIn) continue;
            // ensure this digit has exactly 2 valid locations (to make a pair)
            if (possibleLocationsJ.length != 2) continue;
            // reaches here if this digit can only go in 2 locations in this row
            // highlight those two positions
            // sudokuBoard.cellColors[i][possibleLocationsJ[0]][COLOR_BLUE] = 1;
            // sudokuBoard.cellColors[i][possibleLocationsJ[1]][COLOR_BLUE] = 1;
            // mark the digit
            sudokuBoard.topDigits[i][possibleLocationsJ[0]][d0] = 1;
            sudokuBoard.topDigits[i][possibleLocationsJ[1]][d0] = 1;
            // we will use the digit marks to determine if two digits occupy the same two cells
        }
        // search for two cells with the same digit pair
        for (let j = 0; j < sudokuBoard.cols; ++j)
        {
            // ignore if cell is already filled in
            if (sudokuBoard.board[i][j] != EMPTY_CELL) continue;

            let digits0 = sudokuBoard.getTopDigits (i,j);
            // ignore if not a pair
            if (digits0.length != 2) continue;
            // look for another pair that matches
            for (let jj = j+1; jj < sudokuBoard.cols; ++jj)
            {
                // ignore if cell is alread filled in
                if (sudokuBoard.board[i][jj] != EMPTY_CELL) continue;

                let digits1 = sudokuBoard.getTopDigits (i,jj);
                // ignore if not a pair
                if (digits1.length != 2) continue;
                // ensure pairs match
                if (!(digits0[0] == digits1[0] && digits0[1] == digits1[1])) continue;
                // reaches here if pairs match

                // ignore if cells are naked pairs already
                // this is not necessary
                // this is just so we only color the cells if there is a change to note
                if (sudokuBoard.getCenterDigits(i,j).length == 2 && sudokuBoard.getCenterDigits(i,jj).length == 2) break;

                // pairs match and are not naked pairs so make them naked pairs
                // aka remove other penciled digits from these cells

                // clear all pencil marks
                for (let d = sudokuBoard.low; d < sudokuBoard.high; ++d)
                {
                    sudokuBoard.centerDigits[i][j ][d] = 0;
                    sudokuBoard.centerDigits[i][jj][d] = 0;
                }

                // pencil only the pair digits
                sudokuBoard.centerDigits[i][j ][digits0[0]] = 1;
                sudokuBoard.centerDigits[i][jj][digits0[0]] = 1;
                sudokuBoard.centerDigits[i][j ][digits1[1]] = 1;
                sudokuBoard.centerDigits[i][jj][digits1[1]] = 1;

                // highlight isolated cells
                sudokuBoard.cellColors[i][j ][COLOR_GREEN] = 1;
                sudokuBoard.cellColors[i][jj][COLOR_GREEN] = 1;
            } 
        }
    }

    editMode = MODE_SOLVER;
    return true;
}

//========================================================================

// searches for hidden pairs of digits and isolates them 
// by removing other penciled digits from the pair's cells
function hiddenPairsInCol ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_SMALL;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    // for each column
    for (let j = 0; j < sudokuBoard.cols; ++j)
    {
        // we need two digits that mutually occupy the same two cells in the same column
        // lets start with finding a digit that occupies only two cells
        for (let d0 = sudokuBoard.low; d0 < sudokuBoard.high; ++d0)
        {
            // find possible positions of this digit in this column
            let isAlreadyFilledIn = false;
            let possibleLocationsI = [];
            for (let i = 0; i < sudokuBoard.rows; ++i)
            {
                // this is a possible location
                // if d0 is penciled here
                if (sudokuBoard.centerDigits[i][j][d0] == 1 && sudokuBoard.board[i][j] == EMPTY_CELL)
                    possibleLocationsI.push (i);

                // we can also ignore if d0 was already filled in this column
                if (sudokuBoard.board[i][j] == d0) 
                {
                    isAlreadyFilledIn = true;
                    break;
                }
            }
            // ensure digit wasnt already filled in
            if (isAlreadyFilledIn) continue;
            // ensure this digit has exactly 2 valid locations (to make a pair)
            if (possibleLocationsI.length != 2) continue;
            // reaches here if this digit can only go in 2 locations in this column
            // highlight those two positions
            // sudokuBoard.cellColors[possibleLocationsI[0]][j][COLOR_BLUE] = 1;
            // sudokuBoard.cellColors[possibleLocationsI[1]][j][COLOR_BLUE] = 1;
            // mark the digit
            sudokuBoard.topDigits[possibleLocationsI[0]][j][d0] = 1;
            sudokuBoard.topDigits[possibleLocationsI[1]][j][d0] = 1;
            // we will use the digit marks to determine if two digits occupy the same two cells
        }
        // search for two cells with the same digit pair
        for (let i = 0; i < sudokuBoard.rows; ++i)
        {
            // ignore if cell is already filled in
            if (sudokuBoard.board[i][j] != EMPTY_CELL) continue;

            let digits0 = sudokuBoard.getTopDigits (i,j);
            // ignore if not a pair
            if (digits0.length != 2) continue;
            // look for another pair that matches
            for (let ii = i+1; ii < sudokuBoard.rows; ++ii)
            {
                // ignore if cell is already filled in
                if (sudokuBoard.board[ii][j] != EMPTY_CELL) continue;

                let digits1 = sudokuBoard.getTopDigits (ii,j);
                // ignore if not a pair
                if (digits1.length != 2) continue;
                // ensure pairs match
                if (!(digits0[0] == digits1[0] && digits0[1] == digits1[1])) continue;
                // reaches here if pairs match

                // ignore if cells are naked pairs already
                // this is not necessary
                // this is just so we only color the cells if there is a change to note
                if (sudokuBoard.getCenterDigits(i,j).length == 2 && sudokuBoard.getCenterDigits(ii,j).length == 2) break;

                // pairs match so isolate them
                // aka remove other penciled digits from these cells

                // clear all pencil marks
                for (let d = sudokuBoard.low; d < sudokuBoard.high; ++d)
                {
                    sudokuBoard.centerDigits[i ][j][d] = 0;
                    sudokuBoard.centerDigits[ii][j][d] = 0;
                }

                // pencil only the pair digits
                sudokuBoard.centerDigits[i ][j][digits0[0]] = 1;
                sudokuBoard.centerDigits[ii][j][digits0[0]] = 1;
                sudokuBoard.centerDigits[i ][j][digits1[1]] = 1;
                sudokuBoard.centerDigits[ii][j][digits1[1]] = 1;

                // highlight isolated cells
                sudokuBoard.cellColors[i ][j][COLOR_GREEN] = 1;
                sudokuBoard.cellColors[ii][j][COLOR_GREEN] = 1;
            } 
        }
    }

    editMode = MODE_SOLVER;
    return true;
}

//========================================================================

// searches for hidden pairs of digits and isolates them 
// by removing other penciled digits from the pair's cells
function hiddenPairsInBox ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_SMALL;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    // for each box
    for (let boxi = 0; boxi < sudokuBoard.boxRows; ++boxi)
    {
        for (let boxj = 0; boxj < sudokuBoard.boxCols; ++boxj)
        {
            // we need two digits that mutually occupy the same two cells in the same box
            // lets start with finding a digit that occupies only two cells
            for (let d0 = sudokuBoard.low; d0 < sudokuBoard.high; ++d0)
            {
                // find possible positions of this digit in this box
                let isAlreadyFilledIn = false;
                let possibleLocationsI = [];
                let possibleLocationsJ = [];
                for (let i = boxi*sudokuBoard.boxRows; i < (boxi+1)*sudokuBoard.boxRows; ++i)
                {
                    for (let j = boxj*sudokuBoard.boxCols; j < (boxj+1)*sudokuBoard.boxCols; ++j)
                    {
                        // this is a possible location
                        // if d0 is penciled here
                        if (sudokuBoard.centerDigits[i][j][d0] == 1 && sudokuBoard.board[i][j] == EMPTY_CELL)
                        {
                            possibleLocationsI.push (i);
                            possibleLocationsJ.push (j);
                        }

                        // we can also ignore if d0 was already filled in this box
                        if (sudokuBoard.board[i][j] == d0) 
                        {
                            isAlreadyFilledIn = true;
                            break;
                        }
                    }
                    if (isAlreadyFilledIn) break;
                }
                // ensure digit wasnt already filled in
                if (isAlreadyFilledIn) continue;
                // ensure this digit has exactly 2 valid locations (to make a pair)
                if (possibleLocationsI.length != 2) continue;
                // reaches here if this digit can only go in 2 locations in this box
                // highlight those two positions
                // sudokuBoard.cellColors[possibleLocationsI[0]][possibleLocationsJ[0]][COLOR_BLUE] = 1;
                // sudokuBoard.cellColors[possibleLocationsI[1]][possibleLocationsJ[1]][COLOR_BLUE] = 1;
                // mark the digit
                sudokuBoard.topDigits[possibleLocationsI[0]][possibleLocationsJ[0]][d0] = 1;
                sudokuBoard.topDigits[possibleLocationsI[1]][possibleLocationsJ[1]][d0] = 1;
                // we will use the digit marks to determine if two digits occupy the same two cells
            }
            // search for two cells with the same digit pair
            for (let i = boxi*sudokuBoard.boxRows; i < (boxi+1)*sudokuBoard.boxRows; ++i)
            {
                for (let j = boxj*sudokuBoard.boxCols; j < (boxj+1)*sudokuBoard.boxCols; ++j)
                {
                    // ignore if cell is already filled in
                    if (sudokuBoard.board[i][j] != EMPTY_CELL) continue;

                    let digits0 = sudokuBoard.getTopDigits (i,j);
                    // ignore if not a pair
                    if (digits0.length != 2) continue;
                    // look for another pair that matches
                    for (let ii = boxi*sudokuBoard.boxRows; ii < (boxi+1)*sudokuBoard.boxRows; ++ii)
                    {
                        for (let jj = boxj*sudokuBoard.boxCols; jj < (boxj+1)*sudokuBoard.boxCols; ++jj)
                        {
                            // ignore if we are looking at the same cell
                            if (i == ii && j == jj) continue;
                            // ignore if cell is already filled in
                            if (sudokuBoard.board[ii][jj] != EMPTY_CELL) continue;

                            let digits1 = sudokuBoard.getTopDigits (ii,jj);
                            // ignore if not a pair
                            if (digits1.length != 2) continue;
                            // ensure pairs match
                            if (!(digits0[0] == digits1[0] && digits0[1] == digits1[1])) continue;
                            // reaches here if pairs match

                            // ignore if cells are naked pairs already
                            // this is not necessary
                            // this is just so we only color the cells if there is a change to note
                            if (sudokuBoard.getCenterDigits(i,j).length == 2 && sudokuBoard.getCenterDigits(ii,jj).length == 2) break;

                            // pairs match so isolate them
                            // aka remove other penciled digits from these cells

                            // clear all pencil marks
                            for (let d = sudokuBoard.low; d <= sudokuBoard.high; ++d)
                            {
                                sudokuBoard.centerDigits[i ][j ][d] = 0;
                                sudokuBoard.centerDigits[ii][jj][d] = 0;
                            }

                            // pencil only the pair digits
                            sudokuBoard.centerDigits[i ][j ][digits0[0]] = 1;
                            sudokuBoard.centerDigits[ii][jj][digits0[0]] = 1;
                            sudokuBoard.centerDigits[i ][j ][digits1[1]] = 1;
                            sudokuBoard.centerDigits[ii][jj][digits1[1]] = 1;

                            // highlight isolated cells
                            sudokuBoard.cellColors[i ][j ][COLOR_GREEN] = 1;
                            sudokuBoard.cellColors[ii][jj][COLOR_GREEN] = 1;
                        }
                    } 
                }
            }
            
        }
    }

        


    editMode = MODE_SOLVER;
    return true;
}

//========================================================================

// searches for naked triples in a row, 
// and removes their digits from elsewhere in the row
// a naked triple is three cells who have the same 3 possible digits
// Full triple:       [ 1 2 3 ][ 1 2 3 ][ 1 2 3 ] possible digits = 1,2,3
// restricted triple: [ 1 2   ][ 2 3   ][ 1 3   ] possible digits = 1,2,3
function nakedTriplesInRow ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_SMALL;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    // search for triples in each row
    for (let i = 0; i < sudokuBoard.rows; ++i)
    {
        // first, look for a cell with three or less penciled in digits
        for (let j = 0; j < sudokuBoard.cols; ++j)
        {
            // ensure digit is not filled in already
            if (sudokuBoard.board[i][j] != EMPTY_CELL)
                continue;
            let penciledDigitsj = sudokuBoard.getCenterDigits (i, j);
            // ensure it has penciled digits
            // if not, then something went wrong somewhere
            if (!(penciledDigitsj.length > 0))
                continue;
            // ensure it has three or less digits
            // if not, then it isnt a part of a naked triple, so move on
            if (!(penciledDigitsj.length <= 3))
                continue;
            // this could be a part of a triple,
            // lets keep track of possible triple digits
            triple_digits0 = new Set(penciledDigitsj)
            // then find a second matching cell with the same 3 penciled in digits
            for (let k = j+1; k < sudokuBoard.cols; ++k)
            {
                // ensure digit is not filled in already
                if (sudokuBoard.board[i][k] != EMPTY_CELL)
                    continue;
                let penciledDigitsk = sudokuBoard.getCenterDigits (i, k);
                // ensure it has penciled digits
                // if not, then something went wrong somewhere
                if (!(penciledDigitsk.length > 0))
                    continue;
                // ensure it has 3 or less digits
                // if not, then it isnt a part of a naked triple, so move on
                if (!(penciledDigitsk.length <= 3))
                    continue;
                // ensure that we are still looking at a max of 3 different possible digits
                // if more than 3 different digits to choose from,
                // then those cells cannot be triples
                triple_digits1 = new Set ([...triple_digits0, ...penciledDigitsk]);
                if (triple_digits1.size > 3)
                    continue;

                // then find a third matching cell with the same 3 penciled in digits
                for (let l = k+1; l < sudokuBoard.cols; ++l)
                {
                    // ensure digit is not filled in already
                    if (sudokuBoard.board[i][l] != EMPTY_CELL)
                        continue;
                    let penciledDigitsl = sudokuBoard.getCenterDigits (i, l);
                    // ensure it has penciled digits
                    // if not, then something went wrong somewhere
                    if (!(penciledDigitsl.length > 0))
                        continue;
                    // ensure it has 3 or less digits
                    // if not, then it isnt a part of a naked triple, so move on
                    if (!(penciledDigitsl.length <= 3))
                        continue;
                    // ensure that we are still looking at a max of 3 *different* possible digits
                    // if more than 3 different digits to choose from,
                    // then those cells cannot be triples
                    triple_digits2 = new Set ([...triple_digits1, ...penciledDigitsl]);
                    if (triple_digits2.size > 3)
                        continue;
                    
                    // reaches here if we have 3 cells that have the same 3 possible digits
                    // so we have a triple!
                    // let's highlight it!
                    sudokuBoard.cellColors[i][j][COLOR_GREEN] = 1;
                    sudokuBoard.cellColors[i][k][COLOR_GREEN] = 1;
                    sudokuBoard.cellColors[i][l][COLOR_GREEN] = 1;
                    // highlight this row
                    for (let jj = 0; jj < sudokuBoard.cols; ++jj)
                    {
                        // ensure it is not one of the triple cells
                        if (jj == j || jj == k || jj == l) continue;
                        sudokuBoard.cellColors[i][jj][COLOR_YELLOW] = 1;
                    }
                    // since this triple exists, we know that none of these digits
                    // can appear in other cells in this row
                    // so lets remove any pencilmarks
                    for (let jj = 0; jj < sudokuBoard.cols; ++jj)
                    {
                        // ensure this cell is not one of the triple cells
                        if (!(j != jj && k != jj && l != jj))
                            continue;

                        // remove triple's digits if it exists
                        let penciledDigitsijj = sudokuBoard.getCenterDigits (i, jj);
                        for (const triple_digit of triple_digits2)
                        {
                            if (penciledDigitsijj.includes (triple_digit))
                            {
                                sudokuBoard.centerDigits[i][jj][triple_digit] = 0;
                                // highlight this cell to denote that it was reduced
                                sudokuBoard.cellColors[i][jj][COLOR_RED] = 1;
                            }
                        }
                    }
                }
            }
        }
    }
    editMode = MODE_SOLVER;
    return true;
}

//========================================================================

// searches for naked triples in a column, 
// and removes their digits from elsewhere in the column
function nakedTriplesInCol ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_SMALL;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    // search for triples in each column
    for (let j = 0; j < sudokuBoard.cols; ++j)
    {
        // first, look for a cell with 3 or less penciled in digits
        for (let i = 0; i < sudokuBoard.rows; ++i)
        {
            // ensure digit is not filled in already
            if (sudokuBoard.board[i][j] != EMPTY_CELL)
                continue;
            let penciledDigitsi = sudokuBoard.getCenterDigits (i, j);
            // ensure it has penciled digits
            // if not, then something went wrong somewhere
            if (!(penciledDigitsi.length > 0))
                continue;
            // ensure it has 3 or less digits
            // if not, then it isnt a part of a naked triple, so move on
            if (!(penciledDigitsi.length <= 3))
                continue;
            // this could be a part of a triple,
            // lets keep track of possible triple digits
            triple_digits0 = new Set(penciledDigitsi)
            // then find a second matching cell with the same 3 penciled in digits
            for (let k = i+1; k < sudokuBoard.rows; ++k)
            {
                // ensure digit is not filled in already
                if (sudokuBoard.board[k][j] != EMPTY_CELL)
                    continue;
                let penciledDigitsk = sudokuBoard.getCenterDigits (k, j);
                // ensure it has penciled digits
                // if not, then something went wrong somewhere
                if (!(penciledDigitsk.length > 0))
                    continue;
                // ensure it has 3 or less digits
                // if not, then it isnt a part of a naked triple, so move on
                if (!(penciledDigitsk.length <= 3))
                    continue;
                // ensure that we are still looking at a max of 3 *different* possible digits
                // if more than 3 different digits to choose from,
                // then those cells cannot be triples
                triple_digits1 = new Set ([...triple_digits0, ...penciledDigitsk]);
                if (triple_digits1.size > 3)
                    continue;

                // then find a third matching cell with the same 3 penciled in digits
                for (let l = k+1; l < sudokuBoard.rows; ++l)
                {
                    // ensure digit is not filled in already
                    if (sudokuBoard.board[l][j] != EMPTY_CELL)
                        continue;
                    let penciledDigitsl = sudokuBoard.getCenterDigits (l, j);
                    // ensure it has penciled digits
                    // if not, then something went wrong somewhere
                    if (!(penciledDigitsl.length > 0))
                        continue;
                    // ensure it has 3 or less digits
                    // if not, then it isnt a part of a naked triple, so move on
                    if (!(penciledDigitsl.length <= 3))
                        continue;
                    // ensure that we are still looking at a max of 3 *different* possible digits
                    // if more than 3 different digits to choose from,
                    // then those cells cannot be triples
                    triple_digits2 = new Set ([...triple_digits1, ...penciledDigitsl]);
                    if (triple_digits2.size > 3)
                        continue;

                    // reaches here if we have 3 cells that have the same 3 possible digits
                    // so we have a triple!
                    // let's highlight it!
                    sudokuBoard.cellColors[i][j][COLOR_GREEN] = 1;
                    sudokuBoard.cellColors[k][j][COLOR_GREEN] = 1;
                    sudokuBoard.cellColors[l][j][COLOR_GREEN] = 1;
                    // highlight this column
                    for (let ii = 0; ii < sudokuBoard.rows; ++ii)
                    {
                        // ensure it is not one of the triple cells
                        if (ii == i || ii == k || ii == l) continue;
                        sudokuBoard.cellColors[ii][j][COLOR_YELLOW] = 1;
                    }
                    // since this triple exists, we know that none of these digits
                    // can appear in other cells in this column
                    // so lets remove any pencilmarks
                    for (let ii = 0; ii < sudokuBoard.rows; ++ii)
                    {
                        // ensure this cell is not either triple cell
                        if (!(i != ii && k != ii && l != ii))
                            continue;

                        // remove triple's digits if it exists
                        let penciledDigitsiij = sudokuBoard.getCenterDigits (ii, j);
                        for (const triple_digit of triple_digits2)
                        {
                            if (penciledDigitsiij.includes (triple_digit))
                            {
                                sudokuBoard.centerDigits[ii][j][triple_digit] = 0;
                                // highlight this cell to be sure
                                sudokuBoard.cellColors[ii][j][COLOR_RED] = 1;
                            }
                        }
                    }   
                }
            }
        }
    }
    editMode = MODE_SOLVER;
    return true;
}

//========================================================================

// searches for naked triples in a box, 
// and removes their digits from elsewhere in the box
function nakedTriplesInBox ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_SMALL;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    // search each box for triples
    for (let boxi = 0; boxi < sudokuBoard.boxRows; ++boxi)
    {
        for (let boxj = 0; boxj < sudokuBoard.boxCols; ++boxj)
        {
            // first, look for a cell with three or less penciled in digits
            for (let i = boxi*sudokuBoard.boxRows; i < (boxi+1)*sudokuBoard.boxRows; ++i)
            {
                for (let j = boxj*sudokuBoard.boxCols; j < (boxj+1)*sudokuBoard.boxCols; ++j)
                {
                    // ensure digit is not filled in already
                    if (sudokuBoard.board[i][j] != EMPTY_CELL)
                        continue;
                    let penciledDigitsij = sudokuBoard.getCenterDigits (i, j);
                    // ensure it has penciled digits
                    // if not, then something went wrong somewhere
                    if (!(penciledDigitsij.length > 0))
                        continue;
                    // ensure it has three or less digits
                    // if not, then it isnt a part of a naked triple, so move on
                    if (!(penciledDigitsij.length <= 3))
                        continue;
                    // this could be a part of a triple,
                    // lets keep track of possible triple digits
                    triple_digits0 = new Set(penciledDigitsij)
                    // then find a second matching cell with the same 3 penciled in digits
                    let next_col0 = j+1;
                    for (let k = i; k < (boxi+1)*sudokuBoard.boxRows; ++k)
                    {
                        // reset column index if we advanced to next row
                        if (k!=i) next_col0 = boxj*sudokuBoard.boxCols;
                        for (let l = next_col0; l < (boxj+1)*sudokuBoard.boxCols; ++l)
                        {
                            // ensure digit is not filled in already
                            if (sudokuBoard.board[k][l] != EMPTY_CELL)
                                continue;
                            let penciledDigitskl = sudokuBoard.getCenterDigits (k, l);
                            // ensure it has penciled digits
                            // if not, then something went wrong somewhere
                            if (!(penciledDigitskl.length > 0))
                                continue;
                            // ensure it has 3 or less digits
                            // if not, then it isnt a part of a naked triple, so move on
                            if (!(penciledDigitskl.length <= 3))
                                continue;
                            // ensure that we are still looking at a max of 3 different possible digits
                            // if more than 3 different digits to choose from,
                            // then those cells cannot be triples
                            triple_digits1 = new Set ([...triple_digits0, ...penciledDigitskl]);
                            if (triple_digits1.size > 3)
                                continue;

                            // then find a third matching cell with the same 3 penciled in digits
                            let next_col1 = l+1;
                            for (let m = k; m < (boxi+1)*sudokuBoard.boxRows; ++m)
                            {
                                // reset column index if we advanced to next row
                                if (m!=k) next_col1 = boxj*sudokuBoard.boxCols;
                                for (let n = next_col1; n < (boxj+1)*sudokuBoard.boxCols; ++n)
                                {
                                    // ensure digit is not filled in already
                                    if (sudokuBoard.board[m][n] != EMPTY_CELL)
                                        continue;
                                    let penciledDigitsmn = sudokuBoard.getCenterDigits (m, n);
                                    // ensure it has penciled digits
                                    // if not, then something went wrong somewhere
                                    if (!(penciledDigitsmn.length > 0))
                                        continue;
                                    // ensure it has 3 or less digits
                                    // if not, then it isnt a part of a naked triple, so move on
                                    if (!(penciledDigitsmn.length <= 3))
                                        continue;
                                    // ensure that we are still looking at a max of 3 *different* possible digits
                                    // if more than 3 different digits to choose from,
                                    // then those cells cannot be triples
                                    triple_digits2 = new Set ([...triple_digits1, ...penciledDigitsmn]);
                                    if (triple_digits2.size > 3)
                                        continue;
                                        
                                    // reaches here if we have 3 cells that have the same 3 possible digits
                                    // so we have a triple!
                                    // let's highlight it!
                                    sudokuBoard.cellColors[i][j][COLOR_GREEN] = 1;
                                    sudokuBoard.cellColors[k][l][COLOR_GREEN] = 1;
                                    sudokuBoard.cellColors[m][n][COLOR_GREEN] = 1;
                                    // since this triple exists, we know that none of these digits
                                    // can appear in other cells in this box
                                    // so lets remove any pencilmarks
                                    for (let ii = boxi*sudokuBoard.boxRows; ii < (boxi+1)*sudokuBoard.boxRows; ++ii)
                                    {
                                        for (let jj = boxj*sudokuBoard.boxCols; jj < (boxj+1)*sudokuBoard.boxCols; ++jj)
                                        {
                                            // ensure this cell is not one of the triple cells
                                            if (!(!(i==ii&&j==jj) && !(k==ii&&l==jj) && !(m==ii&&n==jj)))
                                                continue;
                                            // remove triple's digits if it exists
                                            let hasReduced = false;
                                            let penciledDigitsiijj = sudokuBoard.getCenterDigits (ii, jj);
                                            for (const triple_digit of triple_digits2)
                                            {
                                                // includes triple's digits
                                                if (penciledDigitsiijj.includes (triple_digit))
                                                {
                                                    sudokuBoard.centerDigits[ii][jj][triple_digit] = 0;
                                                    // highlight this cell so we know we deleted stuff
                                                    sudokuBoard.cellColors[ii][jj][COLOR_RED] = 1;
                                                    hasReduced = true;
                                                }
                                            }
                                            // if we didnt reduce a digit, then color the cell yellow
                                            if (!hasReduced)
                                            {
                                                sudokuBoard.cellColors[ii][jj][COLOR_YELLOW] = 1;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    editMode = MODE_SOLVER;
    return true;
}

//========================================================================

// for each digit, d0
//    loop over region
//       reject d0 if it is already filled in
//       reject d0 if it can be in >3 cells in the region
//    if digit is not rejected, then move on to next digit
//    for each next digit, d1
//       loop over region
//          reject second digit if it is already filled in
//          reject second digit if it can be in >3 cells in the region
//       reject second digit if second digit possible cells + first digit possible cells is >3 different cells
//       for each next digit, d2
//          loop over region
//             reject third digit if it is already filled in
//             reject third digit if it can be in >3 cells in the region
//          reject third digit if combined with first and second results in >3 cells
//          reaches here if we found 3 digits (d0,d1,d2) that occupy a total of 3 cells
//          this is a triple so isolate it if there are other digits in those cells




// searches for hidden triples of digits and isolates them 
// by removing other penciled digits from the triple's cells
function hiddenTriplesInRow ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_SMALL;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    // for each row
    for (let i = 0; i < sudokuBoard.rows; ++i)
    {
        // we need 3 digits that mutually occupy the same 3 cells in the same row
        // lets start with finding a first digit that occupies 3 or less cells
        // for each digit
        for (let d0 = sudokuBoard.low; d0 < sudokuBoard.high; ++d0)
        {
            // find possible positions of this digit in this row
            let isAlreadyFilledIn = false;
            let possibleCellsd0 = [];
            for (let j = 0; j < sudokuBoard.cols; ++j)
            {
                // this is a possible location
                // if d0 is penciled here
                // and as long as this cell isnt already filled in
                if (sudokuBoard.centerDigits[i][j][d0] == 1 && sudokuBoard.board[i][j] == EMPTY_CELL)
                    possibleCellsd0.push (j);

                // we can also ignore if d0 was already filled in this row
                if (sudokuBoard.board[i][j] == d0)
                {
                    isAlreadyFilledIn = true;
                    break;
                }
            }
            // ensure digit wasnt already filled in
            if (isAlreadyFilledIn) continue;
            // ensure this digit has 3 or less valid locations (to make a triple)
            if (possibleCellsd0.length > 3) continue;
            // reaches here if this digit can only go in 3 or less locations in this row
            // highlight those positions
            // for (const location of possibleCellsd0)
            //     sudokuBoard.cellColors[i][location][COLOR_BLUE] = 1;
            // mark the digit
            for (const location of possibleCellsd0)
                sudokuBoard.topDigits[i][location][d0] = 1;

            // d0 could be a part of a triple, lets look for another possible triple digit
            // for each next digit, d1
            for (let d1 = d0+1; d1 < sudokuBoard.high; ++d1)
            {
                // find possible positions of this digit in this row
                let isAlreadyFilledIn = false;
                let possibleCellsd1 = [];
                for (let j = 0; j < sudokuBoard.cols; ++j)
                {
                    // this is a possible location
                    // if d1 is penciled here
                    if (sudokuBoard.centerDigits[i][j][d1] == 1 && sudokuBoard.board[i][j] == EMPTY_CELL)
                        possibleCellsd1.push (j);

                    // we can also ignore if d1 was already filled in this row
                    if (sudokuBoard.board[i][j] == d1)
                    {
                        isAlreadyFilledIn = true;
                        break;
                    }
                }
                // ensure digit wasnt already filled in
                if (isAlreadyFilledIn) continue;
                // ensure this digit has 3 or less valid locations (to make a triple)
                if (possibleCellsd1.length > 3) continue;
                // reaches here if this digit can only go in 3 or less locations in this row
                // ensure that this digit shares the same cells as d0, reject if not
                let possibleCellsd0d1 = new Set([...possibleCellsd0, ...possibleCellsd1]);
                if (possibleCellsd0d1.size > 3) continue;

                // reaches here if d0 and d1 occupy a max of 3 different cells
                // highlight those positions
                // for (const location of possibleCellsd1)
                //     sudokuBoard.cellColors[i][location][COLOR_PURPLE] = 1;
                // mark the digit
                for (const location of possibleCellsd1)
                    sudokuBoard.topDigits[i][location][d1] = 1;

                // look for third digit to complete the triple
                // for each next digit, d2
                for (let d2 = d1+1; d2 < sudokuBoard.high; ++d2)
                {
                    // find possible positions of this digit in this row
                    let isAlreadyFilledIn = false;
                    let possibleCellsd2 = [];
                    for (let j = 0; j < sudokuBoard.cols; ++j)
                    {
                        // this is a possible location
                        // if d2 is penciled here
                        if (sudokuBoard.centerDigits[i][j][d2] == 1 && sudokuBoard.board[i][j] == EMPTY_CELL)
                            possibleCellsd2.push (j);

                        // we can also ignore if d2 was already filled in this row
                        if (sudokuBoard.board[i][j] == d2)
                        {
                            isAlreadyFilledIn = true;
                            break;
                        }
                    }
                    // ensure digit wasnt already filled in
                    if (isAlreadyFilledIn) continue;
                    // ensure this digit has 3 or less valid locations (to make a triple)
                    if (possibleCellsd2.length > 3) continue;
                    // reaches here if this digit can only go in 3 or less locations in this row
                    // ensure that this digit shares the same cells as d0 and d1, reject if not
                    let possibleCellsd0d1d2 = new Set([...possibleCellsd0, ...possibleCellsd1, ...possibleCellsd2]);
                    if (possibleCellsd0d1d2.size > 3) continue;

                    // reaches here if d0, d1, and d2 occupy a max of 3 different cells
                    // highlight d2's positions
                    // for (const location of possibleCellsd2)
                    //     sudokuBoard.cellColors[i][location][COLOR_ORANGE] = 1;
                    // mark d2 with top digits
                    for (const location of possibleCellsd2)
                        sudokuBoard.topDigits[i][location][d2] = 1;
                    
                    // this is a triple so isolate it if there are other digits in those cells
                    for (const cellj of possibleCellsd0d1d2)
                    {
                        // zero out any non-triple digits
                        for (let d = sudokuBoard.low; d < sudokuBoard.high; ++d)
                        {
                            // leave triple digits alone
                            if (!(d != d0 && d != d1 && d != d2)) continue;

                            // ensure digit was penciled in
                            if (sudokuBoard.centerDigits[i][cellj][d] == 0) continue;

                            // reaches here if digit, d, is penciled in and not a triple digit
                            // we need to remove this digit to isolate the triple
                            sudokuBoard.centerDigits[i][cellj][d] = 0;
                            // mark cell as red to denote that a digit was removed
                            sudokuBoard.cellColors[i][cellj][COLOR_RED] = 1;
                        }

                        // highlight triple cell
                        sudokuBoard.cellColors[i][cellj][COLOR_GREEN] = 1;
                    }
                }
            }
        }
    }

    editMode = MODE_SOLVER;
    return true;
}

//========================================================================

// searches for hidden triples of digits and isolates them 
// by removing other penciled digits from the triple's cells
function hiddenTriplesInCol ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_SMALL;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    // for each column
    for (let j = 0; j < sudokuBoard.cols; ++j)
    {
        // we need 3 digits that mutually occupy the same 3 cells in the same column
        // lets start with finding a first digit that occupies 3 or less cells
        // for each digit
        for (let d0 = sudokuBoard.low; d0 < sudokuBoard.high; ++d0)
        {
            // find possible positions of this digit in this column
            let isAlreadyFilledIn = false;
            let possibleCellsd0 = [];
            for (let i = 0; i < sudokuBoard.cols; ++i)
            {
                // this is a possible location
                // if d0 is penciled here
                // and as long as this cell isnt already filled in
                if (sudokuBoard.centerDigits[i][j][d0] == 1 && sudokuBoard.board[i][j] == EMPTY_CELL)
                    possibleCellsd0.push (i);

                // we can also ignore if d0 was already filled in this row
                if (sudokuBoard.board[i][j] == d0)
                {
                    isAlreadyFilledIn = true;
                    break;
                }
            }
            // ensure digit wasnt already filled in
            if (isAlreadyFilledIn) continue;
            // ensure this digit has 3 or less valid locations (to make a triple)
            if (possibleCellsd0.length > 3) continue;
            // reaches here if this digit can only go in 3 or less locations in this column
            // highlight those positions
            // for (const location of possibleCellsd0)
            //     sudokuBoard.cellColors[location][j][COLOR_BLUE] = 1;
            // mark the digit
            for (const location of possibleCellsd0)
                sudokuBoard.topDigits[location][j][d0] = 1;

            // d0 could be a part of a triple, lets look for another possible triple digit
            // for each next digit, d1
            for (let d1 = d0+1; d1 < sudokuBoard.high; ++d1)
            {
                // find possible positions of this digit in this row
                let isAlreadyFilledIn = false;
                let possibleCellsd1 = [];
                for (let i = 0; i < sudokuBoard.cols; ++i)
                {
                    // this is a possible location
                    // if d1 is penciled here
                    if (sudokuBoard.centerDigits[i][j][d1] == 1 && sudokuBoard.board[i][j] == EMPTY_CELL)
                        possibleCellsd1.push (i);

                    // we can also ignore if d1 was already filled in this row
                    if (sudokuBoard.board[i][j] == d1)
                    {
                        isAlreadyFilledIn = true;
                        break;
                    }
                }
                // ensure digit wasnt already filled in
                if (isAlreadyFilledIn) continue;
                // ensure this digit has 3 or less valid locations (to make a triple)
                if (possibleCellsd1.length > 3) continue;
                // reaches here if this digit can only go in 3 or less locations in this column
                // ensure that this digit shares the same cells as d0, reject if not
                let possibleCellsd0d1 = new Set([...possibleCellsd0, ...possibleCellsd1]);
                if (possibleCellsd0d1.size > 3) continue;

                // reaches here if d0 and d1 occupy a max of 3 different cells
                // highlight those positions
                // for (const location of possibleCellsd1)
                //     sudokuBoard.cellColors[location][j][COLOR_PURPLE] = 1;
                // mark the digit
                for (const location of possibleCellsd1)
                    sudokuBoard.topDigits[location][j][d1] = 1;

                // look for third digit to complete the triple
                // for each next digit, d2
                for (let d2 = d1+1; d2 < sudokuBoard.high; ++d2)
                {
                    // find possible positions of this digit in this column
                    let isAlreadyFilledIn = false;
                    let possibleCellsd2 = [];
                    for (let i = 0; i < sudokuBoard.cols; ++i)
                    {
                        // this is a possible location
                        // if d2 is penciled here
                        if (sudokuBoard.centerDigits[i][j][d2] == 1 && sudokuBoard.board[i][j] == EMPTY_CELL)
                            possibleCellsd2.push (i);

                        // we can also ignore if d2 was already filled in this row
                        if (sudokuBoard.board[i][j] == d2)
                        {
                            isAlreadyFilledIn = true;
                            break;
                        }
                    }
                    // ensure digit wasnt already filled in
                    if (isAlreadyFilledIn) continue;
                    // ensure this digit has 3 or less valid locations (to make a triple)
                    if (possibleCellsd2.length > 3) continue;
                    // reaches here if this digit can only go in 3 or less locations in this column
                    // ensure that this digit shares the same cells as d0 and d1, reject if not
                    let possibleCellsd0d1d2 = new Set([...possibleCellsd0, ...possibleCellsd1, ...possibleCellsd2]);
                    if (possibleCellsd0d1d2.size > 3) continue;

                    // reaches here if d0, d1, and d2 occupy a max of 3 different cells
                    // highlight d2's positions
                    // for (const location of possibleCellsd2)
                    //     sudokuBoard.cellColors[location][j][COLOR_ORANGE] = 1;
                    // mark d2 with top digits
                    for (const location of possibleCellsd2)
                        sudokuBoard.topDigits[location][j][d2] = 1;
                    
                    // this is a triple so isolate it if there are other digits in those cells
                    for (const celli of possibleCellsd0d1d2)
                    {
                        // zero out any non-triple digits
                        for (let d = sudokuBoard.low; d < sudokuBoard.high; ++d)
                        {
                            // leave triple digits alone
                            if (!(d != d0 && d != d1 && d != d2)) continue;

                            // ensure digit was penciled in
                            if (sudokuBoard.centerDigits[celli][j][d] == 0) continue;

                            // reaches here if digit, d, is penciled in and not a triple digit
                            // we need to remove this digit to isolate the triple
                            sudokuBoard.centerDigits[celli][j][d] = 0;
                            // mark cell as red to denote that a digit was removed
                            sudokuBoard.cellColors[celli][j][COLOR_RED] = 1;
                        }

                        // highlight triple cell
                        sudokuBoard.cellColors[celli][j][COLOR_GREEN] = 1;
                    }
                }
            }
        }
    }

    editMode = MODE_SOLVER;
    return true;
}

//========================================================================

// searches for hidden pairs of digits and isolates them 
// by removing other penciled digits from the triple's cells
function hiddenTriplesInBox ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_SMALL;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    // for each box
    for (let boxi = 0; boxi < sudokuBoard.boxRows; ++boxi)
    {
        for (let boxj = 0; boxj < sudokuBoard.boxCols; ++boxj)
        {
            // we need 3 digits that mutually occupy the same 3 cells in the same box
            // lets start with finding a first digit that occupies 3 or less cells
            // for each digit
            for (let d0 = sudokuBoard.low; d0 < sudokuBoard.high; ++d0)
            {
                // find possible positions of this digit in this box
                let isAlreadyFilledIn = false;
                let possibleCellsd0 = [];
                for (let i = boxi*sudokuBoard.boxRows; i < (boxi+1)*sudokuBoard.boxRows; ++i)
                {
                    for (let j = boxj*sudokuBoard.boxCols; j < (boxj+1)*sudokuBoard.boxCols; ++j)
                    {
                        // this is a possible location
                        // if d0 is penciled here
                        // and as long as this cell isnt already filled in
                        if (sudokuBoard.centerDigits[i][j][d0] == 1 && sudokuBoard.board[i][j] == EMPTY_CELL)
                            possibleCellsd0.push ([i,j]);
        
                        // we can also ignore if d0 was already filled in this row
                        if (sudokuBoard.board[i][j] == d0)
                        {
                            isAlreadyFilledIn = true;
                            break;
                        }
                    }
                }
                // ensure digit wasnt already filled in
                if (isAlreadyFilledIn) continue;
                // ensure this digit has 3 or less valid locations (to make a triple)
                if (possibleCellsd0.length > 3) continue;
                // reaches here if this digit can only go in 3 or less locations in this row
                // highlight those positions
                // for (const location of possibleCellsd0)
                //     sudokuBoard.cellColors[i][location][COLOR_BLUE] = 1;
                // mark the digit
                for (const [celli, cellj] of possibleCellsd0)
                    sudokuBoard.topDigits[celli][cellj][d0] = 1;
    
                // d0 could be a part of a triple, lets look for another possible triple digit
                // for each next digit, d1
                for (let d1 = d0+1; d1 < sudokuBoard.high; ++d1)
                {
                    // find possible positions of this digit in this row
                    let isAlreadyFilledIn = false;
                    let possibleCellsd1 = [];
                    for (let i = boxi*sudokuBoard.boxRows; i < (boxi+1)*sudokuBoard.boxRows; ++i)
                    {
                        for (let j = boxj*sudokuBoard.boxCols; j < (boxj+1)*sudokuBoard.boxCols; ++j)
                        {
                            // this is a possible location
                            // if d1 is penciled here
                            // and as long as this cell isnt already filled in
                            if (sudokuBoard.centerDigits[i][j][d1] == 1 && sudokuBoard.board[i][j] == EMPTY_CELL)
                                possibleCellsd1.push ([i,j]);
            
                            // we can also ignore if d1 was already filled in this row
                            if (sudokuBoard.board[i][j] == d1)
                            {
                                isAlreadyFilledIn = true;
                                break;
                            }
                        }
                    }
                    // ensure digit wasnt already filled in
                    if (isAlreadyFilledIn) continue;
                    // ensure this digit has 3 or less valid locations (to make a triple)
                    if (possibleCellsd1.length > 3) continue;
                    // reaches here if this digit can only go in 3 or less locations in this row
                    // ensure that this digit shares the same cells as d0, reject if not
                    let possibleCellsd0d1 = new Set([...possibleCellsd0]);
                    // add to set ensuring no duplicates - Sets cant handle checking list elements
                    for (const [celli_d1, cellj_d1] of possibleCellsd1)
                    {
                        // check if it is already in set
                        let alreadyExists = false;
                        for (const [celli, cellj] of possibleCellsd0d1)
                        {
                            if (celli == celli_d1 && cellj == cellj_d1)
                            {
                                alreadyExists = true;
                                break;
                            }
                        }
                        // if not in set, add it
                        if (alreadyExists) continue;
                        possibleCellsd0d1.add ([celli_d1, cellj_d1]);
                    }
                    if (possibleCellsd0d1.size > 3) continue;
    
                    // reaches here if d0 and d1 occupy a max of 3 different cells
                    // highlight those positions
                    // for (const location of possibleCellsd1)
                    //     sudokuBoard.cellColors[i][location][COLOR_PURPLE] = 1;
                    // mark the digit
                    for (const [celli, cellj] of possibleCellsd1)
                        sudokuBoard.topDigits[celli][cellj][d1] = 1;
    
                    // look for third digit to complete the triple
                    // for each next digit, d2
                    for (let d2 = d1+1; d2 < sudokuBoard.high; ++d2)
                    {
                        // find possible positions of this digit in this row
                        let isAlreadyFilledIn = false;
                        let possibleCellsd2 = [];
                        for (let i = boxi*sudokuBoard.boxRows; i < (boxi+1)*sudokuBoard.boxRows; ++i)
                        {
                            for (let j = boxj*sudokuBoard.boxCols; j < (boxj+1)*sudokuBoard.boxCols; ++j)
                            {
                                // this is a possible location
                                // if d2 is penciled here
                                // and as long as this cell isnt already filled in
                                if (sudokuBoard.centerDigits[i][j][d2] == 1 && sudokuBoard.board[i][j] == EMPTY_CELL)
                                    possibleCellsd2.push ([i,j]);
                
                                // we can also ignore if d2 was already filled in this row
                                if (sudokuBoard.board[i][j] == d2)
                                {
                                    isAlreadyFilledIn = true;
                                    break;
                                }
                            }
                        }
                        // ensure digit wasnt already filled in
                        if (isAlreadyFilledIn) continue;
                        // ensure this digit has 3 or less valid locations (to make a triple)
                        if (possibleCellsd2.length > 3) continue;
                        // reaches here if this digit can only go in 3 or less locations in this row
                        // ensure that this digit shares the same cells as d0 and d1, reject if not
                        let possibleCellsd0d1d2 = new Set([...possibleCellsd0]);
                        // add to set ensuring no duplicates - Sets cant handle checking list elements
                        for (const [celli_d1, cellj_d1] of possibleCellsd1)
                        {
                            // check if it is already in set
                            let alreadyExists = false;
                            for (const [celli, cellj] of possibleCellsd0d1d2)
                            {
                                if (celli == celli_d1 && cellj == cellj_d1)
                                {
                                    alreadyExists = true;
                                    break;
                                }
                            }
                            // if not in set, add it
                            if (alreadyExists) continue;
                            possibleCellsd0d1d2.add ([celli_d1, cellj_d1]);
                        }
                        for (const [celli_d2, cellj_d2] of possibleCellsd2)
                        {
                            // check if it is already in set
                            let alreadyExists = false;
                            for (const [celli, cellj] of possibleCellsd0d1d2)
                            {
                                if (celli == celli_d2 && cellj == cellj_d2)
                                {
                                    alreadyExists = true;
                                    break;
                                }
                            }
                            // if not in set, add it
                            if (alreadyExists) continue;
                            possibleCellsd0d1d2.add ([celli_d2, cellj_d2]);
                        }
                        if (possibleCellsd0d1d2.size > 3) continue;
    
                        // reaches here if d0, d1, and d2 occupy a max of 3 different cells
                        // highlight d2's positions
                        // for (const location of possibleCellsd2)
                        //     sudokuBoard.cellColors[i][location][COLOR_ORANGE] = 1;
                        // mark d2 with top digits
                        for (const [celli, cellj] of possibleCellsd2)
                            sudokuBoard.topDigits[celli][cellj][d2] = 1;
                        
                        // this is a triple so isolate it if there are other digits in those cells
                        for (const [celli, cellj] of possibleCellsd0d1d2)
                        {
                            // zero out any non-triple digits
                            for (let d = sudokuBoard.low; d < sudokuBoard.high; ++d)
                            {
                                // leave triple digits alone
                                if (!(d != d0 && d != d1 && d != d2)) continue;
    
                                // ensure digit was penciled in
                                if (sudokuBoard.centerDigits[celli][cellj][d] == 0) continue;
    
                                // reaches here if digit, d, is penciled in and not a triple digit
                                // we need to remove this digit to isolate the triple
                                sudokuBoard.centerDigits[celli][cellj][d] = 0;
                                // mark cell as red to denote that a digit was removed
                                sudokuBoard.cellColors[celli][cellj][COLOR_RED] = 1;
                            }
    
                            // highlight triple cell
                            sudokuBoard.cellColors[celli][cellj][COLOR_GREEN] = 1;
                        }
                    }
                }
            }
        }
    }


    editMode = MODE_SOLVER;
    return true;
}

//========================================================================

// determines a set of cells where each digit must go in a row
// if the only possible positions for a digit in a row lie in the same box,
// then we know that digit must go in those cells so we call that a "must" digit for those cells
// and we can then eliminate that digit from other cells in that box
// ** i believe this is referred to as locked candidates
function lockedDigitInRow ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_COLOR;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    // check each digit
    for (let d = sudokuBoard.low; d < sudokuBoard.high; ++d)
    {
        // check each row
        for (let i = 0; i < sudokuBoard.rows; ++i)
        {
            let alreadyFilledIn = false;
            // where can d go in this box?
            let possibleLocationsJ = [];
            // check each column 
            for (let j = 0; j < sudokuBoard.cols; ++j)
            {
                // check if this is a valid position for this digit
                if (sudokuBoard.centerDigits[i][j][d] && sudokuBoard.board[i][j] == EMPTY_CELL)
                {
                    possibleLocationsJ.push (j);
                }
                // ignore digit if it is already filled-in the box
                if (sudokuBoard.board[i][j] == d) alreadyFilledIn = true;
            }
            // ignore this row if digit is already filled in
            if (alreadyFilledIn) continue;
            // ensure digit has valid positions
            if (possibleLocationsJ.length == 0) continue;
            // ensure possible locations are in a single box
            let isInSameBox = true;
            let boxi = Math.floor(i / sudokuBoard.boxRows);
            let boxj = Math.floor(possibleLocationsJ[0] / sudokuBoard.boxCols);
            for (let j = 0; j < possibleLocationsJ.length; ++j)
            {
                let boxjj = Math.floor(possibleLocationsJ[j] / sudokuBoard.boxCols);
                if (boxjj != boxj)
                    isInSameBox = false;
            }
            if (!isInSameBox) continue;
            // each possible location is in the same box
            // we can remove this digit from non-intersecting cells in the box
            let hasReduced = false;
            for (let ii = boxi*sudokuBoard.boxRows; ii < (boxi+1)*sudokuBoard.boxRows; ++ii)
            {
                for (let jj = boxj*sudokuBoard.boxCols; jj < (boxj+1)*sudokuBoard.boxCols; ++jj)
                {
                    // highlight cells from the same box
                    // sudokuBoard.cellColors[ii][jj][COLOR_PURPLE] = 1;
                    // ensure it is not an intersecting cell
                    let isIntersectingCell = false;
                    for (let j = 0; j < possibleLocationsJ.length; ++j)
                        if (jj == possibleLocationsJ[j] && i == ii)
                            isIntersectingCell = true;
                    if (isIntersectingCell) continue;
                    // this cell is not one of the intersecting cells
                    // ensure the digit is penciled in, to highlight and remove it
                    if (sudokuBoard.centerDigits[ii][jj][d] != 1) continue;
                    sudokuBoard.cellColors[ii][jj][COLOR_RED] = 1;
                    // remove digit
                    sudokuBoard.centerDigits[ii][jj][d] = 0;
                    // we removed a digit so we have reduced
                    hasReduced = true;
                }
            }
            // highlight intersecting cells that caused the reduction
            // if there was a reduction
            if (hasReduced)
            {
                // highlight row
                for (let j = 0; j < sudokuBoard.cols; ++j)
                {
                    // ensure it isnt one of intersecting cells
                    if (possibleLocationsJ.includes(j)) continue;
                    sudokuBoard.cellColors[i][j][COLOR_YELLOW] = 1;
                }

                // highlight intersecting cells
                for (let j = 0; j < possibleLocationsJ.length; ++j)
                {
                    // highlight cell
                    editMode = MODE_COLOR;
                    sudokuBoard.cellColors[i][possibleLocationsJ[j]][COLOR_GREEN] = 1;
                    // use top digits to denote which digit
                    sudokuBoard.topDigits[i][possibleLocationsJ[j]][d] = 1;
                }
            }
        }
    }

    editMode = MODE_SOLVER;
}

//========================================================================

// determines a set of cells where each digit must go in a column
// if the only possible positions for a digit in a column lie in the same box,
// then we know that digit must go in those cells so we call that a "must" digit for those cells
// and we can then eliminate that digit from other cells in that box
function lockedDigitInCol ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_COLOR;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    // check each digit
    for (let d = sudokuBoard.low; d < sudokuBoard.high; ++d)
    {
        // check each col
        for (let j = 0; j < sudokuBoard.cols; ++j)
        {
            let alreadyFilledIn = false;
            // where can d go in this col?
            let possibleLocationsI = [];
            // check each row 
            for (let i = 0; i < sudokuBoard.rows; ++i)
            {
                // check if this is a valid position for this digit
                if (sudokuBoard.centerDigits[i][j][d] && sudokuBoard.board[i][j] == EMPTY_CELL)
                {
                    possibleLocationsI.push (i);
                }
                // ignore digit if it is already filled-in the box
                if (sudokuBoard.board[i][j] == d) alreadyFilledIn = true;
            }
            // ignore this row if digit is already filled in
            if (alreadyFilledIn) continue;
            // ensure digit has valid positions
            if (possibleLocationsI.length == 0) continue;
            // ensure possible locations are in a single box
            let isInSameBox = true;
            let boxi = Math.floor(possibleLocationsI[0] / sudokuBoard.boxRows);
            let boxj = Math.floor(j / sudokuBoard.boxCols);
            for (let i = 0; i < possibleLocationsI.length; ++i)
            {
                let boxii = Math.floor(possibleLocationsI[i] / sudokuBoard.boxRows);
                if (boxii != boxi)
                    isInSameBox = false;
            }
            if (!isInSameBox) continue;
            // each possible location is in the same box
            // we can remove this digit from non-intersecting cells in the box
            let hasReduced = false;
            for (let ii = boxi*sudokuBoard.boxRows; ii < (boxi+1)*sudokuBoard.boxRows; ++ii)
            {
                for (let jj = boxj*sudokuBoard.boxCols; jj < (boxj+1)*sudokuBoard.boxCols; ++jj)
                {
                    // highlight cells from the same box
                    // sudokuBoard.cellColors[ii][jj][COLOR_PURPLE] = 1;
                    // ensure it is not an intersecting cell
                    let isIntersectingCell = false;
                    for (let i = 0; i < possibleLocationsI.length; ++i)
                        if (ii == possibleLocationsI[i] && j == jj)
                            isIntersectingCell = true;
                    if (isIntersectingCell) continue;
                    // this cell is not one of the intersecting cells
                    // ensure the digit is penciled in, to highlight and remove it
                    if (sudokuBoard.centerDigits[ii][jj][d] != 1) continue;
                    sudokuBoard.cellColors[ii][jj][COLOR_RED] = 1;
                    // remove digit
                    sudokuBoard.centerDigits[ii][jj][d] = 0;
                    // we removed a digit so we have reduced
                    hasReduced = true;
                }
            }
            // highlight intersecting cells that caused the reduction
            // if there was a reduction
            if (hasReduced)
            {
                // highlight col
                for (let i = 0; i < sudokuBoard.rows; ++i)
                {
                    // ensure it isnt one of intersecting cells
                    if (possibleLocationsI.includes(i)) continue;
                    sudokuBoard.cellColors[i][j][COLOR_YELLOW] = 1;
                }

                // highlight intersecting cells
                for (let i = 0; i < possibleLocationsI.length; ++i)
                {
                    // highlight cell
                    editMode = MODE_COLOR;
                    sudokuBoard.cellColors[possibleLocationsI[i]][j][COLOR_GREEN] = 1;
                    // use top digits to denote which digit
                    sudokuBoard.topDigits[possibleLocationsI[i]][j][d] = 1;
                }
            }
        }
    }

    editMode = MODE_SOLVER;
}

//========================================================================

// determines a set of cells where each digit must go for each box
// This highlights digits that must occur in a single row or column of the box
// so that we can eliminate the digit from the rest of the cells from that row or col
function lockedDigitInBox ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_COLOR;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();
    
    for (let boxi = 0; boxi < sudokuBoard.boxRows; ++boxi)
    {
        for (let boxj = 0; boxj < sudokuBoard.boxCols; ++boxj)
        {
            for (let d = sudokuBoard.low; d < sudokuBoard.high; ++d)
            {
                let alreadyFilledIn = false;
                // where can d go in this box?
                let possibleLocationsI = [];
                let possibleLocationsJ = [];
                for (let i = boxi*sudokuBoard.boxRows; i < (boxi+1)*sudokuBoard.boxRows; ++i)
                {
                    for (let j = boxj*sudokuBoard.boxCols; j < (boxj+1)*sudokuBoard.boxCols; ++j)
                    {
                        // check if this digit is possible
                        // and ensure it is not filled in already
                        if (sudokuBoard.centerDigits[i][j][d] && sudokuBoard.board[i][j] == EMPTY_CELL) 
                        {
                            possibleLocationsI.push (i);
                            possibleLocationsJ.push (j);
                        }
                        // ignore digit if it is already filled-in the box
                        if (sudokuBoard.board[i][j] == d) alreadyFilledIn = true;
                    }
                }
                // ensure digit isnt already filled in
                if (alreadyFilledIn) continue;
                // ensure digit has valid positions
                if (possibleLocationsI.length == 0) continue;
                // check if possible locations are in a row or column
                // we're in the same row if all i's are the same
                let isInRow = true;
                // we're in the same col if all j's are the same
                let isInCol = true;
                let prevLocation = [possibleLocationsI[0], possibleLocationsJ[0]];
                for (let k = 0; k < possibleLocationsI.length; ++k)
                {
                    // ensure location is in row with others
                    if (prevLocation[0] != possibleLocationsI[k]) isInRow = false;
                    // ensure location is in col with others
                    if (prevLocation[1] != possibleLocationsJ[k]) isInCol = false;
                    prevLocation = [possibleLocationsI[k], possibleLocationsJ[k]];
                }
                // If the only possible cells for digit, d, are in a row, 
                // then we can eliminate this digit from the other cells in this row
                let hasReduced = false;
                if (isInRow && !isInCol)
                {
                    // eliminate digit, d, from non-intersecting cells
                    for (let j = 0; j < sudokuBoard.cols; ++j)
                    {
                        // ensure we are looking at a non-intersecting cell
                        if (!possibleLocationsJ.includes (j))
                        {
                            // check if this other cell contains d
                            if (sudokuBoard.board[possibleLocationsI[0]][j] == EMPTY_CELL && sudokuBoard.centerDigits[possibleLocationsI[0]][j][d] == 1)
                            {
                                editMode = MODE_COLOR;
                                sudokuBoard.cellColors[possibleLocationsI[0]][j][COLOR_RED] = 1;
                                // remove the digit
                                editMode = MODE_PENCIL;
                                sudokuBoard.centerDigits[possibleLocationsI[0]][j][d] = 0;
                                hasReduced = true;
                            }
                        }
                    }
                }
                // If the only possible cells for digit, d, are in a col, 
                // then we can eliminate this digit from the other cells in this col
                if (!isInRow && isInCol) 
                {
                    // eliminate digit, d, from non-intersecting cells
                    for (let i = 0; i < sudokuBoard.rows; ++i)
                    {
                        // ensure we are looking at a non-intersecting cell
                        if (!possibleLocationsI.includes (i))
                        {
                            // check if this other cell contains d
                            if (sudokuBoard.board[i][possibleLocationsJ[0]] == EMPTY_CELL && sudokuBoard.centerDigits[i][possibleLocationsJ[0]][d] == 1)
                            {
                                editMode = MODE_COLOR;
                                sudokuBoard.cellColors[i][possibleLocationsJ[0]][COLOR_RED] = 1;
                                // remove the digit
                                editMode = MODE_PENCIL;
                                sudokuBoard.centerDigits[i][possibleLocationsJ[0]][d] = 0;
                                hasReduced = true;
                            }
                        }
                    }
                }
                // mark where d must go and highlight it
                // if these cells lead to a reduction
                if (hasReduced)
                {
                    // highlight box
                    for (let i = boxi*sudokuBoard.boxRows; i < (boxi+1)*sudokuBoard.boxRows; ++i)
                    {
                        for (let j = boxj*sudokuBoard.boxCols; j < (boxj+1)*sudokuBoard.boxCols; ++j)
                        {
                            // ensure it isnt the possible locations
                            if (possibleLocationsI.includes(i) && possibleLocationsJ.includes(j)) continue;
                            sudokuBoard.cellColors[i][j][COLOR_YELLOW] = 1;
                        }
                    }
                    // highlight intersecting cells
                    for (let k = 0; k < possibleLocationsI.length; ++k)
                    {
                        editMode = MODE_TOP;
                        sudokuBoard.selectedCells[possibleLocationsI[k]][possibleLocationsJ[k]] = 1;
                        sudokuBoard.inputDigit (d);
                        sudokuBoard.selectedCells[possibleLocationsI[k]][possibleLocationsJ[k]] = 0;
                        // highlight cell
                        sudokuBoard.cellColors[possibleLocationsI[k]][possibleLocationsJ[k]][COLOR_GREEN] = 1;
                    }
                }
            }
        }
    }
    
    editMode = MODE_SOLVER;
}

//========================================================================

function restrictDominoes ()
{
    for (let i = 0; i < sudokuBoard.rows; ++i)
    {
        for (let j = 0; j < sudokuBoard.cols; ++j)
        {
            // ignore if already filled in
            if (sudokuBoard.board[i][j] != EMPTY_CELL)
                continue;

            for (let domino_dir = 0; domino_dir < 4; ++domino_dir)
            {
                let otheri = i;
                let otherj = j;
                let domino_type = DOMINO_NONE;
                let isNorthWest = false;
                
                // North
                if (domino_dir == 0)
                {
                    otheri = i-1;
                    otherj = j;
                    // ignore if no cell to the north
                    if (otheri < 0)
                        continue;
                    // check North's south - we do not save north dominoes
                    domino_type = sudokuBoard.dominoes[otheri][otherj][DOMINO_SOUTH];
                    isNorthWest = true;
                }

                // East
                else if (domino_dir == 1)
                {
                    otheri = i;
                    otherj = j+1;
                    // ignore if no cell to the east
                    if (otherj >= sudokuBoard.cols)
                        continue;
                    domino_type = sudokuBoard.dominoes[i][j][DOMINO_EAST];
                    isNorthWest =  false;
                }

                // South
                else if (domino_dir == 2)
                {
                    otheri = i+1;
                    otherj = j;
                    // ignore if no cell to the south
                    if (otheri >= sudokuBoard.rows)
                        continue;
                    domino_type = sudokuBoard.dominoes[i][j][DOMINO_SOUTH];
                    isNorthWest =  false;
                }

                // West
                else if (domino_dir == 3)
                {
                    otheri = i;
                    otherj = j-1;
                    // ignore if no cell to the south
                    if (otherj < 0)
                        continue;
                    // check West's east - we do not save West dominoes
                    domino_type = sudokuBoard.dominoes[otheri][otherj][DOMINO_EAST];
                    isNorthWest = true;
                }

                // ensure we are looking at a domino
                if (domino_type == DOMINO_NONE)
                    continue;

                // ensure both cells are not filled in already
                // a filled in cell wouldnt get solved by this technique
                if (sudokuBoard.board[otheri][otherj] != EMPTY_CELL)
                    continue;

                // ensure that each center digit is valid
                for (let p = sudokuBoard.low; p < sudokuBoard.high; ++p)
                {
                    if (sudokuBoard.centerDigits[i][j][p] == 0) continue;
                    // set this to something in the penciled digits list
                    sudokuBoard.board[i][j] = p;

                    // check if other has valid penciled digits
                    let hasValidDigit = false;
                    for (let pp = sudokuBoard.low; pp < sudokuBoard.high; ++pp)
                    {
                        // ensure the digit is penciled in
                        if (sudokuBoard.centerDigits[otheri][otherj][pp] == 0) continue;
                        let result = sudokuBoard.isDigitValid (otheri, otherj, pp);
                        if (result)
                        {
                            hasValidDigit = true;
                            break;
                        }
                    }

                    // if other has a valid digit, then this is a valid digit
                    // otherwise, we can remove the current digit from the current cell
                    if (!hasValidDigit)
                        sudokuBoard.centerDigits[i][j][p] = 0;

                    // undo what we set
                    sudokuBoard.board[i][j] = EMPTY_CELL;

                } // endfor - for each center digit
            } // endfor - domino direction
        } // endfor - j cols
    } // endfor - i rows
} // endfunction





