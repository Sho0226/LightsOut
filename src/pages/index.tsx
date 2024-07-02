import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0],
    [0, 0],
  ]);
  const clickHandler = (x: number, y: number) => {};

  return (
    <div className={styles.container}>
      <div className={styles.boardstyle}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              className={styles.cellstyle}
              key={`${x}-${y}`}
              onClick={() => clickHandler(x, y)}
            />
          )),
        )}
      </div>
    </div>
  );
};

export default Home;
