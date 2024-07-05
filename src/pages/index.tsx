import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [1, 1],
    [0, 0],
  ]);

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
        [newBoard[y][x], newBoard[newY][newX]] = [turnColor, turnColor];
      }
    }

    setTurnColor(3 - turnColor);
    setBoard(newBoard);
    console.table(newBoard);
  };
  const colorNum = board.flat().filter((cell) => cell !== 0).length;
  console.log(colorNum);

  const handleClick = () => {
    console.log('Button clicked!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.topstyle}>
        <button className={styles.navButton} onClick={handleClick}>
          2x2
        </button>
      </div>

      <div className={styles.boardstyle}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div className={styles.cellstyle} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              <div
                className={styles.colorstyle}
                style={{
                  background: cell === 1 ? '#8de2ff' : 'rgb(221, 227, 233)',
                }}
              />
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export default Home;
