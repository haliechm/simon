import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useCallback } from "react";
import _, { set } from "lodash";
import useSound from 'use-sound';
import BlueSound from "../src/sounds/blue.wav";
import YellowSound from "../src/sounds/yellow.wav";
import GreenSound from "../src/sounds/green.wav";
import PinkSound from "../src/sounds/pink.wav";
import LaughSound from "../src/sounds/laugh.wav";



function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const COLOR_OPTIONS = {
  PINK: 0,
  GREEN: 1,
  BLUE: 2,
  YELLOW: 3,
}

function App() {
  const [answers, setAnswers] = useState([]);
  const [userResponses, setUserResponses] = useState([]);
  const [userCanAnswer, setUserCanAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [highscore, setHighscore] = useState(localStorage.getItem("highscore") ? Number(localStorage.getItem("highscore")) : 0)
  const [gameStarted, setGameStarted] = useState(false);
  const [pinkOn, setPinkOn] = useState(false);
  const [greenOn, setGreenOn] = useState(false);
  const [blueOn, setBlueOn] = useState(false);
  const [yellowOn, setYellowOn] = useState(false);
  const [playBlue] = useSound(BlueSound);
  const [playPink] = useSound(PinkSound);
  const [playGreen] = useSound(GreenSound);
  const [playYellow] = useSound(YellowSound);
  const [playLaugh] = useSound(LaughSound);


  const showColor = async (setColor, playSound) => {
    setColor(true);
    playSound();
    await new Promise(r => setTimeout(r, 400));
    setColor(false);

  }

  const showColors = async () => {
    setUserCanAnswer(false);

    for (let num of answers) {
      await new Promise(r => setTimeout(r, 600));
      switch (Number(num)) {
        case COLOR_OPTIONS.PINK:
          await showColor(setPinkOn, playPink);
          break;
        case COLOR_OPTIONS.GREEN:
          await showColor(setGreenOn, playGreen);
          break;
        case COLOR_OPTIONS.BLUE:
          await showColor(setBlueOn, playBlue);
          break;
        case COLOR_OPTIONS.YELLOW:
          await showColor(setYellowOn, playYellow);
          break;


      }
    }
    setUserCanAnswer(true);
  }


  const checkColor = (color) => {
    let userResponsesTemp = userResponses.slice();
    userResponsesTemp.push(color);
    if (color == answers[userResponses.length]) {
      if (userResponses.length + 1 === answers.length) {
        if (score + 1 > highscore) setHighscore(score + 1);
        setScore((score) => score + 1);
        chooseRandomColor();
      }
      setUserResponses(userResponsesTemp);

    } else {
      if (score >= highscore) localStorage.setItem("highscore", JSON.stringify(highscore));
      setGameStarted(false);
      setUserCanAnswer(false);
      setAnswers([]);
      setScore(0);
      playLaugh();
    }
  }


  const chooseRandomColor = () => {
    let randomColorInt = Math.floor(Math.random() * 4);
    let answersTemp = answers.slice();
    answersTemp.push(randomColorInt);
    setAnswers(answersTemp);
  }

  useEffect(() => {
    setUserResponses([]);
    if (answers && answers.length > 0) {
      showColors();
    }
  }, [answers])

  useEffect(() => {
    if (score === 0) setGameStarted(false);
  }, [score])

  useEffect(() => {
    if (gameStarted) chooseRandomColor();
  }, [gameStarted])

  return (
    <div className="bg-gray-900 h-screen w-full relative">
      {/* Score */}
      <div className="p-5">
        <div className="text-white text-lg">Score: {score}</div>
        <div className="text-white text-lg">Highscore: {highscore}</div>
        {gameStarted && userCanAnswer &&  
         <div className="text-gray-800 text-6xl mt-4">{answers.length - userResponses.length} MORE</div>
        }
      </div>
      {/* Main Game */}
      <div className="absolute left-0 right-0 top-0 bottom-0 m-auto w-[36rem] h-[36rem] bg-gray-900 rounded-full">
        {/* Pink */}
        <div
          onClick={() => {
            if (userCanAnswer) {
              checkColor(COLOR_OPTIONS.PINK);
              playPink();
            }
          }}
          className={classNames(
            pinkOn ? "bg-pink-300" : "bg-pink-700 ",
            userCanAnswer ? "cursor-pointer hover:bg-pink-300" : "",
            "absolute top-0 left-0 w-[17rem] h-[17rem] rounded-tl-full"
          )}
        />
        {/* Green */}
        <div
          onClick={() => {
            if (userCanAnswer) {
              checkColor(COLOR_OPTIONS.GREEN);
              playGreen();
            }
          }}
          className={classNames(
            greenOn ? "bg-green-300" : "bg-green-700 ",
            userCanAnswer ? "cursor-pointer hover:bg-green-300" : "",
            "absolute top-0 right-0 w-[17rem] h-[17rem] rounded-tr-full"
          )}
        />
        {/* Blue */}
        <div
          onClick={() => {
            if (userCanAnswer) {
              checkColor(COLOR_OPTIONS.BLUE);
              playBlue();
            }
          }}
          className={classNames(
            blueOn ? "bg-blue-300" : "bg-blue-700 ",
            userCanAnswer ? "cursor-pointer hover:bg-blue-300" : "",
            "absolute bottom-0 left-0 w-[17rem] h-[17rem] rounded-bl-full"
          )}
        />
        {/* Yellow */}
        <div
          onClick={() => {
            if (userCanAnswer) {
              checkColor(COLOR_OPTIONS.YELLOW);
              playYellow();
            }
          }}
          className={classNames(
            yellowOn ? "bg-yellow-300" : "bg-yellow-700 ",
            userCanAnswer ? "cursor-pointer hover:bg-yellow-300" : "",
            "absolute bottom-0 right-0 w-[17rem] h-[17rem] rounded-br-full"
          )}
        />
        {/* Center circle */}
        <div className="absolute left-0 right-0 bottom-0 top-0 m-auto w-[8rem] h-[8rem] bg-gray-900 text-gray-200 rounded-full font-bold text-2xl flex items-center justify-center">
          {gameStarted ?
            "SIMON"
            :
            <button
              className="p-5 cursor-pointer"
              onClick={() => setGameStarted(true)}
            >
              Start Game
            </button>
          }
        </div>
      </div>


    </div>
  );
}

export default App;


