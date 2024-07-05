import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [2, 1],
    [0, 0],
  ]);

  const directions = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  const clickHandler = (x: number, y: number) => {
    const newBoard = structuredClone(board);
    const crossDirects = [
      [1, 0], // 右
      [0, 1], // 下
      [-1, 0], // 左
      [0, -1], // 上
    ]; // directions の例

    for (const [dx, dy] of crossDirects) {
      const newX = x + dx;
      const newY = y + dy;

      if (newBoard[newY]?.[newX] !== undefined) {
        newBoard[y][x] = turnColor;
        newBoard[newY][newX] = turnColor;
      }
    }

    setTurnColor(3 - turnColor);
    setBoard(newBoard);
    console.table(newBoard);
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
                  style={{
                    background:
                      cell === 1 ? '#8de2ff' : cell === 2 ? 'rgb(221, 227, 233)' : '#8de2ff',
                  }}
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
