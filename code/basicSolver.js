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
    editMode = MODE_PENCIL;
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

function reduceRows ()
{
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
    return hasChanged;
}

//========================================================================

function reduceColumns ()
{
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
    return hasChanged;
}

//========================================================================

function reduceBoxes ()
{
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

    return hasChanged;
}

//========================================================================

function isolatePairs ()
{
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





