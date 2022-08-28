// Naive Sudoku Solver
//========================================================================


//========================================================================

function naiveSolverHelper (board)
{
    for (let i = 0; i < 9; ++i)
        console.log (board[i]);
    console.log("==================");
    let isSolved = true;
    let canPlacedDigit = false;

    // find a place to put a digit
    for (let i = 0; i < 9; ++i)
    {
        for (let j = 0; j < 9; ++j)
        {
            // Ensure cell doesnt already have a digit
            if (board[i][j] == 0) 
            {
                // since this cell doesnt have a digit,
                // then we know the board isn't solved yet
                isSolved = false;
                // find a valid digit to place in this cell
                for (let d = 1; d <= 9; ++d)
                {
                    board[i][j] = d;
                    // ensure d is not conflicting (aka valid)
                    if (!isCellConflicting (board, i, j)) 
                    {
                        canPlacedDigit = true;
                        
                        // we can place digit d in this cell
                        // so place it and see if we can solve the board from this state
                        let result = naiveSolverHelper (board);

                        // if successful (puzzle solved), 
                        // then pass the solution backwards
                        if (result) return true;

                        // if this digit cannot solve the puzzle,
                        // then continue onto a different digit
                        
                    }
                    // reaches here if digit cannot be placed in cell
                    // reset digit
                    board[i][j] = 0;
                }
                // reaches here if no digit can be placed in this empty cell
                // we know that a digit must be placed here to solve the puzzle
                // so we can quit looking because we know this state won't work
                return false;
            }
        }
    }

    // reaches here if no digit can be placed
    // either because all digits are filled in, or no empty cell can have a valid digit

    // if all digits are filled in already,
    // then the puzzle is solved - nothing to do
    if (isSolved) return true;

    // if no solution can be found,
    // then backtrack
    return false;
}

// uses recursive backtracking to find a solution
// if it can find a solution, then it will update the sudoku board
function naiveSolverSolve ()
{

    // gray out button while solving
    // select("#naiveSolverSolveButton").addClass ("disabledButton");

    // copy board so we dont mess it up
    // [not sure if this is needed]
    let boardCopy = [];
    for (let i = 0; i < 9; ++i)
    {
        boardCopy.push ([]);
        for (let j = 0; j < 9; ++j)
        {
            boardCopy[i].push (board[i][j]);
        }
    }

    // first ensure that the puzzle doesn't already have conflicts
    for (let i = 0; i < 9; ++i)
        for (let j = 0; j < 9; ++j)
            if (isCellConflicting (board, i, j))
                return false;

    let isSolved = naiveSolverHelper (boardCopy);

    if (isSolved)
        for (let i = 0; i < 9; ++i)
            for (let j = 0; j < 9; ++j)
                board[i][j] = boardCopy[i][j];

    // only make 1 move
    // if (isSolved)
    // {
    //     let hasPlacedDigit = false;
    //     for (let i = 0; i < 9; ++i)
    //     {
    //         for (let j = 0; j < 9; ++j)
    //         {
    //             if (board[i][j] == 0)
    //             {
    //                 editMode = MODE_DIGIT;
    //                 clearSelectedCells ();
    //                 selectedCells[i][j] = 1;
    //                 inputDigit (boardCopy[i][j]);
    //                 clearSelectedCells ();
    //                 editMode = MODE_SOLVER;
    //                 hasPlacedDigit = true;
    //                 break;
    //             }
    //         }
    //         if (hasPlacedDigit) break;
    //     }
    // }

    // Enable button
    // select("#naiveSolverSolveButton").removeClass ("disabledButton");
}


