const solveSudokuDFS = (board, stepsList = []) => {
    const solve = (row, col) => {
        if (row === 9) return true; // All rows are filled
        if (col === 9) return solve(row + 1, 0); // Move to the next row
        if (board[row][col] !== '.') return solve(row, col + 1); // Skip filled cells

        for (let num = 1; num <= 9; num++) {
            const n = num.toString();
            if (isValid(board, row, col, n)) {
                board[row][col] = n; // Place the number
                stepsList.push({ row, col, num: n }); // Record the step
                if (solve(row, col + 1)) return true; // Recur for next cell
                board[row][col] = '.'; // Backtrack
            }
        }
        return false; // Trigger backtracking
    };

    solve(0, 0); // Start from the top-left corner
};