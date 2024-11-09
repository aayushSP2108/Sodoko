import React from 'react';

const DisplayBoard = ({ board, handleChange, selectedNum, showProbability, hoveredMatrix, setHoveredCell, hoveredCell, activeCell, showHoverArray, selectedOption, calculateProbability }) => {
    const calculateColorProbability = (rowIndex, colIndex, selectedNum, board, hoveredMatrix) => {
        if (hoveredMatrix[rowIndex][colIndex].includes(selectedNum)) {
            return 1 / hoveredMatrix[rowIndex][colIndex].length
        } else {
            return 0
        }
    }

    const probabilityToColor = (probability) => {
        const greenValue = Math.floor(126 + (126 * (probability)));
        return `rgba(0, ${greenValue}, 0, 0.81)`;
    };
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(9, auto)',
            border: '20px solid #011F35',
            borderRadius: '12px',
        }}>
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    const thickBorderStyle = {
                        borderTop: rowIndex % 3 === 0 ? '2px solid #60A0A2' : '1px solid #AAD9DE',
                        borderBottom: rowIndex % 3 === 2 ? '2px solid #60A0A2' : '1px solid #AAD9DE',
                        borderLeft: colIndex % 3 === 0 ? '2px solid #60A0A2' : '1px solid #AAD9DE',
                        borderRight: colIndex % 3 === 2 ? '2px solid #60A0A2' : '1px solid #AAD9DE'
                    };

                    const probability = cell === '.' ? selectedNum && (selectedOption == 'blackBox' ? calculateProbability(rowIndex, colIndex, selectedNum, board).toFixed(2) : calculateColorProbability(rowIndex, colIndex, selectedNum, board, hoveredMatrix).toFixed(2)) : null;
                    const isActive = activeCell && activeCell.row === rowIndex && activeCell.col === colIndex;

                    return (
                        <div key={`${rowIndex}-${colIndex}`} style={{ position: 'relative' }}>
                            <input
                                onMouseEnter={() => setHoveredCell(`${rowIndex}-${colIndex}`)}
                                onMouseLeave={() => setHoveredCell(null)}
                                value={cell === '.' ? '' : cell}
                                onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                                maxLength={1}
                                style={{
                                    cursor: 'pointer',
                                    width: '40px',
                                    height: '40px',
                                    textAlign: 'center',
                                    fontSize: '26px',
                                    outline: 'none',
                                    ...thickBorderStyle,
                                    backgroundColor: isActive ? 'red' : (cell === '.' ? (probability !== null ? probabilityToColor(probability) : '#FFFFFF') : '#D7ECF1'), // Change background if active
                                    // backgroundColor: cell === '.' ? (probability !== null ? probabilityToColor(probability) : '#FFFFFF') : '#D7ECF1',
                                    transition: 'background-color 0.3s, border 0.3s, box-shadow 0.3s',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                                }}
                            />
                            {showHoverArray && hoveredCell === `${rowIndex}-${colIndex}` && cell === '.' && (
                                <div style={{ position: 'absolute', left: 31, top: -31, background: '#D7ECF1', border: '2px solid #60A0A2', width: 100, padding: 5, zIndex: 9999 }}>
                                    {hoveredMatrix[rowIndex][colIndex].join(', ')}
                                </div>
                            )}
                            {cell === '.' && selectedNum && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: 5,
                                    left: 5,
                                    fontSize: '12px',
                                    color: 'black',
                                }}>
                                    {showProbability && (selectedOption == 'blackBox' ? calculateProbability(rowIndex, colIndex, selectedNum, board).toFixed(2) : calculateColorProbability(rowIndex, colIndex, selectedNum, board, hoveredMatrix).toFixed(2))}
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default DisplayBoard;