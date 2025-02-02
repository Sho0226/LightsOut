import { useEffect, useState } from 'react';
import styles from './index.module.css';

const generateRandomBoard = (size: number): number[][] => {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.round(Math.random())),
  );
};

const generateSolvableBoard = (size: number): number[][] => {
  const board = Array.from({ length: size }, () => Array(size).fill(0));
  const solution = generateRandomBoard(size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (solution[y][x] === 1) {
        clickHandler(board, x, y);
      }
    }
  }
  return board;
};

const clickHandler = (board: number[][], x: number, y: number) => {
  const crossDirects = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  board[y][x] = board[y][x] === 0 ? 1 : 0;
  for (const [dx, dy] of crossDirects) {
    const newX = x + dx;
    const newY = y + dy;

    if (board[newY]?.[newX] !== undefined) {
      board[newY][newX] = board[newY][newX] === 0 ? 1 : 0;
    }
  }
};

const Home = () => {
  const [boardSize, setBoardSize] = useState(2);
  const [isCleared, setIsCleared] = useState(false);
  const [cellColor, setCellColor] = useState('#8de2ff');
  const [board, setBoard] = useState<number[][]>(generateSolvableBoard(boardSize));
  const [history, setHistory] = useState<number[][][]>([]);
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

  const clickHandlerWrapper = (x: number, y: number) => {
    if (isCleared) return;
    const newBoard = structuredClone(board);
    clickHandler(newBoard, x, y);
    setHistory([...history, board]);
    setBoard(newBoard);
    console.table(newBoard);

    if (isBoardCleared(newBoard)) {
      setIsCleared(true);
    }
  };

  const undo = () => {
    if (isCleared) return;
    if (history.length > 0) {
      const lastBoard = history[history.length - 1];
      setHistory(history.slice(0, history.length - 1));
      setBoard(lastBoard);
    }
  };

  const changeBoardSize = (size: number) => {
    const color = getRandomColor();
    const newBoard = generateSolvableBoard(size);
    setBoardSize(size);
    setBoard(newBoard);
    setIsCleared(false);
    setCellColor(color);
    setRandomBoard(generateRandomBoard(size));
    document.documentElement.style.setProperty('--bubble-color', color);
  };

  const resetBoard = () => {
    setBoard(Array.from({ length: boardSize }, () => Array(boardSize).fill(0)));
    setIsCleared(false);
  };

  const randomizeBoard = () => {
    const color = getRandomColor();
    const newBoard = generateSolvableBoard(boardSize);
    setBoard(newBoard);
    setRandomBoard(newBoard);
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
    target.classList.remove(styles.animate);
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

  const buttonSizes = [2, 3, 4, 5, 6, 7, 8, 9, 10, 100];

  return (
    <div className={styles.container}>
      <div className={styles.topstyle}>
        <>
          {buttonSizes.map((size) => (
            <button
              key={size}
              className={`${styles.navButton} ${styles.bubblyButton}`}
              onClick={(e) => handleClick(e, size)}
            >
              <p>
                {size}x{size}
              </p>
            </button>
          ))}
        </>
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
                onClick={() => clickHandlerWrapper(x, y)}
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
