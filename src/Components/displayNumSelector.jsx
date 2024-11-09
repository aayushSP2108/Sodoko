import React from 'react'

export default function DisplayNumSelector({ selectedNum, setSelectedNum }) {
  return (
        <div style={{ display: 'flex', gap: 4, marginTop: 25 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, null].map((item) => (
                    <div
                        key={item}
                        style={{
                            paddingLeft: '15px', paddingRight: '15px', paddingTop: '10px', paddingBottom: '10px',
                            textAlign: 'center',
                            alignContent: 'center',
                            fontSize: '26px',
                            outline: 'none',
                            border: '2px solid ',
                            borderColor: selectedNum === item ? '#011F35' : '#AAD9DE',
                            backgroundColor: selectedNum === item ? '#D7ECF1' : '#FFFFFF',
                            cursor: 'pointer',
                        }}
                        onClick={() => setSelectedNum(item)}
                    >
                        {item ? item : 'Not Selected'}
                    </div>
                ))}
            </div>
  )
}
