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


To Solve Evil Board
- need XY-Wing
- coloring
    - lookahead on a pair to see if a common cell cannot be a digit no matter which digit is there
    - I kinda hate this one because it seems very close to guessing perhaps without being guessing
- Nishio technique
    - but this literally is random guessing?? but like limited random guessing? just lookahead.
    - lookahead, if one path results in a conflicting digit in X amount of moves, then we can elim that candidate
    - this is literally random guessing -__-

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