- light/dark mode
- make css beautiful
- multi-cell selection
- fill in digit
- pencil in possible digits
- candidate digits - corner digits
- coloring cells - lots of colors
- draw lines - mutli-colored

- naked pairs
- hidden pairs
[[4512], [6312], 345, 5643, ...]

- FEATURE: shift mechanic for touchscreen (make a btn that doesnt clear selected when clicking)

- refactor solving tools into one tab
    - spacebar should only cycle between penciling tools


- select all cells of a kind
    - using double click
    - or long press

- undo button!!
    - naive impl - save previous states
    - smart impl - save space efficient code representing what changed

- board play tab
    - button for selecting all cells
    - button to clear all pencil marks
    - button to check if board is solved (maybe this should be automatic?)

*** Digit layers
    - only shows pencil marks depending on tab selected
    - maybe not too useful?


- rules description above the tabs 

Premade Boards Tab
- normal sudokus
- advanced sudokus with killer cages etc

Board Generation Tab
- difficulty
- techniques
- integration with board maker? or keep as separate

BOARD MAKER
- board size - I want hexadecimal sudokus ya nerd!
- series of buttons for adding different constraints like given digits, cages, lines, arrows, colors
- Killer cages
    - button for cage mode
    - graphics
- X, V, black/white dot dominoes
- palindrome lines

- Boolean settings
    - Example: all white dots are given, meaning if a white dot is not present between two cells, 
    then those two cells are NOT consecutive
    - Example: a digit must NOT repeat in a cage.
- Settings for normal sudoku rules (we could turn off the box uniqueness requirement for example)
- asynchronous mechanic that checks if the solution is unique (use naive solver and count different solutions?)
- button to randomly generate digits that make a valid sudoku solution (so we can backtrack and delete digits)
- board created digits should not be able to be changed during solving
    - maybe add a different layer for given digits that takes precedence over board digits
    - should also be different so we can differentiate (given digits == black, user digits == blue?)

- While in playing mode, the rules should be present
- Each rule should also add to the conflict checking jawns
- maybe add a Rule class to inherit from and each rule must implement a correctness checker


To Solve Evil Board
- need XY-Wing
- coloring
    - lookahead on a pair to see if a common cell cannot be a digit no matter which digit is there
    - I kinda hate this one because it seems very close to guessing perhaps without being guessing
- Nishio technique
    - but this literally is random guessing?? but like limited random guessing? just lookahead.
    - lookahead, if one path results in a conflicting digit in X amount of moves, then we can elim that candidate
    - this is literally random guessing -__-

virtual pairs????


https://hodoku.sourceforge.net/en/tech_hidden.php 

must digits
- aka locked candidates

- FEATURE: larger grids that use A-F for hexadecimel

- hotkeys for tabs (zxcvbnm)

- board generation
    - generated digits should not be editable
    - difficulty based on
        - how many bifurcation steps needed for basic solver
            - 0 -> Easy
            - 10+? -> Difficult


- undo/redo

- checker to detect if there are conflicting filled in digits (ignores pencils)
- solution checker (simply checks that all numbers are filled in and that all constraints are satisfied)

- Simple bifurcation AI
- Add system for applying multiple techniques (last resort is bifurcation/backtracking)

- the ability to add in new constraints
    - cages - cage painter (flood fill?)
    - dominoes
        - V, X, white, black (maybe many more?)
    - lines
    - add mechinism for AI to recognize these constraints