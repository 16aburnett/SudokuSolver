// Basic Sudoku Solver
//========================================================================


//========================================================================



// 1. pencil in possible digits for each cell

// 2. reduce penciled in digits using logic techniques?

// 3. fill in digits for cells with only one pencil mark

// 4, repeat



//========================================================================

function basicSolverPencilDigits ()
{
    editMode = MODE_PENCIL;
    // clear previous selections
    clearSelectedCells ();
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

    // Where does d go in each row?
    // if (reduceRows ()) return;
    reduceRows ();

    // Where does d go in each column?
    // if (reduceColumns ()) return;
    reduceColumns ();

    // Where does d go in each box?
    // if (reduceBoxes ()) return;
    reduceBoxes ();

    isolatePairs ();

    editMode = MODE_SOLVER;
}

//========================================================================

// reduces pencil marks if a digit only has one possible location in a row
function reduceRows ()
{
    editMode = MODE_PENCIL;

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
function reduceColumns ()
{
    editMode = MODE_PENCIL;

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
function reduceBoxes ()
{
    editMode = MODE_PENCIL;

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

function isolatePairs ()
{
    isolatePairsInRows ();
    isolatePairsInColumns ();
    isolatePairsInBoxes ();
}

//========================================================================

// searches for naked pairs of digits and isolates them 
// by removing the pair's digits from the pair's common group 
// whether that is a row, column or box
function isolatePairsInRows ()
{
    editMode = MODE_PENCIL;

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
                        cellColors[i][j][COLOR_RED-1] = 1;
                        cellColors[i][k][COLOR_RED-1] = 1;
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
                                        // highlight this cell to be sure
                                        cellColors[i][jj][COLOR_PURPLE-1] = 1;
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

function isolatePairsInColumns ()
{
    editMode = MODE_PENCIL;

    clearColors ();
    // column pairs
    // blue
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
                                        cellColors[ii][j][COLOR_PINK-1] = 1;
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

function isolatePairsInBoxes ()
{
    editMode = MODE_PENCIL;

    clearColors ();
    // box pairs
    // pink
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
                                    cellColors[i][j][COLOR_BLUE-1] = 1;
                                    cellColors[k][l][COLOR_BLUE-1] = 1;
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
                                                let penciledDigitsiijj = getPenciledDigits (ii, jj);
                                                for (let x = 0; x < penciledDigitsij.length; ++x)
                                                {
                                                    if (penciledDigitsiijj.includes (penciledDigitsij[x]))
                                                    {
                                                        pencilMarks[ii][jj][penciledDigitsij[x]-1] = 0;
                                                        // highlight this cell to be sure
                                                        cellColors[ii][jj][COLOR_YELLOW-1] = 1;
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
        }
    }
    editMode = MODE_SOLVER;
    return true;
}

//========================================================================

function basicSolverFillDigits ()
{
    editMode = MODE_DIGIT;
    // clear previous selections
    clearSelectedCells ();

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

// determines a set of cells where each digit must go for each box
// This highlights digits that must occur in a single row or column of the box
// so that we can eliminate the digit from the rest of the cells from that row or col
function fillMustDigitInBox ()
{
    editMode = MODE_COLOR;

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
                if (isInRow)
                {
                    for (let j = 0; j < 9; ++j)
                    {
                        // ensure we are looking at a non-intersecting cell
                        if (!possibleLocationsJ.includes (j))
                        {
                            // check if this other cell contains d
                            if (pencilMarks[possibleLocationsI[0]][j][d-1] == 1)
                            {
                                editMode = MODE_COLOR;
                                selectedCells[possibleLocationsI[0]][j] = 1;
                                inputDigit (COLOR_PURPLE);
                                selectedCells[possibleLocationsI[0]][j] = 0;
                                // remove the digit
                                editMode = MODE_PENCIL;
                                pencilMarks[possibleLocationsI[0]][j][d-1] = 0;
                            }
                        }
                    }
                    // use top digits to mark where d must go
                    for (let k = 0; k < possibleLocationsI.length; ++k)
                    {
                        editMode = MODE_TOP;
                        selectedCells[possibleLocationsI[k]][possibleLocationsJ[k]] = 1;
                        inputDigit (d);
                        selectedCells[possibleLocationsI[k]][possibleLocationsJ[k]] = 0;
                    }
                }
                // If the only possible cells for digit, d, are in a col, 
                // then we can eliminate this digit from the other cells in this col
                if (isInCol) 
                {
                    for (let i = 0; i < 9; ++i)
                    {
                        // ensure we are looking at a non-intersecting cell
                        if (!possibleLocationsI.includes (i))
                        {
                            // check if this other cell contains d
                            if (pencilMarks[i][possibleLocationsJ[0]][d-1] == 1)
                            {
                                editMode = MODE_COLOR;
                                selectedCells[i][possibleLocationsJ[0]] = 1;
                                inputDigit (COLOR_PINK);
                                selectedCells[i][possibleLocationsJ[0]] = 0;
                                // remove the digit
                                editMode = MODE_PENCIL;
                                pencilMarks[i][possibleLocationsJ[0]][d-1] = 0;
                            }
                        }
                    }
                    // use top digits to mark where d must go
                    for (let k = 0; k < possibleLocationsI.length; ++k)
                    {
                        editMode = MODE_TOP;
                        selectedCells[possibleLocationsI[k]][possibleLocationsJ[k]] = 1;
                        inputDigit (d);
                        selectedCells[possibleLocationsI[k]][possibleLocationsJ[k]] = 0;
                    }
                }
            }
        }
    }
    
    editMode = MODE_SOLVER;
}







