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
        for (let i = 0; i < 9; ++i)
        {
            prevBoard.push ([]);
            for (let j = 0; j < 9; ++j)
            {
                prevBoard[i].push (board[i][j]);
            }
        }

        basicSolverPencilDigits ();

        for (let i = 0; i < 10; ++i)
            basicSolverReducePenciledDigits ();

        basicSolverFillDigits ();

        // stop repeating if we are not making progress
        let hasChanged = false;
        for (let i = 0; i < 9; ++i)
            for (let j = 0; j < 9; ++j)
                if (prevBoard[i][j] != board[i][j])
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
    clearSelectedCells ();
    clearTopDigits ();
    clearColors ();

    for (let i = 0; i < 9; ++i)
    {
        for (let j = 0; j < 9; ++j)
        {
            // ensure cell isn't already filled in
            if (board[i][j] == 0)
            {
                // clear previous pencil marks
                selectedCells[i][j] = 1;
                inputDigit (0);
                for (let d = 1; d <= 9; ++d)
                {
                    if (isDigitValid (board, i, j, d))
                    {
                        // pencil in digit
                        inputDigit (d);
                    }
                }
                // deselect cell
                selectedCells[i][j] = 0;
            }
        }
    }

    editMode = MODE_SOLVER;
}

//========================================================================

function basicSolverReducePenciledDigits ()
{
    // clear previous selections
    clearSelectedCells ();

    hiddenSinglesInRow ();
    hiddenSinglesInCol ();
    hiddenSinglesInBox ();
    nakedPairsInRow ();
    nakedPairsInCol ();
    nakedPairsInBox ();
    hiddenPairsInRow ();
    hiddenPairsInCol ();
    hiddenPairsInBox ();
    lockedDigitInRow ();
    lockedDigitInCol ();
    lockedDigitInBox ();

    editMode = MODE_SOLVER;
}

//========================================================================

function basicSolverFillDigits ()
{
    editMode = MODE_PLAY;
    playMode = PLAY_MODE_DIGIT;
    // clear previous selections
    clearSelectedCells ();
    clearTopDigits ();
    clearColors ();

    for (let i = 0; i < 9; ++i)
    {
        for (let j = 0; j < 9; ++j)
        {
            // ensure cell isn't already filled in
            if (board[i][j] == 0)
            {
                // ensure cell only has one penciled in digit
                let numPenciledInDigits = 0;
                let penciledInDigit = 0;
                for (let p = 0; p < 9; ++p)
                {
                    if (pencilMarks[i][j][p] == 1)
                    {
                        numPenciledInDigits++;
                        penciledInDigit = p+1;
                    }
                }
                if (numPenciledInDigits == 1)
                {
                    selectedCells[i][j] = 1;
                    inputDigit (penciledInDigit);
                    selectedCells[i][j] = 0;
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

    clearSelectedCells ();
    clearTopDigits ();
    clearColors ();

    let hasChanged = false;
    for (let i = 0; i < 9; ++i)
    {
        for (let d = 1; d <= 9; ++d)
        {
            let possibleLocations = 0;
            let possibleLocation = 0;
            for (let j = 0; j < 9; ++j)
            {
                // ensure cell isn't already filled in
                if (board[i][j] == 0 && isDigitValid (board, i, j, d))
                {
                    // check to see if digit is penciled in
                    if (pencilMarks[i][j][d-1] == 1)
                    {
                        possibleLocations++;
                        possibleLocation = j;
                    }
                }
            }
            if (possibleLocations == 1)
            {
                // theres only one place that d can go, so place it here
                selectedCells[i][possibleLocation] = 1;
                // clear other pencil marks
                inputDigit (0);
                inputDigit (d);
                selectedCells[i][possibleLocation] = 0;
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

    clearSelectedCells ();
    clearTopDigits ();
    clearColors ();

    let hasChanged = false;
    for (let j = 0; j < 9; ++j)
    {
        for (let d = 1; d <= 9; ++d)
        {
            let possibleLocations = 0;
            let possibleLocation = 0;
            for (let i = 0; i < 9; ++i)
            {
                // ensure cell isn't already filled in
                if (board[i][j] == 0 && isDigitValid (board, i, j, d))
                {
                    // check to see if digit is penciled in
                    if (pencilMarks[i][j][d-1] == 1)
                    {
                        possibleLocations++;
                        possibleLocation = i;
                    }
                }
            }
            if (possibleLocations == 1)
            {
                // theres only one place that d can go, so place it here
                selectedCells[possibleLocation][j] = 1;
                // clear other pencil marks
                inputDigit (0);
                inputDigit (d);
                selectedCells[possibleLocation][j] = 0;
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

    clearSelectedCells ();
    clearTopDigits ();
    clearColors ();

    let hasChanged = false;

    for (let boxi = 0; boxi < 3; ++boxi)
    {
        for (let boxj = 0; boxj < 3; ++boxj)
        {
            for (let d = 1; d <= 9; ++d)
            {
                let possibleLocations = 0;
                let possiblei = 0;
                let possiblej = 0;
                for (let i = 3 * boxi; i < (boxi+1) * 3; ++i)
                {
                    for (let j = 3 * boxj; j < (boxj+1) * 3; ++j)
                    {
                        // ensure cell isn't already filled in
                        // and that this digit is valid here
                        if (board[i][j] == 0 && isDigitValid (board, i, j, d))
                        {
                            // check to see if digit is penciled in
                            if (pencilMarks[i][j][d-1] == 1)
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
                    selectedCells[possiblei][possiblej] = 1;
                    // clear other pencil marks
                    inputDigit (0);
                    inputDigit (d);
                    selectedCells[possiblei][possiblej] = 0;
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

    clearSelectedCells ();
    clearTopDigits ();
    clearColors ();

    // row pairs
    for (let i = 0; i < 9; ++i)
    {
        // first, look for a cell with only two penciled in digits
        for (let j = 0; j < 9; ++j)
        {
            let penciledDigitsj = getPenciledDigits (i, j);
            // ensure it has two digits
            if (penciledDigitsj.length == 2)
            {
                // then find a matching cell with the same two penciled in digits
                for (let k = j+1; k < 9; ++k)
                {
                    let penciledDigitsk = getPenciledDigits (i, k);
                    // ensure it has two digits and matching digits
                    if (penciledDigitsk.length == 2 && penciledDigitsj[0] == penciledDigitsk[0] && penciledDigitsj[1] == penciledDigitsk[1])
                    {
                        // found a pair!
                        cellColors[i][j][COLOR_GREEN-1] = 1;
                        cellColors[i][k][COLOR_GREEN-1] = 1;
                        // highlight this row
                        for (let jj = 0; jj < 9; ++jj)
                        {
                            // ensure it is not one of the pair cells
                            if (jj == j || jj == k) continue;
                            cellColors[i][jj][COLOR_YELLOW-1] = 1;
                        }
                        // since this pair exists, we know that neither of these digits
                        // can appear in other cells in this row
                        // so lets remove any pencilmarks
                        for (let jj = 0; jj < 9; ++jj)
                        {
                            // ensure this cell is not either pairing cell
                            if (j != jj && k != jj)
                            {
                                // remove pair's digits if it exists
                                let penciledDigitsijj = getPenciledDigits (i, jj);
                                for (let x = 0; x < penciledDigitsj.length; ++x)
                                {
                                    if (penciledDigitsijj.includes (penciledDigitsj[x]))
                                    {
                                        pencilMarks[i][jj][penciledDigitsj[x]-1] = 0;
                                        // highlight this cell to denote that it was reduced
                                        cellColors[i][jj][COLOR_RED-1] = 1;
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

    clearSelectedCells ();
    clearTopDigits ();
    clearColors ();

    // column pairs
    for (let j = 0; j < 9; ++j)
    {
        // first, look for a cell with only two penciled in digits
        for (let i = 0; i < 9; ++i)
        {
            let penciledDigitsi = getPenciledDigits (i, j);
            // ensure it has two digits
            if (penciledDigitsi.length == 2)
            {
                // then find a matching cell with the same two penciled in digits
                for (let k = i+1; k < 9; ++k)
                {
                    let penciledDigitsk = getPenciledDigits (k, j);
                    // ensure it has two digits and matching digits
                    if (penciledDigitsk.length == 2 && penciledDigitsi[0] == penciledDigitsk[0] && penciledDigitsi[1] == penciledDigitsk[1])
                    {
                        // found a pair!
                        cellColors[i][j][COLOR_GREEN-1] = 1;
                        cellColors[k][j][COLOR_GREEN-1] = 1;
                        // highlight this column
                        for (let ii = 0; ii < 9; ++ii)
                        {
                            // ensure it is not one of the pair cells
                            if (ii == i || ii == k) continue;
                            cellColors[ii][j][COLOR_YELLOW-1] = 1;
                        }
                        // since this pair exists, we know that neither of these digits
                        // can appear in other cells in this column
                        // so lets remove any pencilmarks
                        for (let ii = 0; ii < 9; ++ii)
                        {
                            // ensure this cell is not either pairing cell
                            if (i != ii && k != ii)
                            {
                                // remove pair's digits if it exists
                                let penciledDigitsiij = getPenciledDigits (ii, j);
                                for (let x = 0; x < penciledDigitsi.length; ++x)
                                {
                                    if (penciledDigitsiij.includes (penciledDigitsi[x]))
                                    {
                                        pencilMarks[ii][j][penciledDigitsi[x]-1] = 0;
                                        // highlight this cell to be sure
                                        cellColors[ii][j][COLOR_RED-1] = 1;
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

    clearSelectedCells ();
    clearTopDigits ();
    clearColors ();

    // for each box
    for (let boxi = 0; boxi < 3; ++boxi)
    {
        for (let boxj = 0; boxj < 3; ++boxj)
        {
            // first, look for a cell with only two penciled in digits
            for (let i = boxi*3; i < (boxi+1)*3; ++i)
            {
                for (let j = boxj*3; j < (boxj+1)*3; ++j)
                {
                    let penciledDigitsij = getPenciledDigits (i, j);
                    // ensure it has two digits
                    if (penciledDigitsij.length == 2)
                    {
                        // then find a matching cell with the same two penciled in digits
                        for (let k = boxi*3; k < (boxi+1)*3; ++k)
                        {
                            for (let l = boxj*3; l < (boxj+1)*3; ++l)
                            {
                                let penciledDigitskl = getPenciledDigits (k, l);
                                // ensure it has two digits and matching digits
                                // and ensure it is not the same cell
                                if (!(i==k&&j==l) && penciledDigitskl.length == 2 && penciledDigitsij[0] == penciledDigitskl[0] && penciledDigitsij[1] == penciledDigitskl[1])
                                {
                                    // found a pair!
                                    // since this pair exists, we know that neither of these digits
                                    // can appear in other cells in this box
                                    // so lets remove any pencilmarks
                                    for (let ii = boxi*3; ii < (boxi+1)*3; ++ii)
                                    {
                                        for (let jj = boxj*3; jj < (boxj+1)*3; ++jj)
                                        {
                                            // ensure this cell is not either pairing cell
                                            if (!(i==ii&&j==jj) && !(k==ii&&l==jj))
                                            {
                                                // remove pair's digits if it exists
                                                let hasReduced = false;
                                                let penciledDigitsiijj = getPenciledDigits (ii, jj);
                                                for (let x = 0; x < penciledDigitsij.length; ++x)
                                                {
                                                    // includes pair's digits
                                                    if (penciledDigitsiijj.includes (penciledDigitsij[x]))
                                                    {
                                                        pencilMarks[ii][jj][penciledDigitsij[x]-1] = 0;
                                                        // highlight this cell to be sure
                                                        cellColors[ii][jj][COLOR_RED-1] = 1;
                                                        hasReduced = true;
                                                    }
                                                }
                                                // if we didnt reduce a digit, then color the cell yellow
                                                if (!hasReduced)
                                                {
                                                    cellColors[ii][jj][COLOR_YELLOW-1] = 1;
                                                }
                                            }
                                            // this cell is one of the pairs
                                            else
                                            {
                                                cellColors[ii][jj][COLOR_GREEN-1] = 1;
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

    clearSelectedCells ();
    clearTopDigits ();
    clearColors ();

    // for each row
    for (let i = 0; i < 9; ++i)
    {
        // we need two digits that mutually occupy the same two cells in the same row
        // lets start with finding a digit that occupies only two cells
        for (let d0 = 1; d0 <= 9; ++d0)
        {
            // find possible positions of this digit in this row
            let isAlreadyFilledIn = false;
            let possibleLocationsJ = [];
            for (let j = 0; j < 9; ++j)
            {
                // this is a possible location
                // if d0 is penciled here
                if (pencilMarks[i][j][d0-1] == 1 && board[i][j] == 0)
                    possibleLocationsJ.push (j);

                // we can also ignore if d0 was already filled in this row
                if (board[i][j] == d0) 
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
            // cellColors[i][possibleLocationsJ[0]][COLOR_BLUE-1] = 1;
            // cellColors[i][possibleLocationsJ[1]][COLOR_BLUE-1] = 1;
            // mark the digit
            topDigits[i][possibleLocationsJ[0]][d0-1] = 1;
            topDigits[i][possibleLocationsJ[1]][d0-1] = 1;
            // we will use the digit marks to determine if two digits occupy the same two cells
        }
        // search for two cells with the same digit pair
        for (let j = 0; j < 9; ++j)
        {
            // ignore if cell is already filled in
            if (board[i][j] != 0) continue;

            let digits0 = getTopDigits (i,j);
            // ignore if not a pair
            if (digits0.length != 2) continue;
            // look for another pair that matches
            for (let jj = j+1; jj < 9; ++jj)
            {
                // ignore if cell is alread filled in
                if (board[i][jj] != 0) continue;

                let digits1 = getTopDigits (i,jj);
                // ignore if not a pair
                if (digits1.length != 2) continue;
                // ensure pairs match
                if (!(digits0[0] == digits1[0] && digits0[1] == digits1[1])) continue;
                // reaches here if pairs match

                // ignore if cells are naked pairs already
                // this is not necessary
                // this is just so we only color the cells if there is a change to note
                if (getPenciledDigits(i,j).length == 2 && getPenciledDigits(i,jj).length == 2) break;

                // pairs match and are not naked pairs so make them naked pairs
                // aka remove other penciled digits from these cells

                // clear all pencil marks
                for (let d = 1; d <= 9; ++d)
                {
                    pencilMarks[i][j ][d-1] = 0;
                    pencilMarks[i][jj][d-1] = 0;
                }

                // pencil only the pair digits
                pencilMarks[i][j ][digits0[0]-1] = 1;
                pencilMarks[i][jj][digits0[0]-1] = 1;
                pencilMarks[i][j ][digits1[1]-1] = 1;
                pencilMarks[i][jj][digits1[1]-1] = 1;

                // highlight isolated cells
                cellColors[i][j ][COLOR_GREEN-1] = 1;
                cellColors[i][jj][COLOR_GREEN-1] = 1;
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

    clearSelectedCells ();
    clearTopDigits ();
    clearColors ();

    // for each column
    for (let j = 0; j < 9; ++j)
    {
        // we need two digits that mutually occupy the same two cells in the same column
        // lets start with finding a digit that occupies only two cells
        for (let d0 = 1; d0 <= 9; ++d0)
        {
            // find possible positions of this digit in this column
            let isAlreadyFilledIn = false;
            let possibleLocationsI = [];
            for (let i = 0; i < 9; ++i)
            {
                // this is a possible location
                // if d0 is penciled here
                if (pencilMarks[i][j][d0-1] == 1 && board[i][j] == 0)
                    possibleLocationsI.push (i);

                // we can also ignore if d0 was already filled in this column
                if (board[i][j] == d0) 
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
            // cellColors[possibleLocationsI[0]][j][COLOR_BLUE-1] = 1;
            // cellColors[possibleLocationsI[1]][j][COLOR_BLUE-1] = 1;
            // mark the digit
            topDigits[possibleLocationsI[0]][j][d0-1] = 1;
            topDigits[possibleLocationsI[1]][j][d0-1] = 1;
            // we will use the digit marks to determine if two digits occupy the same two cells
        }
        // search for two cells with the same digit pair
        for (let i = 0; i < 9; ++i)
        {
            // ignore if cell is already filled in
            if (board[i][j] != 0) continue;

            let digits0 = getTopDigits (i,j);
            // ignore if not a pair
            if (digits0.length != 2) continue;
            // look for another pair that matches
            for (let ii = i+1; ii < 9; ++ii)
            {
                // ignore if cell is already filled in
                if (board[ii][j] != 0) continue;

                let digits1 = getTopDigits (ii,j);
                // ignore if not a pair
                if (digits1.length != 2) continue;
                // ensure pairs match
                if (!(digits0[0] == digits1[0] && digits0[1] == digits1[1])) continue;
                // reaches here if pairs match

                // ignore if cells are naked pairs already
                // this is not necessary
                // this is just so we only color the cells if there is a change to note
                if (getPenciledDigits(i,j).length == 2 && getPenciledDigits(ii,j).length == 2) break;

                // pairs match so isolate them
                // aka remove other penciled digits from these cells

                // clear all pencil marks
                for (let d = 1; d <= 9; ++d)
                {
                    pencilMarks[i ][j][d-1] = 0;
                    pencilMarks[ii][j][d-1] = 0;
                }

                // pencil only the pair digits
                pencilMarks[i ][j][digits0[0]-1] = 1;
                pencilMarks[ii][j][digits0[0]-1] = 1;
                pencilMarks[i ][j][digits1[1]-1] = 1;
                pencilMarks[ii][j][digits1[1]-1] = 1;

                // highlight isolated cells
                cellColors[i ][j][COLOR_GREEN-1] = 1;
                cellColors[ii][j][COLOR_GREEN-1] = 1;
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

    clearSelectedCells ();
    clearTopDigits ();
    clearColors ();

    // for each box
    for (let boxi = 0; boxi < 3; ++boxi)
    {
        for (let boxj = 0; boxj < 3; ++boxj)
        {
            // we need two digits that mutually occupy the same two cells in the same box
            // lets start with finding a digit that occupies only two cells
            for (let d0 = 1; d0 <= 9; ++d0)
            {
                // find possible positions of this digit in this box
                let isAlreadyFilledIn = false;
                let possibleLocationsI = [];
                let possibleLocationsJ = [];
                for (let i = boxi*3; i < (boxi+1)*3; ++i)
                {
                    for (let j = boxj*3; j < (boxj+1)*3; ++j)
                    {
                        // this is a possible location
                        // if d0 is penciled here
                        if (pencilMarks[i][j][d0-1] == 1 && board[i][j] == 0)
                        {
                            possibleLocationsI.push (i);
                            possibleLocationsJ.push (j);
                        }

                        // we can also ignore if d0 was already filled in this box
                        if (board[i][j] == d0) 
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
                // cellColors[possibleLocationsI[0]][possibleLocationsJ[0]][COLOR_BLUE-1] = 1;
                // cellColors[possibleLocationsI[1]][possibleLocationsJ[1]][COLOR_BLUE-1] = 1;
                // mark the digit
                topDigits[possibleLocationsI[0]][possibleLocationsJ[0]][d0-1] = 1;
                topDigits[possibleLocationsI[1]][possibleLocationsJ[1]][d0-1] = 1;
                // we will use the digit marks to determine if two digits occupy the same two cells
            }
            // search for two cells with the same digit pair
            for (let i = boxi*3; i < (boxi+1)*3; ++i)
            {
                for (let j = boxj*3; j < (boxj+1)*3; ++j)
                {
                    // ignore if cell is already filled in
                    if (board[i][j] != 0) continue;

                    let digits0 = getTopDigits (i,j);
                    // ignore if not a pair
                    if (digits0.length != 2) continue;
                    // look for another pair that matches
                    for (let ii = boxi*3; ii < (boxi+1)*3; ++ii)
                    {
                        for (let jj = boxj*3; jj < (boxj+1)*3; ++jj)
                        {
                            // ignore if we are looking at the same cell
                            if (i == ii && j == jj) continue;
                            // ignore if cell is already filled in
                            if (board[ii][jj] != 0) continue;

                            let digits1 = getTopDigits (ii,jj);
                            // ignore if not a pair
                            if (digits1.length != 2) continue;
                            // ensure pairs match
                            if (!(digits0[0] == digits1[0] && digits0[1] == digits1[1])) continue;
                            // reaches here if pairs match

                            // ignore if cells are naked pairs already
                            // this is not necessary
                            // this is just so we only color the cells if there is a change to note
                            if (getPenciledDigits(i,j).length == 2 && getPenciledDigits(ii,jj).length == 2) break;

                            // pairs match so isolate them
                            // aka remove other penciled digits from these cells

                            // clear all pencil marks
                            for (let d = 1; d <= 9; ++d)
                            {
                                pencilMarks[i ][j ][d-1] = 0;
                                pencilMarks[ii][jj][d-1] = 0;
                            }

                            // pencil only the pair digits
                            pencilMarks[i ][j ][digits0[0]-1] = 1;
                            pencilMarks[ii][jj][digits0[0]-1] = 1;
                            pencilMarks[i ][j ][digits1[1]-1] = 1;
                            pencilMarks[ii][jj][digits1[1]-1] = 1;

                            // highlight isolated cells
                            cellColors[i ][j ][COLOR_GREEN-1] = 1;
                            cellColors[ii][jj][COLOR_GREEN-1] = 1;
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

    clearSelectedCells ();
    clearTopDigits ();
    clearColors ();

    // check each digit
    for (let d = 1; d <= 9; ++d)
    {
        // check each row
        for (let i = 0; i < 9; ++i)
        {
            let alreadyFilledIn = false;
            // where can d go in this box?
            let possibleLocationsJ = [];
            // check each column 
            for (let j = 0; j < 9; ++j)
            {
                // check if this is a valid position for this digit
                if (pencilMarks[i][j][d-1] && board[i][j] == 0)
                {
                    possibleLocationsJ.push (j);
                }
                // ignore digit if it is already filled-in the box
                if (board[i][j] == d) alreadyFilledIn = true;
            }
            // ignore this row if digit is already filled in
            if (alreadyFilledIn) continue;
            // ensure digit has valid positions
            if (possibleLocationsJ.length == 0) continue;
            // ensure possible locations are in a single box
            let isInSameBox = true;
            let boxi = Math.floor(i / 3);
            let boxj = Math.floor(possibleLocationsJ[0] / 3);
            for (let j = 0; j < possibleLocationsJ.length; ++j)
            {
                let boxjj = Math.floor(possibleLocationsJ[j] / 3);
                if (boxjj != boxj)
                    isInSameBox = false;
            }
            if (!isInSameBox) continue;
            // each possible location is in the same box
            // we can remove this digit from non-intersecting cells in the box
            let hasReduced = false;
            for (let ii = boxi*3; ii < (boxi+1)*3; ++ii)
            {
                for (let jj = boxj*3; jj < (boxj+1)*3; ++jj)
                {
                    // highlight cells from the same box
                    // cellColors[ii][jj][COLOR_PURPLE-1] = 1;
                    // ensure it is not an intersecting cell
                    let isIntersectingCell = false;
                    for (let j = 0; j < possibleLocationsJ.length; ++j)
                        if (jj == possibleLocationsJ[j] && i == ii)
                            isIntersectingCell = true;
                    if (isIntersectingCell) continue;
                    // this cell is not one of the intersecting cells
                    // ensure the digit is penciled in, to highlight and remove it
                    if (pencilMarks[ii][jj][d-1] != 1) continue;
                    cellColors[ii][jj][COLOR_RED-1] = 1;
                    // remove digit
                    pencilMarks[ii][jj][d-1] = 0;
                    // we removed a digit so we have reduced
                    hasReduced = true;
                }
            }
            // highlight intersecting cells that caused the reduction
            // if there was a reduction
            if (hasReduced)
            {
                // highlight row
                for (let j = 0; j < 9; ++j)
                {
                    // ensure it isnt one of intersecting cells
                    if (possibleLocationsJ.includes(j)) continue;
                    cellColors[i][j][COLOR_YELLOW-1] = 1;
                }

                // highlight intersecting cells
                for (let j = 0; j < possibleLocationsJ.length; ++j)
                {
                    // highlight cell
                    editMode = MODE_COLOR;
                    cellColors[i][possibleLocationsJ[j]][COLOR_GREEN-1] = 1;
                    // use top digits to denote which digit
                    topDigits[i][possibleLocationsJ[j]][d-1] = 1;
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

    clearSelectedCells ();
    clearTopDigits ();
    clearColors ();

    // check each digit
    for (let d = 1; d <= 9; ++d)
    {
        // check each col
        for (let j = 0; j < 9; ++j)
        {
            let alreadyFilledIn = false;
            // where can d go in this col?
            let possibleLocationsI = [];
            // check each row 
            for (let i = 0; i < 9; ++i)
            {
                // check if this is a valid position for this digit
                if (pencilMarks[i][j][d-1] && board[i][j] == 0)
                {
                    possibleLocationsI.push (i);
                }
                // ignore digit if it is already filled-in the box
                if (board[i][j] == d) alreadyFilledIn = true;
            }
            // ignore this row if digit is already filled in
            if (alreadyFilledIn) continue;
            // ensure digit has valid positions
            if (possibleLocationsI.length == 0) continue;
            // ensure possible locations are in a single box
            let isInSameBox = true;
            let boxi = Math.floor(possibleLocationsI[0] / 3);
            let boxj = Math.floor(j / 3);
            for (let i = 0; i < possibleLocationsI.length; ++i)
            {
                let boxii = Math.floor(possibleLocationsI[i] / 3);
                if (boxii != boxi)
                    isInSameBox = false;
            }
            if (!isInSameBox) continue;
            // each possible location is in the same box
            // we can remove this digit from non-intersecting cells in the box
            let hasReduced = false;
            for (let ii = boxi*3; ii < (boxi+1)*3; ++ii)
            {
                for (let jj = boxj*3; jj < (boxj+1)*3; ++jj)
                {
                    // highlight cells from the same box
                    // cellColors[ii][jj][COLOR_PURPLE-1] = 1;
                    // ensure it is not an intersecting cell
                    let isIntersectingCell = false;
                    for (let i = 0; i < possibleLocationsI.length; ++i)
                        if (ii == possibleLocationsI[i] && j == jj)
                            isIntersectingCell = true;
                    if (isIntersectingCell) continue;
                    // this cell is not one of the intersecting cells
                    // ensure the digit is penciled in, to highlight and remove it
                    if (pencilMarks[ii][jj][d-1] != 1) continue;
                    cellColors[ii][jj][COLOR_RED-1] = 1;
                    // remove digit
                    pencilMarks[ii][jj][d-1] = 0;
                    // we removed a digit so we have reduced
                    hasReduced = true;
                }
            }
            // highlight intersecting cells that caused the reduction
            // if there was a reduction
            if (hasReduced)
            {
                // highlight col
                for (let i = 0; i < 9; ++i)
                {
                    // ensure it isnt one of intersecting cells
                    if (possibleLocationsI.includes(i)) continue;
                    cellColors[i][j][COLOR_YELLOW-1] = 1;
                }

                // highlight intersecting cells
                for (let i = 0; i < possibleLocationsI.length; ++i)
                {
                    // highlight cell
                    editMode = MODE_COLOR;
                    cellColors[possibleLocationsI[i]][j][COLOR_GREEN-1] = 1;
                    // use top digits to denote which digit
                    topDigits[possibleLocationsI[i]][j][d-1] = 1;
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

    clearSelectedCells ();
    clearTopDigits ();
    clearColors ();
    
    for (let boxi = 0; boxi < 3; ++boxi)
    {
        for (let boxj = 0; boxj < 3; ++boxj)
        {
            for (let d = 1; d <= 9; ++d)
            {
                let alreadyFilledIn = false;
                // where can d go in this box?
                let possibleLocationsI = [];
                let possibleLocationsJ = [];
                for (let i = boxi*3; i < (boxi+1)*3; ++i)
                {
                    for (let j = boxj*3; j < (boxj+1)*3; ++j)
                    {
                        // check if this digit is possible
                        // and ensure it is not filled in already
                        if (pencilMarks[i][j][d-1] && board[i][j] == 0) 
                        {
                            possibleLocationsI.push (i);
                            possibleLocationsJ.push (j);
                        }
                        // ignore digit if it is already filled-in the box
                        if (board[i][j] == d) alreadyFilledIn = true;
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
                    for (let j = 0; j < 9; ++j)
                    {
                        // ensure we are looking at a non-intersecting cell
                        if (!possibleLocationsJ.includes (j))
                        {
                            // check if this other cell contains d
                            if (board[possibleLocationsI[0]][j] == 0 && pencilMarks[possibleLocationsI[0]][j][d-1] == 1)
                            {
                                editMode = MODE_COLOR;
                                cellColors[possibleLocationsI[0]][j][COLOR_RED-1] = 1;
                                // remove the digit
                                editMode = MODE_PENCIL;
                                pencilMarks[possibleLocationsI[0]][j][d-1] = 0;
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
                    for (let i = 0; i < 9; ++i)
                    {
                        // ensure we are looking at a non-intersecting cell
                        if (!possibleLocationsI.includes (i))
                        {
                            // check if this other cell contains d
                            if (board[i][possibleLocationsJ[0]] == 0 && pencilMarks[i][possibleLocationsJ[0]][d-1] == 1)
                            {
                                editMode = MODE_COLOR;
                                cellColors[i][possibleLocationsJ[0]][COLOR_RED-1] = 1;
                                // remove the digit
                                editMode = MODE_PENCIL;
                                pencilMarks[i][possibleLocationsJ[0]][d-1] = 0;
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
                    for (let i = boxi*3; i < (boxi+1)*3; ++i)
                    {
                        for (let j = boxj*3; j < (boxj+1)*3; ++j)
                        {
                            // ensure it isnt the possible locations
                            if (possibleLocationsI.includes(i) && possibleLocationsJ.includes(j)) continue;
                            cellColors[i][j][COLOR_YELLOW-1] = 1;
                        }
                    }
                    // highlight intersecting cells
                    for (let k = 0; k < possibleLocationsI.length; ++k)
                    {
                        editMode = MODE_TOP;
                        selectedCells[possibleLocationsI[k]][possibleLocationsJ[k]] = 1;
                        inputDigit (d);
                        selectedCells[possibleLocationsI[k]][possibleLocationsJ[k]] = 0;
                        // highlight cell
                        cellColors[possibleLocationsI[k]][possibleLocationsJ[k]][COLOR_GREEN-1] = 1;
                    }
                }
            }
        }
    }
    
    editMode = MODE_SOLVER;
}




