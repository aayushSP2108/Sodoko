// import React, { useState } from 'react';

// const SudokuSolver = () => {
//     const [board, setBoard] = useState([
//         [".", "3", ".", ".", "7", ".", ".", ".", "."],
//         ["6", ".", ".", "1", "9", "5", ".", ".", "."],
//         [".", "9", "8", ".", ".", ".", ".", "6", "."],
//         ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
//         ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
//         ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
//         [".", "6", ".", ".", ".", ".", "2", "8", "."],
//         [".", ".", ".", "4", "1", "9", ".", ".", "5"],
//         [".", ".", ".", ".", "8", ".", ".", "7", "9"]
//     ]);
//     const [inputValue, setInputValue] = useState('');
//     const [selectedNum, setSelectedNum] = useState(null);

//     const [ans, setAns] = useState(Array(9).fill().map(() => Array(9).fill([])));

//     const updateAnsGrid = (newBoard) => {
//         const newAns = Array(9).fill().map(() => Array(9).fill([]));
//         for (let row = 0; row < 9; row++) {
//             for (let col = 0; col < 9; col++) {
//                 if (newBoard[row][col] === '.') {
//                     const candidates = [];
//                     for (let num = 1; num <= 9; num++) {
//                         if (canPlaceNumber(row, col, num, newBoard)) {
//                             candidates.push(num);
//                         }
//                     }
//                     newAns[row][col] = candidates;
//                 }
//             }
//         }
//         setAns(newAns);
//     };

//     const handleChange = (row, col, value) => {
//         if (value === '' || /^[1-9]$/.test(value)) {
//             const newBoard = board.map((r) => [...r]);
//             const prevValue = newBoard[row][col];

//             if (!isValid(newBoard, row, col, value)) {
//                 alert('Invalid input! The number already exists in the same row, column, or 3x3 grid.');
//                 newBoard[row][col] = prevValue; // Revert to previous value if invalid
//             } else {
//                 newBoard[row][col] = value === '' ? '.' : value;
//             }
//             setBoard(newBoard);
//             updateAnsGrid(newBoard);
//         }
//     };

//     const parseInput = (input) => {
//         try {
//             const parsedBoard = JSON.parse(input);
//             if (Array.isArray(parsedBoard) && parsedBoard.length === 9 && parsedBoard.every(row => row.length === 9)) {
//                 setBoard(parsedBoard);
//                 updateAnsGrid(parsedBoard);
//             } else {
//                 alert("Invalid board format. Please ensure it is a 9x9 array.");
//             }
//         } catch (error) {
//             alert("Failed to parse input. Please ensure it is valid JSON.");
//         }
//     };

//     const isValid = (board, row, col, num) => {
//         for (let i = 0; i < 9; i++) {
//             if (board[row][i] === num) return false;
//         }
//         for (let i = 0; i < 9; i++) {
//             if (board[i][col] === num) return false;
//         }
//         const startRow = Math.floor(row / 3) * 3;
//         const startCol = Math.floor(col / 3) * 3;
//         for (let i = 0; i < 3; i++) {
//             for (let j = 0; j < 3; j++) {
//                 if (board[startRow + i][startCol + j] === num) return false;
//             }
//         }
//         return true;
//     };

//     const canPlaceNumber = (row, col, num, board) => {
//         return isValid(board, row, col, num.toString());
//     };

//     const solveSudoku = (board) => {
//         for (let row = 0; row < 9; row++) {
//             for (let col = 0; col < 9; col++) {
//                 if (board[row][col] === '.') {
//                     for (let num = 1; num <= 9; num++) {
//                         const n = num.toString();
//                         if (isValid(board, row, col, n)) {
//                             board[row][col] = n;
//                             if (solveSudoku(board)) {
//                                 return true;
//                             }
//                             board[row][col] = '.'; // Backtrack
//                         }
//                     }
//                     return false;
//                 }
//             }
//         }
//         return true; // Solved
//     };

//     const solve = () => {
//         const newBoard = board.map((r) => [...r]);
//         solveSudoku(newBoard);
//         setBoard(newBoard);
//     };

//     return (
//         <div style={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: '100%',
//             height: '97vh',
//         }}>
//             <div style={{ display: 'flex', gap: 4, marginBottom: 20, fontSize: 40, fontWeight: 900 }}>Sudoku</div>
//             <div style={{ display: 'flex', gap: '20px' }}>
//                 <div>
//                     <div style={{
//                         display: 'grid',
//                         gridTemplateColumns: 'repeat(9, auto)',
//                         border: '20px solid #011F35',
//                         borderRadius: '12px',
//                     }}>
//                         {board.map((row, rowIndex) =>
//                             row.map((cell, colIndex) => {
//                                 const thickBorderStyle = {
//                                     borderTop: rowIndex % 3 === 0 ? '2px solid #60A0A2' : '1px solid #AAD9DE',
//                                     borderBottom: rowIndex % 3 === 2 ? '2px solid #60A0A2' : '1px solid #AAD9DE',
//                                     borderLeft: colIndex % 3 === 0 ? '2px solid #60A0A2' : '1px solid #AAD9DE',
//                                     borderRight: colIndex % 3 === 2 ? '2px solid #60A0A2' : '1px solid #AAD9DE'
//                                 };
//                                 return (
//                                     <div key={`${rowIndex}-${colIndex}`} style={{ position: 'relative' }}>
//                                         <input
//                                             value={cell === '.' ? '' : cell}
//                                             onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
//                                             maxLength={1}
//                                             style={{
//                                                 width: '40px',
//                                                 height: '40px',
//                                                 textAlign: 'center',
//                                                 fontSize: '26px',
//                                                 outline: 'none',
//                                                 ...thickBorderStyle,
//                                                 backgroundColor: cell === '.' ? '#FFFFFF' : '#D7ECF1',
//                                                 transition: 'background-color 0.3s, border 0.3s, box-shadow 0.3s',
//                                                 boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
//                                             }}
//                                         />
//                                         {/* Display validity for selected number */}
//                                         {cell === '.' && selectedNum && (
//                                             <div style={{
//                                                 position: 'absolute',
//                                                 bottom: 5,
//                                                 left: 5,
//                                                 fontSize: '12px',
//                                                 color: canPlaceNumber(rowIndex, colIndex, selectedNum, board) ? 'green' : 'red',
//                                             }}>
//                                                 {console.log(ans)}
//                                                 {canPlaceNumber(rowIndex, colIndex, selectedNum, board) ? '✓' : 'X'}
//                                             </div>
//                                         )}
//                                     </div>
//                                 );
//                             })
//                         )}
//                     </div>
//                 </div>

//                 <div style={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     justifyContent: 'center',
//                     gap: '8px',
//                 }}>
//                     <div style={{ textAlign: 'left', fontSize: 20, fontWeight: 600 }}>Array input for initial state</div>
//                     <textarea
//                         rows={10}
//                         cols={39}
//                         value={inputValue}
//                         style={{ borderRadius: 12, padding: 8 }}
//                         onChange={(e) => setInputValue(e.target.value)}
//                         placeholder='Enter board as JSON array...'
//                     />
//                     <div style={{ cursor: 'pointer', padding: 10, background: '#011F35', color: '#fff', borderRadius: 12 }} onClick={() => parseInput(inputValue)}>Set Board</div>
//                     <div style={{ cursor: 'pointer', padding: 10, background: '#011F35', color: '#fff', borderRadius: 12 }} onClick={solve}>Solve</div>
//                 </div>
//             </div>
//             <div style={{ display: 'flex', gap: 4, marginTop: 25 }}>
//                 {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
//                     <div
//                         key={item}
//                         style={{
//                             width: '40px',
//                             height: '40px',
//                             textAlign: 'center',
//                             alignContent: 'center',
//                             fontSize: '26px',
//                             outline: 'none',
//                             border: '2px solid ',
//                             borderColor: selectedNum === item ? '#011F35' : '#AAD9DE',
//                             backgroundColor: selectedNum === item ? '#D7ECF1' : '#FFFFFF',
//                             cursor: 'pointer',
//                         }}
//                         onClick={() => setSelectedNum(item)}
//                     >
//                         {item}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default SudokuSolver;
