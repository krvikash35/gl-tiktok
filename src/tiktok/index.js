import React, { useState, useEffect } from "react";

function SizeChooser({ onSelectSize }) {
  return (
    <div>
      <h1>Choose Board Size</h1>
      {[3, 4, 5, 9].map(size => (
        <button key={size} onClick={_ => onSelectSize(size)}>
          {size}
        </button>
      ))}
    </div>
  );
}

function ThemeChooser() {
  const themes = {
    light: {
      bg: "white",
      text: "black"
    },
    dark: {
      bg: "black",
      text: "white"
    },
    pink: {
      bg: "pink",
      text: "white"
    }
  };

  const setTheme = theme => {
    document.documentElement.style.setProperty("--theme-bg", themes[theme].bg);
    document.documentElement.style.setProperty(
      "--theme-text",
      themes[theme].text
    );
  };
  useEffect(() => {
    setTheme("light");
  }, []);

  return (
    <div>
      <h1>Choose Theme</h1>
      {["light", "dark", "pink"].map(theme => (
        <button key={theme} onClick={_ => setTheme(theme)}>
          {theme}
        </button>
      ))}
    </div>
  );
}

function TimeLoger({ logs }) {
  return (
    <div>
      <h1>Time Logger</h1>
      {logs.map((log, index) => (
        <div key={index}>{log}</div>
      ))}
    </div>
  );
}

function GameBoard({ boxes, size, onBoxClick, currentPlayer }) {
  return (
    <div>
      <h2>Game board</h2>
      <h3>It's {currentPlayer} chance</h3>
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${size}, auto)` }}
      >
        {boxes.map((box, index) => (
          <div key={index} onClick={_ => onBoxClick(index)} className="cell">
            {box === "p1" && "*"}
            {box === "p2" && "x"}
          </div>
        ))}
      </div>
    </div>
  );
}

function TickTockPage() {
  const [currentPlayer, setCurrentPlayer] = useState("p1");
  const [size, setSize] = useState(3);
  const [boxes, setBoxes] = useState([...Array(size * size)]);
  const [msg, setMsg] = useState("");
  const [timeLog, setTimeLog] = useState([]);
  const [result, setResult] = useState("");

  useEffect(() => {
    if (msg) {
      setTimeout(() => {
        setMsg("");
      }, 2000);
    }
  }, [msg]);

  useEffect(() => {
    if (size) {
      setBoxes([...Array(size * size)]);
    }
  }, [size]);

  useEffect(() => {}, [boxes]);

  const onBoxClick = boxIndex => {
    console.log("index", boxIndex);
    if (boxes[boxIndex]) {
      setMsg("Box already filled by " + boxes[boxIndex]);
    } else {
      const nexBoxes = boxes.map((oldBox, index) => {
        if (index === boxIndex) {
          return currentPlayer;
        } else {
          return oldBox;
        }
      });

      checkForWinner(boxIndex, nexBoxes);
      setBoxes(nexBoxes);
      const newCurrentPlayer = currentPlayer === "p1" ? "p2" : "p1";
      setCurrentPlayer(newCurrentPlayer);
      setTimeLog(t => [
        ...t,
        `${currentPlayer}--->  ${new Date().toLocaleTimeString()}`
      ]);
    }
  };

  const onSelectSize = bSize => {
    setSize(bSize);
  };

  const checkForWinner = (boxIndex, boxes) => {
    //check horizontal
    const rowIndex = Math.floor((boxIndex / size))*size;
    const rowArray = boxes.slice(rowIndex, rowIndex + size);
    const rowMatch = rowArray.every(b => b === currentPlayer);
    console.log('horizonta', rowIndex, rowArray, rowMatch)
    if (rowMatch) {
      return setResult(`${currentPlayer} won tha match`);
    }

    //check vertical
    const colIndex = boxIndex < size ? boxIndex : boxIndex % size;
    let colMatch = false;
    for (let i = 0; i < size; i++) {
      if (boxes[colIndex + i * size] !== currentPlayer) {
        break;
      }
      if (i === size - 1) {
        colMatch = true;
      }
    }
    if (colMatch) {
      setResult(`${currentPlayer} won tha match`);
    }

    //TODO: check diagonal
    

  };

  return (
    <div className="app">
      <ThemeChooser />
      <TimeLoger logs={timeLog} />
      <SizeChooser onSelectSize={onSelectSize} />
      <GameBoard
        boxes={boxes}
        onBoxClick={onBoxClick}
        currentPlayer={currentPlayer}
        size={size}
      />
      {msg && <div className="msg">{msg}</div>}
      {result && (
        <div className="msg result">
          {result}
          <button onClick={_ => window.location.reload()}>Reload</button>{" "}
        </div>
      )}
    </div>
  );
}

export default TickTockPage;
