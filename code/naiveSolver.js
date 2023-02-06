// Naive Sudoku Solver
//========================================================================


//========================================================================

function naiveSolverHelper (board)
{

    let newBoard = [];
    for (let i = 0; i < board.rows; ++i)
    {
        newBoard.push([]);
        for (let j = 0; j < board.cols; ++j)
        {
            newBoard[i].push (board.board[i][j]);
        }
    }
    print (newBoard);

    let isSolved = true;
    let canPlacedDigit = false;

    // find a place to put a digit
    for (let i = 0; i < board.rows; ++i)
    {
        for (let j = 0; j < board.cols; ++j)
        {
            // Ensure cell doesnt already have a digit
            if (board.board[i][j] != EMPTY_CELL) continue;
            
            // since this cell doesnt have a digit,
            // then we know the board isn't solved yet
            isSolved = false;
            // find a valid digit to place in this cell
            for (let d = board.low; d < board.high; ++d)
            {
                // board.board[i][j] = d;
                // ensure d is not conflicting (aka valid)
                // if (!board.isCellConflicting (i, j)) 
                if (board.isDigitValid (i, j, d)) 
                {
                    canPlacedDigit = true;
                    board.board[i][j] = d;
                    
                    // we can place digit d in this cell
                    // so place it and see if we can solve the board from this state
                    let result = naiveSolverHelper (board);

                    // print (result);
                    // print (board.board);

                    // if successful (puzzle solved), 
                    // then pass the solution backwards
                    if (result) return true;

                    // if this digit cannot solve the puzzle,
                    // then continue onto a different digit
                    board.board[i][j] = EMPTY_CELL;
                    
                }
                // reaches here if digit cannot be placed in cell
                // reset digit
                // board.board[i][j] = EMPTY_CELL;
            }
            // reaches here if no digit can be placed in this empty cell
            // we know that a digit must be placed here to solve the puzzle
            // so we can quit looking because we know this state won't work
            return false;
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
    let boardCopy = new SudokuBoard(sudokuBoard.numDigits);
    for (let i = 0; i < boardCopy.rows; ++i)
    {
        for (let j = 0; j < boardCopy.cols; ++j)
        {
            boardCopy.board[i][j] = sudokuBoard.board[i][j];
            for (let d = 0; d < DOMINO_NUM_DIRS; ++d)
                boardCopy.dominoes[i][j][d] = sudokuBoard.dominoes[i][j][d];
        }
    }
    boardCopy.cages = sudokuBoard.cages;

    // first ensure that the puzzle doesn't already have conflicts
    for (let i = 0; i < boardCopy.rows; ++i)
        for (let j = 0; j < boardCopy.cols; ++j)
            if (boardCopy.isCellConflicting (i, j))
                return false;

    let isSolved = naiveSolverHelper (boardCopy);

    console.log (isSolved);

    // ensure board is solved
    let isActuallySolved = true;
    for (let i = 0; i < boardCopy.rows; ++i)
        for (let j = 0; j < boardCopy.cols; ++j)
            if (boardCopy.isCellConflicting (i, j))
                isActuallySolved = false;
    console.log (isActuallySolved);

    if (isSolved)
        for (let i = 0; i < sudokuBoard.rows; ++i)
            for (let j = 0; j < sudokuBoard.cols; ++j)
                sudokuBoard.board[i][j] = boardCopy.board[i][j];
    
    isActuallySolved = true;
    for (let i = 0; i < sudokuBoard.rows; ++i)
        for (let j = 0; j < sudokuBoard.cols; ++j)
            if (sudokuBoard.isCellConflicting (i, j))
                isActuallySolved = false;
    console.log (isActuallySolved);

}


