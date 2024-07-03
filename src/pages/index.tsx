import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0],
    [0, 0],
  ]);
  const clickHandler = (x: number, y: number) => {
    const newBoard = structuredClone(board);
    newBoard[y][x] = turnColor;
    setTurnColor(3 - turnColor);
    setBoard(newBoard);
  };

  return (
    <div className={styles.container}>
      <div className={styles.boardstyle}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div className={styles.cellstyle} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              {cell !== 0 && (
                <div
                  className={styles.colorstyle}
                  style={{ background: cell === 1 ? '#000' : cell === 2 ? '#fff' : '#241b02' }}
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export default Home;
