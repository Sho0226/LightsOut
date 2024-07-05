import { useEffect, useState } from 'react';
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
    ];

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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked!');
    animateButton(e);
  };

  const animateButton = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();

    const target = e.currentTarget as HTMLElement;
    // Reset animation
    target.classList.remove(styles.animate);

    // Trigger reflow to restart animation
    void target.offsetWidth;

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
        <button className={`${styles.navButton} ${styles.bubblyButton}`} onClick={handleClick}>
          <p>2x2</p>
        </button>
        <button className={`${styles.navButton} ${styles.bubblyButton}`} onClick={handleClick}>
          <p>3x3</p>
        </button>
        <button className={`${styles.navButton} ${styles.bubblyButton}`} onClick={handleClick}>
          <p>4x4</p>
        </button>
        <button className={`${styles.navButton} ${styles.bubblyButton}`} onClick={handleClick}>
          <p>5x5</p>
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
