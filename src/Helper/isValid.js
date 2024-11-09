export const isValid = (board, row, col, num) => {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) return false;
    }
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[startRow + i][startCol + j] === num) return false;
        }
    }
    return true;
};