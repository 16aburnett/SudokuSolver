// Variant Sudoku Solver
// This solver follows the following preceedure
// 1. pencil in possible digits for each cell
// 2. reduce penciled in digits using techniques
// 3. fill in digits for cells with only one pencil mark (naked singles)
// 4, repeat until puzzle is solved (win) or cannot reduce further (lose)

// this solver uses variant sudoku solving techniques that are helpful
// for advanced/variant sudokus like Domino or Killer Cage Sudokus

// this solver assumes that normal sudoku rules apply and uses the basic
// sudoku solver for constraining digits using the normal sudoku rules.

//========================================================================

function variantSudokuSolverSolve ()
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
        {
            // use basic solver to solve normal sudoku
            basicSolverReducePenciledDigits ();
            // using variant sudoku techniques
            variantSudokuSolverReducePenciledDigits ();
        }

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

// Uses all available variant sudoku reduction techniques
function variantSudokuSolverReducePenciledDigits ()
{
    prevPlayMode = playMode;
    // clear previous selections
    sudokuBoard.clearSelectedCells ();

    restrictDominoes ();
    restrictChainedKropki ();

    editMode = MODE_SOLVER;
    playMode = prevPlayMode;
}

//========================================================================
//=== Variant Sudoku solving techniques
//========================================================================

// Checks each penciled digit of each cell violates any domino rules 
// connected to that cell
// and repeats for all cells/possible dominoes
function restrictDominoes ()
{
    prevPlayMode = playMode;
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
    
    playMode = prevPlayMode;
} // endfunction

//========================================================================

// Kropki chaining
// when you have a cell that has multiple kropki dots and those other domino
// cells share a group (same row, col, box), then we can restrict the
// middle digit (original cell)
// for example []B[]B[] where B means black dot
//    we know that the middle cell cannot by 1 because that means
//    that both left and right cells must be a 2, but that would cause two 2s
//    in the same row which breaks sudoku
//    for the same logic, we know the middle digit cannot be 8, 3, or 6 either
// the only case where this does not work is if the two end digits
//    are not in the same row, col, or box 
//    which would mean that they CAN be the same digit
// Note, this assumes normal sudoku rules apply
function restrictChainedKropki ()
{
    prevPlayMode = playMode;

    sudokuBoard.clearSelectedCells ();
    sudokuBoard.clearTopDigits ();
    sudokuBoard.clearColors ();

    // 1. for each cell, if cell has at least 2 kropki dots (BB, BW, WW, BBB, WWW, BWB, etc ...)
    //    if < 2 kropki dots, then continue to next cell
    for (let i = 0; i < sudokuBoard.rows; ++i)
    {
        for (let j = 0; j < sudokuBoard.cols; ++j)
        {
            // ensure cell has at least 2 kropki dots
            let num_kropki_dots = 0;
            // keep track of the dominoes
            // we'll only keep track of kropki and ignore other dominoes
            //              north        east         south        west
            let dominoes = [DOMINO_NONE, DOMINO_NONE, DOMINO_NONE, DOMINO_NONE];
            let otheri   = [i-1,         i,           i+1,         i];
            let otherj   = [j,           j+1,         j,           j-1];
            let boxi     = [Math.floor((i-1) / sudokuBoard.boxRows), Math.floor((i  ) / sudokuBoard.boxRows), Math.floor((i+1) / sudokuBoard.boxRows), Math.floor((i  ) / sudokuBoard.boxRows)];
            let boxj     = [Math.floor((j  ) / sudokuBoard.boxCols), Math.floor((j+1) / sudokuBoard.boxCols), Math.floor((j  ) / sudokuBoard.boxCols), Math.floor((j-1) / sudokuBoard.boxCols)];
            // north cell, if there is one
            if (i-1 >= 0 && (sudokuBoard.dominoes[i-1][j][DOMINO_SOUTH] == DOMINO_KROPKI_WHITE || sudokuBoard.dominoes[i-1][j][DOMINO_SOUTH] == DOMINO_KROPKI_BLACK))
            {
                ++num_kropki_dots;
                dominoes[0] = sudokuBoard.dominoes[i-1][j][DOMINO_SOUTH];
            }
            // east cell, if there is one
            if (sudokuBoard.dominoes[i][j][DOMINO_EAST] == DOMINO_KROPKI_WHITE || sudokuBoard.dominoes[i][j][DOMINO_EAST] == DOMINO_KROPKI_BLACK)
            {
                ++num_kropki_dots;
                dominoes[1] = sudokuBoard.dominoes[i][j][DOMINO_EAST];
            }
            // south cell, if there is one
            if (sudokuBoard.dominoes[i][j][DOMINO_SOUTH] == DOMINO_KROPKI_WHITE || sudokuBoard.dominoes[i][j][DOMINO_SOUTH] == DOMINO_KROPKI_BLACK)
            {
                ++num_kropki_dots;
                dominoes[2] = sudokuBoard.dominoes[i][j][DOMINO_SOUTH];
            }
            // west cell, if there is one
            if (j-1 >= 0 && (sudokuBoard.dominoes[i][j-1][DOMINO_EAST] == DOMINO_KROPKI_WHITE || sudokuBoard.dominoes[i][j-1][DOMINO_EAST] == DOMINO_KROPKI_BLACK))
            {
                ++num_kropki_dots;
                dominoes[3] = sudokuBoard.dominoes[i][j-1][DOMINO_EAST];
            }
            if (num_kropki_dots < 2)
                continue;

            // highlight cell
            // sudokuBoard.cellColors[i][j][COLOR_BLUE] = 1;

            // for each combination of 2 dominoes from this cell (there could be 2, 3, or 4 dots)
            // 2. determine if other 2 cells can be the same digit
            //    if normal sudoku rules apply,
            //       then the 2 cells must be different if they share the same group (row, col, box).
            //    if they can be the same digit, then we cannot apply this rule - move on
            for (let domino_dir0 = 0; domino_dir0 < 4; ++domino_dir0)
            {
                // ignore if this direction doesnt have a kropki domino
                let domino_type0 = dominoes[domino_dir0];
                if (domino_type0 == DOMINO_NONE) continue;
                for (let domino_dir1 = domino_dir0+1; domino_dir1 < 4; ++domino_dir1)
                {
                    // ignore if this direction doesnt have a kropki domino
                    let domino_type1 = dominoes[domino_dir1];
                    if (domino_type1 == DOMINO_NONE) continue;

                    // convert direction to i,j coords
                    let otheri0 = otheri[domino_dir0];
                    let otherj0 = otherj[domino_dir0];
                    let otheri1 = otheri[domino_dir1];
                    let otherj1 = otherj[domino_dir1];
                    let boxi0 = boxi[domino_dir0];
                    let boxj0 = boxj[domino_dir0];
                    let boxi1 = boxi[domino_dir1];
                    let boxj1 = boxj[domino_dir1];
                    
                    // ensure dominoes share a row, col, or box
                    let isSameRow = otheri0 == otheri1;
                    let isSameCol = otherj0 == otherj1;
                    let isSameBox = boxi0 == boxi1 && boxj0 == boxj1;
                    if (!isSameRow && !isSameCol && !isSameBox)
                        // dominoes dont share a group
                        // meaning they can be the same digit so we cant do anything with that
                        // ignore this pairing
                        continue;

                    // Reaches here if other two cells share a group
                    sudokuBoard.cellColors[i][j][COLOR_GREEN] = 1;
                    sudokuBoard.cellColors[otheri0][otherj0][COLOR_YELLOW] = 1;
                    sudokuBoard.cellColors[otheri1][otherj1][COLOR_YELLOW] = 1;

                    // 3a. if 2 black dots,
                    //    then the center (current) cell cannot be 1, 8, 3, or 6 (assuming base 9)
                    if (domino_type0 == DOMINO_KROPKI_BLACK && domino_type1 == DOMINO_KROPKI_BLACK)
                    {
                        let wasChanged = false;
                        // Remove 1
                        if (sudokuBoard.centerDigits[i][j][1] == 1) wasChanged = true;
                        sudokuBoard.centerDigits[i][j][1] = 0;
                        // Remove 8
                        if (sudokuBoard.centerDigits[i][j][8] == 1) wasChanged = true;
                        sudokuBoard.centerDigits[i][j][8] = 0;
                        // Remove 3
                        if (sudokuBoard.centerDigits[i][j][3] == 1) wasChanged = true;
                        sudokuBoard.centerDigits[i][j][3] = 0;
                        // Remove 6
                        if (sudokuBoard.centerDigits[i][j][6] == 1) wasChanged = true;
                        sudokuBoard.centerDigits[i][j][6] = 0;
                        // if we removed a penciled digit,
                        // then color the cell red to denote we made a reduction
                        if (wasChanged)
                            sudokuBoard.cellColors[i][j][COLOR_RED] = 1;
                    }

                    // 3b. if 2 white dots,
                    //    then the center (current) cell cannot be 1 or 9 (assuming base 9)
                    if (domino_type0 == DOMINO_KROPKI_WHITE && domino_type1 == DOMINO_KROPKI_WHITE)
                    {
                        let wasChanged = false;
                        // Remove 1
                        if (sudokuBoard.centerDigits[i][j][1] == 1) wasChanged = true;
                        sudokuBoard.centerDigits[i][j][1] = 0;
                        // Remove 8
                        if (sudokuBoard.centerDigits[i][j][9] == 1) wasChanged = true;
                        sudokuBoard.centerDigits[i][j][9] = 0;
                        // if we removed a penciled digit,
                        // then color the cell red to denote we made a reduction
                        if (wasChanged)
                            sudokuBoard.cellColors[i][j][COLOR_RED] = 1;
                    }

                    // 3c. if 1 white and 1 black dot,
                    //    then the center (current) cell cannot be 1 or 9 (assuming base 9)
                    if ((domino_type0 == DOMINO_KROPKI_BLACK && domino_type1 == DOMINO_KROPKI_WHITE) ||
                        (domino_type0 == DOMINO_KROPKI_WHITE && domino_type1 == DOMINO_KROPKI_BLACK))
                    {
                        let wasChanged = false;
                        // Remove 1
                        if (sudokuBoard.centerDigits[i][j][1] == 1) wasChanged = true;
                        sudokuBoard.centerDigits[i][j][1] = 0;
                        // Remove 8
                        if (sudokuBoard.centerDigits[i][j][9] == 1) wasChanged = true;
                        sudokuBoard.centerDigits[i][j][9] = 0;
                        // if we removed a penciled digit,
                        // then color the cell red to denote we made a reduction
                        if (wasChanged)
                            sudokuBoard.cellColors[i][j][COLOR_RED] = 1;
                    }
                }
            }
        }
    }
    
    playMode = prevPlayMode;
} // endfunction
