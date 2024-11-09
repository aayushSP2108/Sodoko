import React from 'react'

export default function Parameters({ setInputValue, inputValue, solve, visualize, speed, setSpeed, setBoard }) {

    const parseInput = (input) => {
        try {
            const parsedBoard = JSON.parse(input);
            if (Array.isArray(parsedBoard) && parsedBoard.length === 9 && parsedBoard.every(row => Array.isArray(row) && row.length === 9)) {
                setBoard(parsedBoard); // Assuming setBoard is defined elsewhere
            } else {
                alert("Invalid board format. Please ensure it is a 9x9 array.");
            }
        } catch (error) {
            alert("Failed to parse input. Please ensure it is valid JSON.");
            console.error("Parsing error:", error); // Log the error for debugging
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        }}>
            <div style={{ textAlign: 'left', fontSize: 20, fontWeight: 600 }}>Array input for initial state</div>
            <textarea
                rows={10}
                cols={39}
                value={inputValue}
                style={{ borderRadius: 12, padding: 8 }}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder='Enter board as JSON array...'
            />
            <div style={{ cursor: 'pointer', padding: 10, textAlign: 'center', background: '#011F35', color: '#fff', borderRadius: 12 }} onClick={() => parseInput(inputValue)}>Set Board</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ cursor: 'pointer', textAlign: 'center', padding: 10, background: '#011F35', color: '#fff', borderRadius: 12, width: '43%' }} onClick={solve}>Solve</div>
                <div style={{ cursor: 'pointer', textAlign: 'center', padding: 10, background: '#011F35', color: '#fff', borderRadius: 12, width: '43%' }} onClick={visualize}>Visualize</div>
            </div>


            <div style={{
                display: 'flex',
                // justifyContent: 'space-between', 
                alignItems: 'center',
                textAlign: 'justify',
                fontSize: 16, fontWeight: 600
            }}>
                {/* <span>Speed Control:</span> */}
                <span>Time Per Step:</span>
                <input
                    type="range"
                    min="1"
                    max="2000"
                    step="10"
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    style={{ marginLeft: 10 }}
                />
                <span style={{ marginLeft: 10 }}>
                    {speed < 1000 ? `${(speed / 10).toFixed(0)}ms` : `${(speed / 1000).toFixed(2)}sec`}
                </span>
            </div>
        </div>
    )
}
