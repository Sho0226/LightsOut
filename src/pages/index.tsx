import styles from './index.module.css';

const Home = () => {
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
