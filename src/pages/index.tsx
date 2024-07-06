import { useEffect, useState } from 'react';
import styles from './index.module.css';

// generateRandomBoard関数をコンポーネントの外に移動
const generateRandomBoard = (size: number): number[][] => {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.round(Math.random())),
  );
};

const Home = () => {
  const [boardSize, setBoardSize] = useState(2);
  const [isCleared, setIsCleared] = useState(false);
  const [cellColor, setCellColor] = useState('#8de2ff');
  const [randomBoard, setRandomBoard] = useState<number[][]>(generateRandomBoard(boardSize));

  const pastelColors = [
    '#ffadad',
    '#ffd6a5',
    '#fdffb6',
    '#caffbf',
    '#9bf6ff',
    '#a0c4ff',
    '#bdb2ff',
    '#ffc6ff',
    '#ffb3ba',
    '#ffdfba',
    '#ffffba',
    '#baffc9',
    '#bae1ff',
    '#f3b5a9',
    '#e2c2c6',
    '#c0deff',
    '#f2d5f8',
    '#e5c9f2',
    '#c9f2d5',
  ];

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * pastelColors.length);
    return pastelColors[randomIndex];
  };

  const generateBoard = (x: number, y: number, fill: number) =>
    Array.from({ length: y }, () => Array.from({ length: x }, () => fill));

  const [board, setBoard] = useState<number[][]>(generateBoard(boardSize, boardSize, 0));
  const [history, setHistory] = useState<number[][][]>([]);

  const clickHandler = (x: number, y: number) => {
    if (isCleared) return;
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
    setHistory([...history, board]);
    setBoard(newBoard);
    console.table(newBoard);

    if (isBoardCleared(newBoard)) {
      setIsCleared(true);
    }
  };

  const undo = () => {
    if (history.length > 0) {
      const lastBoard = history[history.length - 1];
      setHistory(history.slice(0, history.length - 1)); // 履歴から最後の状態を削除
      setBoard(lastBoard);
    }
  };

  const changeBoardSize = (size: number) => {
    const color = getRandomColor();
    const newRandomBoard = generateRandomBoard(size);
    setBoardSize(size);
    setBoard(generateBoard(size, size, 0));
    setIsCleared(false);
    setCellColor(color);
    setRandomBoard(newRandomBoard);
    document.documentElement.style.setProperty('--bubble-color', color);
  };

  const resetBoard = () => {
    const color = getRandomColor();
    setBoard(generateBoard(boardSize, boardSize, 0));
    setIsCleared(false);
    setCellColor(color);
    document.documentElement.style.setProperty('--bubble-color', color);
  };

  const randomizeBoard = () => {
    const color = getRandomColor();
    const newBoard = generateRandomBoard(boardSize);
    setBoard(newBoard);
    setRandomBoard(newBoard); // ここでランダムボードを保存
    setIsCleared(false);
    setCellColor(color);
    document.documentElement.style.setProperty('--bubble-color', color);
  };

  const applyRandomBoard = () => {
    setBoard(structuredClone(randomBoard));
    setIsCleared(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, size: number) => {
    animateButton(e);
    changeBoardSize(size);
  };

  const animateButton = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    const target = e.currentTarget;
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
        <button
          className={`${styles.navButton} ${styles.bubblyButton}`}
          onClick={(e) => handleClick(e, 6)}
        >
          <p>6x6</p>
        </button>
      </div>

      <div className={styles.boardContainer}>
        <div className={styles.leftContainer}>
          <button
            className={`${styles.navButton} ${styles.bubblyButton} ${styles.randomButton}`}
            onClick={randomizeBoard}
          >
            <p>Next Random</p>
          </button>
          <button
            className={`${styles.navButton} ${styles.bubblyButton} ${styles.randomButton}`}
            onClick={applyRandomBoard}
          >
            <p>Reset Random</p>
          </button>
        </div>

        <div className={`${styles.boardstyle} ${isCleared ? styles.cleared : ''}`}>
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
                    background: cell === 1 ? cellColor : 'rgb(221, 227, 233)',
                  }}
                />
              </div>
            )),
          )}
        </div>

        <div className={styles.rightContainer}>
          <button
            className={`${styles.navButton} ${styles.bubblyButton} ${styles.undoButton}`}
            onClick={undo}
          >
            <p>Return</p>
          </button>
          <button
            className={`${styles.navButton} ${styles.bubblyButton} ${styles.resetButton}`}
            onClick={resetBoard}
          >
            <p>Reset</p>
          </button>
        </div>

        <div className={`${styles.clearMessage} ${isCleared ? styles.show : ''}`}>Cleared!</div>
      </div>
    </div>
  );
};

const isBoardCleared = (board: number[][]) => {
  return board.every((row) => row.every((cell) => cell === 1));
};

export default Home;
