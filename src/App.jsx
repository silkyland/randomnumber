import { useState, useRef, useEffect } from "react";
import ConfettiGenerator from "confetti-js";

const generateRandomNumbers = (count, initialValue = 0) => {
  const numbers = [];
  while (numbers.length < count) {
    const randomNumber = Math.floor(Math.random() * 99) + 1;
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }
  return numbers.map((number) => (number ? number : initialValue));
};

export default function Home() {
  const [randomNumbers, setRandomNumbers] = useState(generateRandomNumbers(5));
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef();


  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        isRunning ? stop() : start();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isRunning]);


  const start = () => {
    if (!isRunning) {
      setRandomNumbers(generateRandomNumbers(5));
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setRandomNumbers(generateRandomNumbers(5));
      }, 10);
    }
  };

  const stop = () => {
    if (isRunning) {
      setIsRunning(false);
      let intervalId = timerRef.current;
      let delay = 10; // start with 10ms delay
      let stopCount = 20; // stop after 20 iterations
      let counter = 0;

      const slowToStop = () => {
        clearInterval(intervalId);
        counter++;
        if (counter < stopCount) {
          intervalId = setInterval(() => {
            setRandomNumbers(generateRandomNumbers(5));
            delay += 10; // increase delay by 10ms for each iteration
            clearInterval(intervalId);
            intervalId = setInterval(slowToStop, delay); // use new delay for next iteration
          }, delay);
        }
      };

      slowToStop();
    }
  };

  useEffect(() => {
    const confettiSettings = { target: 'my-canvas' };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();

    return () => confetti.clear();
  }, [])

  const bgColors = [
    "bg-red-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
  ];


  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="absolute z-10 flex flex-col items-center">
        <div className="flex space-x-4">
          {randomNumbers.map((number, index) => (
            <div key={number} className={`p-4 border border-gray-400 rounded-md text-3xl font-bold ${bgColors[index]}`}>
              <Box value={number} initialValue={0} isRunning={isRunning} />
            </div>
          ))}
        </div>
        <div className="mt-4 space-x-4">
          <button
            className={`px-4 py-2  w-52  text-white rounded-md ${isRunning ? " bg-red-500" : "bg-blue-500"
              }`}
            onClick={isRunning ? stop : start}
          >
            {isRunning ? "หยุด" : "เริ่มสุ่ม"}
          </button>
        </div>
        <div className="mt-2">
          <small className="text-gray-500">
            คลิกที่ปุ่ม เริ่มสุ่ม หรือกด <kbd className="bg-slate-700 p-1 rounded-md text-white">SPACE BAR</kbd>
          </small>
        </div>
      </div>
      <canvas id="my-canvas">
      </canvas>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
const Box = ({ value, initialValue, isRunning }) => {
  return (
    <div className={`w-36 h-36 flex justify-center text-5xl items-center transition-all ${isRunning ? "" : "animate__animated animate__pulse animate__infinite"} text-white`}>
      {value ? value : initialValue}
    </div>
  );
};
