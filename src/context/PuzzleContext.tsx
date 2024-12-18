import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  contineousfailure,
  generatePieces,
  shufflePieces,
} from "../utils/utils";

interface PuzzlecontextType {
  gridSize: number;
  shuffledPieces: number[];
  correctPositions: number[];
  failureLevels: number[];
  image: string;
  score: number;
  timer: number;
  level: number;
  feedback: string;
  showFeedback: boolean;
  incorrectMoves: number;
  failure: number;
  setGridSize: (size: number) => void;
  setScore: (size: number) => void;
  setShuffledPieces: (pieces: number[]) => void;
  isSolved: () => Boolean;
  resetPuzzle: () => void;
  handleMove: (index1: number, index2: number) => void;
}

const PuzzleContext = createContext<PuzzlecontextType | undefined>(undefined);

export const PuzzleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gridSize, setGridSize] = useState(2);
  const [image, setImage] = useState("");
  const [shuffledPieces, setShuffledPieces] = useState<number[]>([]);
  const [correctPositions, setCorrectPositions] = useState<number[]>([]);
  const [score, setScore] = useState(3);
  const [timer, setTimer] = useState(60);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [incorrectMoves, setIncorrectMoves] = useState(0);
  const [failure, setFailure] = useState(0);
  const [failureLevels, setFailurelevels] = useState<number[]>([]);
  const imagesArray = ["/image1.jpeg", "/image2.jpg", "/image3.jpg", "/image4.jpeg", "/image5.png", "/image6.png", "/image7.png", "/image8.webp", "/image9.jpg","/image10.jpg"];

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetPuzzle = () => {
    const pieces = generatePieces(gridSize);
    setCorrectPositions(pieces);
    const shuffled = shufflePieces(pieces, gridSize);
    setImage(imagesArray[level % imagesArray.length]);
    setFeedback("");
    setShowFeedback(false);
    setShuffledPieces(shuffled);
    setIncorrectMoves(0);
    

    const time = shuffled?.length * 10 - level * 2;
    setTimer(time);

    //to stop any previously running timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    startTimer();
    // console.log(shuffled); //displays
    // console.log(pieces); //displays
    // localStorage.clear();

    const previousStored = localStorage.getItem("puzzleData");
    if (previousStored) {
      const data = JSON.parse(previousStored);
      setScore(data.score);

      localStorage.setItem(
        "puzzleData",
        JSON.stringify({
          gridSize,
          shuffledPieces: shuffled,
          score: data.score,
          level: data.level,
          incorrectMoves: 0,
          failureLevels: data.failureLevels,
        })
      );
    } else {
      localStorage.setItem(
        "puzzleData",
        JSON.stringify({
          gridSize,
          shuffledPieces: shuffled,
          score: 3,
          level: 1,
          incorrectMoves: 0,
          failureLevels: [],
        })
      );
    }
  };

  useEffect(() => {
    resetPuzzle();
  }, [gridSize]);

  //to check if the puzzle is solved
  const isSolved = () =>
    JSON.stringify(shuffledPieces) === JSON.stringify(correctPositions);

  //function to handle the move of pieces
  const handleMove = (index1: number, index2: number) => {
    const updatedPieces = [...shuffledPieces];
    [updatedPieces[index1], updatedPieces[index2]] = [
      updatedPieces[index2],
      updatedPieces[index1],
    ];

    let updatedIncorrectMoves = incorrectMoves;

    // to determine if the swapped pieces are now in correct positions
    const wasPiece1CorrectBefore =
      correctPositions[index1] === shuffledPieces[index1];
    const wasPiece2CorrectBefore =
      correctPositions[index2] === shuffledPieces[index2];
    const isPiece1NowCorrect =
      correctPositions[index1] === updatedPieces[index1];
    const isPiece2NowCorrect =
      correctPositions[index2] === updatedPieces[index2];

    if (
      (!wasPiece1CorrectBefore &&
        !isPiece1NowCorrect &&
        !wasPiece2CorrectBefore &&
        !isPiece2NowCorrect) ||
      (wasPiece1CorrectBefore &&
        !isPiece1NowCorrect &&
        wasPiece2CorrectBefore &&
        !isPiece2NowCorrect) ||
      (wasPiece1CorrectBefore &&
        !isPiece1NowCorrect &&
        !wasPiece2CorrectBefore &&
        !isPiece2NowCorrect) ||
      (!wasPiece1CorrectBefore &&
        !isPiece1NowCorrect &&
        wasPiece2CorrectBefore &&
        !isPiece2NowCorrect)
    ) {
      updatedIncorrectMoves += 1;
      setIncorrectMoves(updatedIncorrectMoves);
      setTimer((prev) => Math.max(prev - 10, 0));
    }

    setShuffledPieces(updatedPieces);

    //to check if the puzzle is solved
    if (JSON.stringify(updatedPieces) === JSON.stringify(correctPositions)) {
      setTimer((prev) => prev);
    }

    //saving updated state to local storage
    localStorage.setItem(
      "puzzleData",
      JSON.stringify({
        gridSize,
        shuffledPieces: updatedPieces,
        score,
        level,
        incorrectMoves: updatedIncorrectMoves,
        failureLevels,
      })
    );
  };

  // to display the result if solved
  useEffect(() => {
    if (shuffledPieces.length > 0) {
      if (isSolved()) {
        clearInterval(timerRef.current!);
        const maxTime = shuffledPieces.length * 10 - level * 2;
        const completionTime = maxTime - timer;

        let newScore = score;
        let newlevel = level;

        if (completionTime <= maxTime * 0.3 && incorrectMoves === 0) {
          setFeedback("Excellent!");
          newScore += 2;
          newlevel += 1;
        } else if (completionTime <= maxTime * 0.5 && incorrectMoves <= 3) {
          setFeedback("Good job!");
          newScore += 1.5;
          newlevel += 1;
        } else if (completionTime <= maxTime * 0.6 && incorrectMoves <= 6) {
          setFeedback("Well done!");
          newScore += 1;
        } else {
          setFeedback("Please Try Again");
          newScore -= 0.5;
        }

        setTimeout(() => {
          setShowFeedback(true);
        }, 1000);

        setTimeout(() => {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          resetPuzzle();
          setLevel(newlevel);
        }, 4000);

        setScore(newScore);
        localStorage.setItem(
          "puzzleData",
          JSON.stringify({
            gridSize,
            shuffledPieces,
            score: newScore,
            level: newlevel,
            incorrectMoves,
            failureLevels,
          })
        );
      }
    }
  }, [shuffledPieces]);

  // function to start the timer
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  };

  useEffect(() => {
    // startTimer();
    if (timer <= 0) {
      clearInterval(timerRef.current!);
      setFeedback("Time Over!");
      setShowFeedback(true);
      setFailure((prev) => prev + 1);

      setFailurelevels((prevFailureLevels) => {
        const updatedFailureArray = Array.isArray(prevFailureLevels)
          ? [...prevFailureLevels, level]
          : [level];

        localStorage.setItem(
          "puzzleData",
          JSON.stringify({
            gridSize,
            shuffledPieces,
            score,
            level,
            incorrectMoves,
            failureLevels: updatedFailureArray,
          })
        );

        return updatedFailureArray;
      });

      setTimeout(() => {
        resetPuzzle();
      }, 4000);
    }
  }, [timer]);

  //for failures
  useEffect(() => {
    if (level <= 10) {
    if(failureLevels?.length > 0){
      if (contineousfailure(failureLevels) || failureLevels?.length >= 3) {
        setFeedback("You failed to solve for 3 times");
        setShowFeedback(true);
        setTimeout(() => {
          setFailure(0);
          startAgain();
        }, 4000);
      }
    }
    } else {
      setLevel(1);
      setFailure(0);
    }
  }, [level, failureLevels]);

  const startAgain = () => {
    localStorage.clear();
    setFailurelevels([]);
    setScore(3);
    setLevel(1);
    resetPuzzle();
    setShowFeedback(false);
    localStorage.setItem("auth-broadcast", JSON.stringify({ type: "login" }));
  };

  // to get data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("puzzleData");
    if (storedData) {
      const data = JSON.parse(storedData);
      setFailure(data.failure);
      setGridSize(data.gridSize);
      setShuffledPieces(data.shuffledPieces);
      setScore(data.score);
      setLevel(data.level);
      setFailurelevels(data.failureLevels);
    } else {
      resetPuzzle();
    }
  }, []);

  return (
    <PuzzleContext.Provider
      value={{
        gridSize,
        shuffledPieces,
        correctPositions,
        image,
        score,
        timer,
        level,
        failureLevels,
        setScore,
        setGridSize,
        setShuffledPieces,
        isSolved,
        resetPuzzle,
        handleMove,
        feedback,
        showFeedback,
        incorrectMoves,
        failure,
      }}
    >
      {children}
    </PuzzleContext.Provider>
  );
};

export const usePuzzleData = () => {
  const context = useContext(PuzzleContext);
  if (!context) throw new Error("error occured in puzzle provider");
  return context;
};
