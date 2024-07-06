import { useEffect, useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [boardSize, setBoardSize] = useState(2);
  const generateboard = (x: number, y: number, fill: number) =>
    [...Array(y)].map(() => [...Array(x)].map(() => fill));

  const [board, setBoard] = useState(generateboard(boardSize, boardSize, 0));

  const clickHandler = (x: number, y: number) => {
    const newBoard = structuredClone(board);
    const crossDirects = [
      [1, 0], // 右
      [0, 1], // 下
      [-1, 0], // 左
      [0, -1], // 上
    ];

    newBoard[y][x] = newBoard[y][x] === 0 ? 1 : 0;

    for (const [dx, dy] of crossDirects) {
      const newX = x + dx;
      const newY = y + dy;

      if (newBoard[newY]?.[newX] !== undefined) {
        newBoard[newY][newX] = newBoard[newY][newX] === 0 ? 1 : 0;
      }
    }

    setBoard(newBoard);
    console.table(newBoard);
  };

  const changeBoardSize = (size: number) => {
    setBoardSize(size);
    setBoard(generateboard(size, size, 0));
  };

  const resetBoard = () => {
    setBoard(generateboard(boardSize, boardSize, 0));
  };

  const randomizeBoard = () => {
    const newBoard = generateboard(boardSize, boardSize, 0).map((row) =>
      row.map(() => Math.round(Math.random())),
    );
    setBoard(newBoard);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, size: number) => {
    animateButton(e);
    changeBoardSize(size);
  };

  const animateButton = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.classList.remove(styles.animate); // Reset animation
    void target.offsetWidth; // Trigger reflow to restart animation
    target.classList.add(styles.animate);
  };

  useEffect(() => {
    const bubblyButtons = document.getElementsByClassName(styles.bubblyButton);

    for (let i = 0; i < bubblyButtons.length; i++) {
      bubblyButtons[i].addEventListener(
        'click',
        (e) => animateButton(e as unknown as React.MouseEvent<HTMLElement>),
        false,
      );
    }

    // Cleanup event listeners on component unmount
    return () => {
      for (let i = 0; i < bubblyButtons.length; i++) {
        bubblyButtons[i].removeEventListener(
          'click',
          (e) => animateButton(e as unknown as React.MouseEvent<HTMLElement>),
          false,
        );
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.topstyle}>
        <button
          className={`${styles.navButton} ${styles.bubblyButton}`}
          onClick={(e) => handleClick(e, 2)}
        >
          <p>2x2</p>
        </button>
        <button
          className={`${styles.navButton} ${styles.bubblyButton}`}
          onClick={(e) => handleClick(e, 3)}
        >
          <p>3x3</p>
        </button>
        <button
          className={`${styles.navButton} ${styles.bubblyButton}`}
          onClick={(e) => handleClick(e, 4)}
        >
          <p>4x4</p>
        </button>
        <button
          className={`${styles.navButton} ${styles.bubblyButton}`}
          onClick={(e) => handleClick(e, 5)}
        >
          <p>5x5</p>
        </button>
      </div>

      <div className={styles.boardContainer}>
        <button
          className={`${styles.navButton} ${styles.bubblyButton} ${styles.resetButton}`}
          onClick={resetBoard}
        >
          <p>Reset</p>
        </button>

        <div className={styles.boardstyle}>
          {board.map((row, y) =>
            row.map((cell, x) => (
              <div
                className={styles.cellstyle}
                key={`${x}-${y}`}
                onClick={() => clickHandler(x, y)}
                style={{
                  width: `${100 / boardSize}%`,
                  height: `${100 / boardSize}%`,
                }}
              >
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

        <button
          className={`${styles.navButton} ${styles.bubblyButton} ${styles.randomizeButton}`}
          onClick={randomizeBoard}
        >
          <p>Random</p>
        </button>
      </div>
    </div>
  );
};

export default Home;
