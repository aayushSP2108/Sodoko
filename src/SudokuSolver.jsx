import React, { useEffect, useState } from 'react';
import { boards } from './Components/boards';
import DisplayBoard from './Components/displayBoard';
import DisplayNumSelector from './Components/displayNumSelector';
import Parameters from './Components/displayParameters';
import { isValid } from './Helper/isValid';
import { BiReset } from "react-icons/bi";
// import { solveSudokuBackTracking } from './Helper/solveSudokuBackTracking';
import { solveSudokuBFS } from './Helper/solveSudokuBFS';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineMenuUnfold } from 'react-icons/ai';
import { MdMenuOpen } from 'react-icons/md';

const SudokuSolver = () => {
    const [showSidePanel, setShowSidePanel] = useState(false);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [hoveredCell, setHoveredCell] = useState(null);
    const [hoveredMatrix, setHoveredMatrix] = useState(Array(9).fill().map(() => Array(9).fill([1, 2, 3, 4, 5, 6, 7, 8, 9])));
    const [selectedOption, setSelectedOption] = useState("validDomain");
    const [ProbabilityColorMatrix, setProbabilityColorMatrix] = useState(Array(9).fill().map(() => Array(9).fill(1 / 9)));
    const [board, setBoard] = useState(boards[Math.floor(Math.random() * boards.length)]);
    const [inputValue, setInputValue] = useState('');
    const [selectedNum, setSelectedNum] = useState(null);
    const [possibleValues, setPossibleValues] = useState(Array(9).fill().map(() => Array(9).fill([])));


    // ================= Genral =================

    const resetBoard = () => {
        setBoard(boards[Math.floor(Math.random() * boards.length)]);
        setInputValue('');
        setSelectedNum(null);
        setSteps([]);
        setCurrentStep(0);
        setIsVisualizing(false);
        setPossibleValues(Array(9).fill().map(() => Array(9).fill([])));
    };

    const handleChange = (row, col, value) => {
        if (value === '' || /^[1-9]$/.test(value)) {
            const newBoard = board.map((r) => [...r]);
            const prevValue = newBoard[row][col];

            if (!isValid(newBoard, row, col, value)) {
                alert('Invalid input! The number already exists in the same row, column, or 3x3 grid.');
                newBoard[row][col] = prevValue;
            } else {
                newBoard[row][col] = value === '' ? '.' : value;
            }
            setBoard(newBoard);
            updatePossibleValues(newBoard);
            updateHoverValuesForwordChecking(newBoard);
            updateHoverValuesArcConsistency(newBoard);
        }
    };

    // ================= Bulding BackTracking HoverMatrix / PossibleValues Matrix =================

    const updatePossibleValues = (newBoard) => {
        const newAns = Array(9).fill().map(() => Array(9).fill([]));
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (newBoard[row][col] === '.') {
                    const candidates = [];
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num.toString())) {
                            candidates.push(num);
                        }
                    }
                    newAns[row][col] = candidates;
                }
            }
        }
        setPossibleValues(newAns);
    };

    // ================= Bulding ForwordChecking HoverMatrix =================

    const [hoverValuesForwordChecking, setHoverValuesForwordChecking] = useState(Array(9).fill().map(() => Array(9).fill([])));

    const checkForwordChecking = (board, row, col, num) => {
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

        if (possibleValues[row][col].length == 1) {
            return true
        }

        for (let i = 0; i < 9; i++) {
            if (possibleValues[row][i].length == 1) {
                // if(i == col) continue
                if (possibleValues[row][i].toString() === num) {
                    return false
                };
            };
        }
        for (let i = 0; i < 9; i++) {
            if (possibleValues[i][col].length == 1) {
                if (possibleValues[i][col].toString() === num) {
                    return false
                }
            };
        }

        const startRowx = Math.floor(row / 3) * 3;
        const startColx = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (possibleValues[startRowx + i][startColx + j].length == 1) {
                    if (possibleValues[startRowx + i][startColx + j].toString() === num) {
                        return false
                    }
                };
            }
        }
        return true;
    };

    const checkForwordCheckinginMatrix = (newAns, newBoard) => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (newBoard[row][col] === '.') {
                    const candidates = [];
                    newAns[row][col].forEach(element => {
                        if (checkForwordChecking(board, row, col, element.toString())) {
                            candidates.push(element);
                        }
                    });
                    if (newAns[row][col].length !== candidates.length) {
                        newAns[row][col] = candidates;
                    }
                }
            }
        }
    }
    const updateHoverValuesForwordChecking = (newBoard) => {
        const newAns = JSON.parse(JSON.stringify(possibleValues));
        checkForwordCheckinginMatrix(newAns, newBoard)
        setHoverValuesForwordChecking(newAns);
    };



    // ================= Bulding Arc Consistency HoverMatrix =================

    const [hoverValuesArcConsistency, setHoverValuesArcConsistency] = useState(Array(9).fill().map(() => Array(9).fill([]))); //useState(hoverValuesForwordChecking);  // hoverValuesForwordChecking : Array(9).fill().map(() => Array(9).fill([]))

    const checkArcConsistency = (board, row, col, num, newAns) => {
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

        if (newAns[row][col].length == 1) {
            return true
        }

        for (let i = 0; i < 9; i++) {
            if (newAns[row][i].length == 1) {
                // if(i == col) continue
                if (newAns[row][i].toString() === num) {
                    return false
                };
            };
        }
        for (let i = 0; i < 9; i++) {
            if (newAns[i][col].length == 1) {
                if (newAns[i][col].toString() === num) {
                    return false
                }
            };
        }

        const startRowx = Math.floor(row / 3) * 3;
        const startColx = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (newAns[startRowx + i][startColx + j].length == 1) {
                    if (newAns[startRowx + i][startColx + j].toString() === num) {
                        return false
                    }
                };
            }
        }
        return true;
    };

    const checkArcConsistencyinMatrix = (newAns, newBoard) => {
        let changesMade = false; // Flag to track if any changes occur

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (newBoard[row][col] === '.') {
                    const candidates = [];

                    newAns[row][col].forEach(element => {
                        if (checkArcConsistency(newBoard, row, col, element.toString(), newAns)) {
                            candidates.push(element);
                        }
                    });

                    if (newAns[row][col].length !== candidates.length) {
                        // console.log(newAns[row][col].length, candidates.length)
                        // console.log(newAns[row][col], candidates)
                        newAns[row][col] = candidates;
                        changesMade = true;
                    }
                }
            }
        }
        if (changesMade) {
            // console.log(newAns)
            checkArcConsistencyinMatrix(newAns, newBoard);
        }
    }

    const updateHoverValuesArcConsistency = (newBoard) => {
        const newAns = JSON.parse(JSON.stringify(possibleValues)); //possibleValues
        checkArcConsistencyinMatrix(newAns, newBoard)
        setHoverValuesArcConsistency(newAns);
    };


    // ================= Solve Sudoku using BFS =================

    // const solveSudokuBFS = (board, stepsList = []) => {
    //     const boardToString = (board) => {
    //         return board.map(row => row.join('')).join('');
    //     };

    //     const stringToBoard = (str) => {
    //         const board = [];
    //         for (let i = 0; i < 9; i++) {
    //             board.push(str.slice(i * 9, i * 9 + 9).split(''));
    //         }
    //         return board;
    //     };

    //     const queue = [boardToString(board)];
    //     const visited = new Set(queue);

    //     while (queue.length > 0) {
    //         const current = queue.shift();
    //         const currentBoard = stringToBoard(current);

    //         let foundEmpty = false;

    //         for (let row = 0; row < 9; row++) {
    //             for (let col = 0; col < 9; col++) {
    //                 if (currentBoard[row][col] === '.') {
    //                     foundEmpty = true;
    //                     for (let num = 1; num <= 9; num++) {
    //                         const numStr = num.toString();
    //                         if (isValid(currentBoard, row, col, numStr)) {
    //                             const nextBoard = currentBoard.map(r => r.slice());
    //                             nextBoard[row][col] = numStr;
    //                             const nextState = boardToString(nextBoard);

    //                             if (!visited.has(nextState)) {
    //                                 visited.add(nextState);
    //                                 queue.push(nextState);

    //                                 stepsList.push(nextBoard.map(r => r.slice()));

    //                                 if (nextBoard.every(r => r.every(c => c !== '.'))) {
    //                                     return stepsList; // Return all steps
    //                                 }
    //                             }
    //                         }
    //                     }
    //                     break;
    //                 }
    //             }
    //             if (foundEmpty) break;
    //         }
    //     }
    //     return stepsList;
    // };

    // ================= Solve Sudoku using Back Tracking =================

    const solveSudokuBackTracking = (board, stepsList = []) => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === '.') {
                    for (let num = 1; num <= 9; num++) {
                        const n = num.toString();
                        stepsList.push({ row, col, num: n });
                        if (isValid(board, row, col, n)) {
                            board[row][col] = n;

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

    // ================= Solve Sudoku using Forward Checking =================

    const solveSudokuForwardChecking = (board, stepsList = []) => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === '.') {

                    // no candidates available
                    const candidates = hoverValuesForwordChecking[row][col];
                    if (candidates.length == 0) {
                        return false;
                    }

                    for (let num of candidates) {
                        // for (let num = 1; num <= 9; num++) {
                        const n = num.toString();
                        stepsList.push({ row, col, num: n });
                        if (isValid(board, row, col, n)) {
                            board[row][col] = n;
                            updateHoverValuesForwordChecking(board);

                            // no candidates available
                            // for (let rowCheck = 0; rowCheck < 9; rowCheck++) {
                            //     for (let colCheck = 0; colCheck < 9; colCheck++) {
                            //         if (board[row][col] === '.') {
                            //             if (possibleValues[rowCheck][colCheck].length == 0) {
                            //                 return false;
                            //             }
                            //         }
                            //     }
                            // }

                            if (solveSudokuForwardChecking(board, stepsList)) {
                                return true;
                            }
                            board[row][col] = '.'; // Backtrack
                            updateHoverValuesForwordChecking(board);
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };

    // ================= Solve Sudoku using Arc Consistency =================

    const solveSudokuArcConsistency = (board, stepsList = []) => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === '.') {
                    // no candidates available
                    const candidates = hoverValuesArcConsistency[row][col];
                    if (candidates.length == 0) {
                        return false;
                    }

                    for (let num of candidates) {
                        // for (let num = 1; num <= 9; num++) {
                        const n = num.toString();
                        stepsList.push({ row, col, num: n });
                        if (isValid(board, row, col, n)) {
                            board[row][col] = n;
                            updateHoverValuesArcConsistency(board);

                            // no candidates available
                            // for (let rowCheck = 0; rowCheck < 9; rowCheck++) {
                            //     for (let colCheck = 0; colCheck < 9; colCheck++) {
                            //         if (board[row][col] === '.') {
                            //             if (possibleValues[rowCheck][colCheck].length == 0) {
                            //                 return false;
                            //             }
                            //         }
                            //     }
                            // }

                            if (solveSudokuArcConsistency(board, stepsList)) {
                                return true;
                            }
                            board[row][col] = '.'; // Backtrack
                            updateHoverValuesArcConsistency(board);
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    // ================= Probability Matrix Updations Mechanism =================

    const [probabilityMatrix, setProbabilityMatrix] = useState(Array(9).fill().map(() => Array(9).fill(0)));

    const calculateProbability = (row, col, num, board) => {
        const numStr = num.toString();
        let probability = 1;

        if (board[row].includes(numStr)) return 0;

        for (let i = 0; i < 9; i++) {
            if (board[i][col] === numStr) return 0;
        }

        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === numStr) return 0;
            }
        }

        let possibleCount = 0;
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === '.') possibleCount++;
            if (board[i][col] === '.') possibleCount++;
        }

        if (possibleCount > 0) {
            probability = 1 / possibleCount;
        }

        let filledNeighbors = 0;
        const neighborCoords = [
            [-1, 0], [1, 0], [0, -1], [0, 1], // Top, Bottom, Right, Left
            [-1, -1], [-1, 1], [1, -1], [1, 1] // Diagonals
        ];

        neighborCoords.forEach(([dx, dy]) => {
            const neighborRow = row + dx;
            const neighborCol = col + dy;
            if (neighborRow >= 0 && neighborRow < 9 && neighborCol >= 0 && neighborCol < 9) {
                if (board[neighborRow][neighborCol] !== '.') filledNeighbors++;
            }
        });

        probability += filledNeighbors * 0.1; // weighting

        var count = 0;
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === '.') {
                if (probabilityMatrix[row][i] > 0) {
                    count++
                }
                if (count > 1) {
                    count = 0
                    break
                }
            }
        }
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === '.') {
                if (probabilityMatrix[i][col] > 0) {
                    count++
                }
                if (count > 1) {
                    count = 0
                    break
                }
            }
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === '.') {
                    if (probabilityMatrix[startRow + i][startCol + j] > 0) {
                        count++
                    }
                }
            }
            if (count > 1) {
                count = 0
                break
            }
        }
        if (count != 0) {
            probability = 1
        }

        if (possibleValues[row][col].length == 1) {
            if (possibleValues[row][col][0] == num) {
                probability = 1
            }
        }

        return Math.min(probability, 1); // max probability to 1
    };

    const updateProbabilityMatrix = (selectedNum) => {
        const newProbabilityMatrix = Array.from({ length: 9 }, () => Array(9).fill(0));
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === '.') {
                    newProbabilityMatrix[row][col] = calculateProbability(row, col, selectedNum, board);
                }
            }
        }
        setProbabilityMatrix(newProbabilityMatrix);
    };

    // ================= Genral =================

    // --- DropDown Selection ---

    const [showProbability, setShowProbability] = useState(true);
    const [showHoverArray, setShowHoverArray] = useState(true);

    const handleDropdownChange = (value) => {
        setSelectedOption(value)
        changeHoverMatrix(value);

        toast(`Selected: ${value.charAt(0).toUpperCase() + value.slice(1)}`)
    };

    const changeHoverMatrix = (selectedOption) => {
        if (selectedOption == "validDomain") {
            setHoveredMatrix(Array(9).fill().map(() => Array(9).fill([1, 2, 3, 4, 5, 6, 7, 8, 9])))
        } if (selectedOption == "backTracking") {
            setHoveredMatrix(possibleValues)
        } if (selectedOption == "forwordChecking") {
            setHoveredMatrix(hoverValuesForwordChecking)
        } if (selectedOption == "arcConsistency") {
            setHoveredMatrix(hoverValuesArcConsistency)
        }
    }

    useEffect(() => {
        if (selectedNum) {
            updateProbabilityMatrix(selectedNum);
        }
    }, [selectedNum, board]);

    useEffect(() => {
        updatePossibleValues(board);
        // updateHoverValuesForwordChecking(board);
        // changeHoverMatrix(selectedOption);
    }, [board]); //possibleValues

    useEffect(() => {
        updateHoverValuesForwordChecking(board);
    }, [board, possibleValues]);

    useEffect(() => {
        updateHoverValuesArcConsistency(board);
    }, [board, hoverValuesForwordChecking]);

    useEffect(() => {
        changeHoverMatrix(selectedOption);
    }, [board, possibleValues, hoverValuesForwordChecking]);

    // --- visualize and solve Implementation ---

    const [speed, setSpeed] = useState(1000);
    const [activeCell, setActiveCell] = useState(null);

    const visualize = () => {
        const newBoard = board.map((r) => [...r]);
        const newSteps = [];

        if (selectedOption === 'validDomain') {
            solveSudokuBFS(newBoard, newSteps);
        } else if (selectedOption === 'backTracking') {
            solveSudokuBackTracking(newBoard, newSteps);
        } else if (selectedOption === 'forwordChecking') {
            solveSudokuForwardChecking(newBoard, newSteps);
        } else if (selectedOption === 'arcConsistency') {
            solveSudokuArcConsistency(newBoard, newSteps);
        }

        setSteps(newSteps);
        setCurrentStep(0);
        setIsVisualizing(true);
    };

    useEffect(() => {
        if (isVisualizing && currentStep < steps.length) {
            const step = steps[currentStep];
            const timer = setTimeout(() => {
                if (selectedOption == 'validDomain') {
                    setBoard(step);
                    setCurrentStep((prev) => prev + 1);
                    setActiveCell({ row: step.row, col: step.col });
                }

                const newBoard = board.map((r) => [...r]);
                newBoard[step.row][step.col] = step.num; // Update the board with the current step
                setBoard(newBoard);
                setActiveCell({ row: step.row, col: step.col });
                setCurrentStep((prev) => prev + 1); // Move to the next step

            }, speed);

            return () => clearTimeout(timer); // unmount
        } else if (currentStep >= steps.length) {
            setIsVisualizing(false);
            setActiveCell(null);
        }
    }, [isVisualizing, currentStep, steps, board, speed]);

    const solve = () => {
        const newBoard = board.map((r) => [...r]);
        // const possibleValues = initializePossibleValues(newBoard);

        if (selectedOption === 'validDomain') {
            const solvedSteps = solveSudokuBFS(newBoard);
            setBoard(solvedSteps[solvedSteps.length - 1]);
        } else if (selectedOption === 'backTracking') {
            solveSudokuBackTracking(newBoard);
            setBoard(newBoard);
        } else if (selectedOption === 'forwordChecking') {
            solveSudokuForwardChecking(newBoard);
            setBoard(newBoard);
        } else if (selectedOption === 'arcConsistency') {
            solveSudokuArcConsistency(newBoard);
            setBoard(newBoard);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '97vh',
        }}>
            <div style={{ position: 'absolute', top: 20, left: 20, justifyContent: 'left', alignContent: 'end' }}>
                <div
                    onClick={() => setShowSidePanel(!showSidePanel)}
                    style={{
                        cursor: 'pointer',
                        padding: '10px',
                        backgroundColor: '#011F35',
                        color: '#fff',
                        border: '1px solid #767676',
                        height: 30,
                        width: 30,
                        borderRadius: '50%',
                        // textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyItems: 'center',
                    }}
                >
                    <AiOutlineMenuUnfold size={110} />
                </div>
            </div>
            {showSidePanel && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '300px',
                        height: '97vh',
                        color: '#D7EBF1',
                        backgroundColor: '#011F35',
                        boxShadow: '-2px 0px 10px rgba(0, 0, 0, 0.1)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        zIndex: 1000,
                    }}
                >
                    <div style={{ top: 20, left: 20, justifyContent: 'left', alignContent: 'end' }}>
                        <div
                            onClick={() => setShowSidePanel(!showSidePanel)}
                            style={{
                                cursor: 'pointer',
                                padding: '10px',
                                // backgroundColor: '#fff',
                                border: '1px solid #767676',
                                height: 30,
                                width: 30,
                                borderRadius: '50%',
                                // textAlign: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyItems: 'center',
                            }}
                        >
                            <MdMenuOpen size={110} />
                        </div>
                    </div>
                    <h2 style={{ color: '#FFFFFF' }}>Game Description</h2>
                    <p >This is a Sudoku game where you can solve and visualize the puzzle using different algorithms like Backtracking, Forward Checking, Arc Consistency, and more.</p>
                    <h3 style={{ color: '#FFFFFF' }}>How to Play</h3>
                    <p>Click on the cells to input your numbers. You can select different options from the dropdown for various solving strategies.</p>
                    <h3 style={{ color: '#FFFFFF' }}>Use the following matrix to better visualize each method</h3>
                    <p>[
                        ["5", "3", ".", ".", "7", ".", ".", ".", "."], <br />
                        ["6", ".", ".", "1", "9", "5", ".", ".", "."], <br />
                        [".", "9", "8", ".", ".", ".", ".", "6", "."], <br />
                        ["8", ".", ".", ".", "6", ".", ".", ".", "3"], <br />
                        ["4", ".", ".", "8", ".", "3", ".", ".", "1"], <br />
                        ["7", ".", ".", ".", "2", ".", ".", ".", "6"], <br />
                        [".", "6", ".", ".", ".", ".", "2", "8", "."], <br />
                        [".", ".", ".", "4", "1", "9", ".", ".", "5"], <br />
                        [".", ".", ".", ".", "8", ".", ".", "7", "9"]
                        ]</p>
                </div>
            )}



            <div style={{
                position: 'absolute',
                top: 20,
                right: 20,
                justifyContent: 'left',
                alignContent: 'end',
            }}>
                {/* #4F4F4F */}

                <div
                    onClick={() => setShowProbability(!showProbability)} style={{ marginBottom: 10, cursor: 'pointer', fontSize: '16px', paddingTop: '5px', paddingBottom: '5px', paddingLeft: '9px', backgroundColor: '#fff', border: '1px solid #767676', borderRadius: 3, textAlign: 'left' }}>
                    {showProbability ? 'Hide' : 'Show'} Probability
                </div>
                <div
                    onClick={() => setShowHoverArray(!showHoverArray)} style={{ marginBottom: 10, cursor: 'pointer', fontSize: '16px', paddingTop: '5px', paddingBottom: '5px', paddingLeft: '9px', backgroundColor: '#fff', border: '1px solid #767676', borderRadius: 3, textAlign: 'left' }}>
                    {showHoverArray ? 'Hide' : 'Show'} Hover Array
                </div>
                <select
                    style={{ fontSize: '16px', padding: '5px' }}
                    value={selectedOption}
                    onChange={(e) => handleDropdownChange(e.target.value)}
                >
                    <option value="validDomain">Valid Domain</option>
                    <option value="backTracking">Back Tracking</option>
                    <option value="forwordChecking">Forword Checking</option>
                    <option value="arcConsistency">Arc Consistency</option>
                    <option value="blackBox">Black Box</option>
                </select>
                {/* <div 
                    onClick={resetBoard} 
                    style={{ marginBottom: 10, cursor: 'pointer', fontSize: '16px', padding: '5px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: 3 }}>
                    <BiReset />
                </div>
                <div 
                    onClick={resetBoard} 
                    >
                    <BiReset />
                </div> */}
                <div style={{ display: 'flex', justifyContent: 'end', marginTop: 10, textAlign: 'left' }} >
                    <button
                        onClick={resetBoard}
                        style={{ cursor: 'pointer', fontSize: '16px', paddingTop: '8px', paddingBottom: '5px', paddingLeft: '9px', backgroundColor: '#FA1613', border: '1px solid #C32E34', borderRadius: 3, }}>
                        <BiReset color='#fff' />
                    </button>
                </div>
            </div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 20, fontSize: 40, fontWeight: 900 }}>Sudoku</div>
            <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                    <DisplayBoard
                        board={board}
                        handleChange={handleChange}
                        selectedNum={selectedNum}
                        showProbability={showProbability}
                        hoveredMatrix={hoveredMatrix}
                        setHoveredCell={setHoveredCell}
                        hoveredCell={hoveredCell}
                        activeCell={activeCell}
                        showHoverArray={showHoverArray}
                        selectedOption={selectedOption}
                        calculateProbability={calculateProbability}
                    />
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    <Parameters // Seting Board on input values - Adjesing speed - solve and visualize button 
                        setInputValue={setInputValue}
                        inputValue={inputValue}
                        solve={solve}
                        visualize={visualize}
                        speed={speed}
                        setBoard={setBoard}
                        setSpeed={setSpeed}
                    />
                </div>
            </div>
            <div>
                <DisplayNumSelector selectedNum={selectedNum} setSelectedNum={setSelectedNum} />
            </div>

            <ToastContainer position="top-left" />
        </div>
    );
};

export default SudokuSolver;