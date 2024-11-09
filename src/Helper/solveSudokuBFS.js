import { isValid } from "./isValid";

export const solveSudokuBFS = (board, stepsList = []) => {
    const boardToString = (board) => {
        return board.map(row => row.join('')).join('');
    };

    const stringToBoard = (str) => {
        const board = [];
        for (let i = 0; i < 9; i++) {
            board.push(str.slice(i * 9, i * 9 + 9).split(''));
        }
        return board;
    };

    const queue = [boardToString(board)];
    const visited = new Set(queue);

    while (queue.length > 0) {
        const current = queue.shift();
        const currentBoard = stringToBoard(current);

        let foundEmpty = false;

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (currentBoard[row][col] === '.') {
                    foundEmpty = true;
                    for (let num = 1; num <= 9; num++) {
                        const numStr = num.toString();
                        if (isValid(currentBoard, row, col, numStr)) {
                            const nextBoard = currentBoard.map(r => r.slice());
                            nextBoard[row][col] = numStr;
                            const nextState = boardToString(nextBoard);

                            if (!visited.has(nextState)) {
                                visited.add(nextState);
                                queue.push(nextState);

                                stepsList.push(nextBoard.map(r => r.slice()));

                                if (nextBoard.every(r => r.every(c => c !== '.'))) {
                                    return stepsList; // Return all steps
                                }
                            }
                        }
                    }
                    break;
                }
            }
            if (foundEmpty) break;
        }
    }
    return stepsList;
};