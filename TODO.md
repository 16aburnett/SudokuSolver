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