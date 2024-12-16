import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { generatePieces, shufflePieces } from "../utils/utils";

interface PuzzlecontextType {
  gridSize: number;
  shuffledPieces: number[];
  correctPositions: number[];
  image: String;
  score: number;
  timer: number;
  level: number;
  feedback: string;
  incorrectMoves: number;
  failure: number;
  setGridSize: (size: number) => void;
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
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [incorrectMoves, setIncorrectMoves] = useState(0);
  const [failure, setFailure] = useState(0);
  const imagesArray = ["/image1.jpeg", "/image2.jpg"];

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetPuzzle = () => {
    const pieces = generatePieces(gridSize);
    setCorrectPositions(pieces);
    const shuffled = shufflePieces(pieces, gridSize);
    setImage(imagesArray[level % imagesArray.length]);
    setFeedback("");
    setShuffledPieces(shuffled);
    setIncorrectMoves(0);

    const time = shuffled.length * 10 - level * 2;
    setTimer(time);

    //to stop any previously running timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    startTimer();
    // console.log(shuffled); //displays
    // console.log(pieces); //displays

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
          failure: data.failure,
        })
      );
    } else {
      localStorage.setItem(
        "puzzleData",
        JSON.stringify({
          gridSize,
          shuffledPieces: shuffled,
          score: 0,
          level: 1,
          incorrectMoves: 0,
          failure: 0,
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
        failure,
      })
    );
  };

  // to display the result if solved
  useEffect(() => {
    if (shuffledPieces.length > 0) {
      if (isSolved()) {
        clearInterval(timerRef.current!);
        const completionTime = 100 - level * 10 - timer;
        const maxTime = 100 - level * 10;
        let newScore = score;
        let newlevel = level;

        if (completionTime <= maxTime * 0.3 && incorrectMoves === 0) {
          setFeedback("Excellent!");
          newScore += 2;
        } else if (completionTime <= maxTime * 0.5 && incorrectMoves <= 3) {
          setFeedback("Good job!");
          newScore += 1.5;
        } else if (completionTime <= maxTime * 0.9 && incorrectMoves <= 6) {
          setFeedback("Well done!");
          newScore += 1;
        } else {
          setFeedback("Please Try Again");
          newScore -= 0.5;
        }

        newlevel += 1;
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
            failure,
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
      setFailure((prev) => prev + 1);

      setTimeout(() => {
        resetPuzzle();
      }, 4000);
    }
  }, [timer]);

  useEffect(() => {
    if (level <= 10) {
      if (failure >= 3) {
        setTimeout(() => {
          setFailure(0);
          startAgain();
        }, 3000);
      }
    } else {
      setLevel(1);
    }
  }, [level, failure]);

  const startAgain = () => {
    localStorage.clear();
    setLevel(1);
    resetPuzzle();
  };

  // to get data from localStorage
  useEffect(() => {
    // localStorage.clear();

    const storedData = localStorage.getItem("puzzleData");
    if (storedData) {
      const data = JSON.parse(storedData);
      setFailure(data.failure);
      setGridSize(data.gridSize);
      setShuffledPieces(data.shuffledPieces);
      setScore(data.score);
      setLevel(data.level);
      console.log("shuffled Pieces:", data.shuffledPieces);
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
        setGridSize,
        setShuffledPieces,
        isSolved,
        resetPuzzle,
        handleMove,
        feedback,
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
