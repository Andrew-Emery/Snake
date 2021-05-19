import "./App.css";
import { useState, useEffect } from "react";
import { FaBug, FaRegMehRollingEyes } from "react-icons/fa";
import eyes from './cartoon-eyes.svg';

const gridWidth = 30;
const gridHeight = 30;
const cells = new Array(gridHeight * gridWidth)
  .fill(undefined)
  .map((val, idx) => idx);

type Direction = "up" | "down" | "left" | "right";

const defaultSnekSize = [
  cells.length / 2 + gridWidth / 2,
  cells.length / 2 + gridWidth / 2 + 1,
  cells.length / 2 + gridWidth / 2 + 2,
];

const moveHead = (position: number, direction: Direction) => {
  const trueX = position % gridWidth;
  const trueY = Math.floor(position / gridWidth);

  const steps = {
    up: -gridWidth,
    down: gridWidth,
    left: -1,
    right: 1,
  };

  const newPosition = position + steps[direction];
  if (direction === "right" && trueX === gridWidth - 1)
    return position - gridWidth + 1;
  if (direction === "left" && trueX === 0) return position + gridWidth - 1;
  if (newPosition < 0) return cells.length + newPosition;
  if (newPosition > cells.length) return newPosition - cells.length;

  return newPosition;
};

const randomFood = (snake: number[]) => {
  const nonSnakeCells = cells.filter((item) => !snake.includes(item));
  const randomIdx = Math.floor(Math.random() * nonSnakeCells.length);
  return nonSnakeCells[randomIdx];
};

const App = () => {
  const [tick, setTick] = useState<number>(0);
  const [snake, setSnake] = useState(defaultSnekSize);
  const [direction, setDirection] = useState<Direction>("right");
  const [food, setFood] = useState(randomFood(snake));
  const speed = 500 / snake.length;
  const [gameover, setGameover] = useState<boolean>(false);
  const [pawsed, setPawsed] = useState<boolean>(true);

  useEffect(() => {
    if (pawsed) {
      return;
    }
    const [tail, ...body] = snake;
    const head = snake[snake.length - 1];
    const newHead = moveHead(head, direction);
    if (body.includes(newHead)) {
      setGameover(true);
      console.log(gameover);
      return;
    }
    if (newHead === food) {
      const newSnek = [...snake, newHead];
      setSnake(newSnek);
      setFood(randomFood(newSnek));
    } else setSnake([...body, newHead]);
    setTimeout(() => {
      setTick(tick + 1);
    }, speed);
  }, [tick, pawsed]);

  const restartGame = () => {
    setTick(0);
    setGameover(false);
    const newSkek = defaultSnekSize;
    setSnake(newSkek);
    setFood(randomFood(newSkek));
    setDirection("right");
    console.log("Game restarted");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keyMap: { [key: string]: Direction } = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowDown: "down",
      ArrowUp: "up",
      a: "left",
      d: "right",
      s: "down",
      w: "up",
      A: "left",
      D: "right",
      S: "down",
      W: "up",
    };
    const direction = keyMap[event.key];
    const blocked = getBlockedDirection();
    if (direction && direction !== blocked) {
      setDirection(direction);
    } else {
      console.log('blocked');
    }
  };

  const getBlockedDirection = () => {
    const currentChunk = snake[snake.length - 1];
    if (snake.length > 1) {
      const nextChunk = snake[snake.length - 2];
      const diff = currentChunk - nextChunk;
      if (diff === 1 || diff === -gridWidth + 1) {
        return "left";
      }
      if (diff === -1 || diff === gridWidth - 1) {
        return "right";
      }
      if (diff === gridWidth || diff === -cells.length + gridWidth) {
        return "up";
      }
      if (diff === -gridWidth || diff === cells.length - gridWidth) {
        return "down";
      }
    }
  };

  const getPreviousSnakeChunk = (idx: number) => {
    const snakeIndex = snake.indexOf(idx);
    const currentChunk = snake[snakeIndex];
    if (snakeIndex > 0) {
      const nextChunk = snake[snakeIndex - 1];
      const diff = currentChunk - nextChunk;
      if (diff === 1 || diff === -gridWidth + 1) {
        return "left";
      }
      if (diff === -1 || diff === gridWidth - 1) {
        return "right";
      }
      if (diff === gridWidth || diff === -cells.length + gridWidth) {
        return "up";
      }
      if (diff === -gridWidth || diff === cells.length - gridWidth) {
        return "down";
      }
    }
    return undefined;
  };

  const getNextSnakeChunk = (idx: number) => {
    const snakeIndex = snake.indexOf(idx);
    const currentChunk = snake[snakeIndex];
    if (snakeIndex < snake.length - 1) {
      const nextChunk = snake[snakeIndex + 1];
      const diff = currentChunk - nextChunk;
      if (diff === 1 || diff === -gridWidth + 1) {
        return "left";
      }
      if (diff === -1 || diff === gridWidth - 1) {
        return "right";
      }
      if (diff === gridWidth || diff === -cells.length + gridWidth) {
        return "up";
      }
      if (diff === -gridWidth || diff === cells.length - gridWidth) {
        return "down";
      }
    }
    return undefined;
  };

  return (
    <>
      <div
        className="cell-container"
        onKeyDown={handleKeyPress}
        tabIndex={0}
        onBlur={() => setPawsed(true)}
        onFocus={() => setPawsed(false)}
      >
        {cells.map((val, idx) => (
          <div
            className={`cell ${snake.includes(idx) ? "snake-cell" : ""} ${
              food === idx ? "food" : ""
            }`}
            style={{
              height: `${100 / gridHeight}%`,
              width: `${100 / gridWidth}%`,
            }}
          >
            {snake.includes(idx) && (
              <div
                className={`snake ${getPreviousSnakeChunk(
                  idx
                )} ${getNextSnakeChunk(idx)}`}
              >
                {idx === snake[snake.length - 1] ? <img style={{ width: '100%', height: '100%' }} src={eyes} /> : ""}
              </div>
            )}
            {food === idx ? <FaBug /> : ""}
          </div>
        ))}
        <div className="score">
          Score: {snake.length - defaultSnekSize.length}
        </div>
        <div className="gameover" onClick={() => restartGame()}>
          {gameover ? "You lost, click here to restart" : ""}
        </div>
      </div>
    </>
  );
};

export default App;