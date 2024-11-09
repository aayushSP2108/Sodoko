import { isValid } from "./isValid";

export const solveSudokuBackTracking = (board, stepsList = []) => {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === '.') {
                for (let num = 1; num <= 9; num++) {
                    const n = num.toString();
                    if (isValid(board, row, col, n)) {
                        board[row][col] = n;
                        stepsList.push({ row, col, num: n });
                        if (solveSudokuBackTracking(board, stepsList)) {
                            return true;
                        }
                        board[row][col] = '.'; // Backtrack
                    }
                }
                return false;
            }
        }
    }
    return true;
};