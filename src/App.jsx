import { useState, useRef, useEffect } from "react";
import { Transition } from "@headlessui/react";

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


const getRandomTransition = () => {
  const transitions = [
    "transition-transform duration-1000 ease-out",
    "transition-opacity duration-1000 ease-in-out",
    "transition-colors duration-1000 ease-in-out",
  ];
  return transitions[Math.floor(Math.random() * transitions.length)];
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


  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="flex space-x-4">
        {randomNumbers.map((number) => (
          <Transition
            key={number}
            show={true}
            enter={getRandomTransition()}
            leave={getRandomTransition()}
            className="p-4 border border-gray-400 rounded-md text-3xl font-bold"
          >
            <Box value={number} transition={getRandomTransition()} initialValue={0} />
          </Transition>
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
  );
}

// eslint-disable-next-line react/prop-types
const Box = ({ value, transition, initialValue }) => {
  return (
    <div className={`w-36 h-36 flex justify-center text-5xl items-center ${transition}`}>
      {value ? value : initialValue}
    </div>
  );
};
