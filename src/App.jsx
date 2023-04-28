import { useState, useRef } from "react";
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

  const start = () => {
    if (!isRunning) {
      setRandomNumbers(generateRandomNumbers(5));
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setRandomNumbers(generateRandomNumbers(5));
      }, 1000);
    }
  };

  const stop = () => {
    if (isRunning) {
      setIsRunning(false);
      clearInterval(timerRef.current);
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
      <div className="mt-8 flex space-x-4">
        <button
          className={`px-4 py-2 bg-blue-500 text-white rounded-md ${isRunning ? "opacity-50 cursor-not-allowed" : ""
            }`}
          onClick={start}
          disabled={isRunning}
        >
          เริ่ม
        </button>
        <button
          className={`px-4 py-2 bg-red-500 text-white rounded-md ${!isRunning ? "opacity-50 cursor-not-allowed" : ""
            }`}
          onClick={stop}
          disabled={!isRunning}
        >
          หยุด
        </button>
      </div>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
const Box = ({ value, transition, initialValue }) => {
  return (
    <div className={`w-16 h-16 flex justify-center items-center ${transition}`}>
      {value ? value : initialValue}
    </div>
  );
};
