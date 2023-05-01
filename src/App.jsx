import { useState, useRef, useEffect } from "react";
import ConfettiGenerator from "confetti-js";
import './assets/confetti.min';
import Lottie from "lottie-react";
import confetti from "./assets/confeti.json";
import congrats from "./assets/congrats.json";

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

  const [numberOfItems, setNumberOfItems] = useState(5);
  const [randomNumbers, setRandomNumbers] = useState(generateRandomNumbers(numberOfItems));
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef();

  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const localNumberOfItems = window.localStorage.getItem("numberOfItems");
    console.log(localNumberOfItems);
    if (localNumberOfItems) {
      setNumberOfItems(+localNumberOfItems);
      setRandomNumbers(generateRandomNumbers(+localNumberOfItems));
    }
  }, []);

  const start = () => {
    if (!isRunning) {
      setRandomNumbers(generateRandomNumbers(numberOfItems));
      setIsRunning(true);
      setFinished(false);
      timerRef.current = setInterval(() => {
        setRandomNumbers(generateRandomNumbers(numberOfItems));
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
            setRandomNumbers(generateRandomNumbers(numberOfItems));
            delay += 10; // increase delay by 10ms for each iteration
            clearInterval(intervalId);
            intervalId = setInterval(slowToStop, delay); // use new delay for next iteration
          }, delay);
        } else {
          setTimeout(() => {
            setRandomNumbers(generateRandomNumbers(numberOfItems));
          }
            , 1000);
          setTimeout(() => {
            setRandomNumbers(generateRandomNumbers(numberOfItems));

          }, 4000);
          setTimeout(() => {
            setFinished(true);
          }, 5000);
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
    "bg-pink-500",
    "bg-cyan-500",
    "bg-rose-500",
    "bg-fuchsia-500",
  ];

  // array refs
  const refs = useRef([]);




  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    window.localStorage.setItem("numberOfItems", numberOfItems);
    setRandomNumbers(generateRandomNumbers(numberOfItems));
  };

  const handleChange = (event) => {
    setNumberOfItems(event.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      {/* setting button top right */}
      <div className="absolute z-20 top-0 right-0 m-4">
        <button
          className="p-2 rounded-md  text-gray-500"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <i className="fa fa-times fa-2x"></i> : <i className="fa fa-cog fa-2x hover:animate-spin"></i>}
        </button>
        <form className={`absolute border bg-white w-52 p-4 top-6 right-0 m-4 ${menuOpen ? "" : "hidden"}`} onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-2">
            <label htmlFor="numberOfItems">จำนวนตัวเลข</label>
            <input
              type="number"
              id="numberOfItems"
              name="numberOfItems"
              min="1"
              max="10"
              value={numberOfItems}
              onChange={handleChange}
              className="border border-gray-400 rounded-md p-2"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-md"
          >
            แก้ไข
          </button>
        </form>
      </div>
      <div className="absolute z-10 flex flex-col items-center justify-center">
        <div className={`flex flex-wrap gap-4 w-full items-center justify-center`}>
          {randomNumbers.map((number, index) => (
            <div key={number} className={`
            border border-gray-400 rounded-md  ${bgColors[index]}
            text-3xl font-bold `} ref={(el) => (refs.current[index] = el)} id={`box-${index}`}>
              <Box value={number} initialValue={0} isRunning={isRunning} index={index} />
            </div>
          ))}
        </div>
        <Lottie animationData={confetti} className={`absolute -left-52 top-0 w-72 ${finished ? '' : 'hidden'}`} />
        <Lottie animationData={congrats} className={`absolute  w-72  ${finished ? '' : 'hidden'}`} />
        <Lottie animationData={congrats} className={`absolute left-5 w-72  top-0 ${finished ? '' : 'hidden'}`} />
        <Lottie animationData={congrats} className={`absolute right-5  w-72 ${finished ? '' : 'hidden'}`} />
        <Lottie animationData={confetti} className={`absolute -right-52 top-0 w-72 transform  rotate-90 -scale-x-100 -scale-y-100  ${finished ? '' : 'hidden'}`} id="conf-2" />
        <div className="mt-4 space-x-4 z-50">
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
            คลิกที่ปุ่ม เริ่มสุ่ม
            {/* <kbd className="bg-slate-700 p-1 rounded-md text-white">SPACE BAR</kbd> */}
          </small>
        </div>
      </div>
      <canvas id="my-canvas">
      </canvas>
    </div>
  );
}

const faList = [
  "fa-star",
  "fa-heart",
  "fa-bell",
  "fa-bolt",
  "fa-bomb",
  "fa-bug",
];

// eslint-disable-next-line react/prop-types
const Box = ({ value, initialValue, isRunning, index }) => {
  return (
    <div className={`w-48 h-48 flex justify-center text-5xl items-center transition-all ${isRunning ? "" : ""} text-white relative overflow-hidden`}>
      <i className={`fa fa-3x ${faList[index]} -right-5 top-10 absolute text-6xl opacity-30`}></i>
      <span className="z-30">{value ? value : initialValue}</span>
    </div>
  );
};
