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



NEW TODO
- undo/redo
- [x] given digits
    - should not be able to be changed
    - allows us to select all and delete only placed digits
    - use the same board for the solver? but have a bool board saying if a digit is given to prevent deletion
    - boards read from saved data structure should make all digits given by default
- refactor solver to not be allowed to directly change board
    - it should have to call a function
    - and that function should give an error or prevent changing given digits
- double click to highlight all cells of the same kind
- restrict select cell region to less than the cell so you can select more.
- [x] make killer cage outline smaller
- [x] make killer cage number more in the corner with a white backdrop
- killer cage calculator
- [x] change colors to be blue cos pink not it tbh
- board maker mode should make any pencil marks light (dont remove)
- [x] split up negative domino constraint per domino type
- [x] rules to english desc generator
- solution check button
- auto detect solved state 
- solved message - congrats, you solved it!
- ways to store solutions to puzzles for ensuring correct solutions - idk if needed
- darkmode https://www.w3schools.com/howto/howto_js_toggle_dark_mode.asp
- knights move chess
- kings move chess
- single reduction for each solver button
    - but make it optional in the function
    - would make solver slower
    - maybe full solver button should not single step
    - we can expand on this to add some output that explains what the single reduction was
        similar to a teaching tool? or a hint tool?
- 6x6 soduko boards
    - i believe is 2x3 or 3x2 boxes so give option
    - and give digit options


- scrap less/greater than dominoes - dont think they work as intended
    - dont even have a puzzle that uses it
    - but maybe it needs refinement

- add solver log
    - all penicl mark changes
    - all filled-in digit changes
    - [info,debug,trace] type format

naive solver
basic solver
basic + naive where needed
    - bifurcation ;__;
    - but should be much faster than naive solver
basic + advanced techniques
    - need to learn and implement techniques like XY wing, coloring, etc
basic + variant sudoku techniques
    - dominoes techniques
        - pointing dominoes
        - domino chaining
            - if a cell has 2 black dots which has all 3 cells in the same row, col, or box
                then 3,6 cannot appear anywhere
                and the middle cell cannot be 1 or 8
            - this is actually all that is needed to solve the first domino sudoku board :)
    - cage techniques
        - pointing cages
        - locked digit in cage
        - cage calculator
            - determine what comb are possible
            - determine if any digits are common across comb
            - determine if any digits are absent from all comb
            - currently a 3 cell 6 cage apparently can have a 6 in it....
        - 45 cage - must contain all digits
        - unique digits constraint


- I think it is still possible for quadruples to help solve a puzzle
    - 4 make a quadruple leaving 5 unknown cells
    - never need to handle 5tuples nor 6tuples

- boards should have names, authors, and url links to source
    - and a way to add/edit name, author, and url from Board Maker - so I dont have to edit JSON

- make more touchscreen/cell phone ready
    - probs force playing with phone in landscape mode
    - needs a way to select multiple cells tho
    - and keep in mind that touchscreen can ONLY use the on-screen buttons so anything that can be done via keyboard, needs a translation into a button

- XV dominoes
   - https://app.crackingthecryptic.com/sudoku/P97Nt3HLmP

- line sudoku
   - Gemma Lines - https://app.crackingthecryptic.com/sudoku/P97Nt3HLmP

- X wing technique
[][][2][2][][][][][]
...
[][][2][2][][][][][]
the topdigit 2s form an X wing which rules out 2s from elsewhere in those rows

- sudoku solver via neural net? idk

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
- board maker should display the solution in a grayed out color
- and it should warn if there are multiple solutions
- a way to export a board to a json file and a way to import a board from a json
    - for BC, assume loading a non-existing field means there are no dominos or cages etc

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