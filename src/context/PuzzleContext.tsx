import React, { createContext, useContext, useState, useEffect } from "react";

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
  const imagesArray = ["/image1.jpg", "/image2.jpg"];

  //to generate the required pieces
  const generatePieces = (size: number) =>
    Array.from({ length: size * size }, (_, i) => i + 1);

  //to shuffle the pieces randomly
  const shufflePieces = (pieces: number[]) => {
    let shuffled = [...pieces];
    do {
      shuffled = shuffled.sort(() => Math.random() - 0.5);
    } while (isSolvable(shuffled, gridSize));

    return shuffled;
  };

  // to check if the puzzle is solvable
  const isSolvable = (pieces: number[], size: number) => {
    let inversions = 0;
    for (let i = 0; i < pieces.length; i++) {
      for (let j = i + 1; j < pieces.length; j++) {
        if (pieces[i] > pieces[j] && pieces[i] !== 0 && pieces[j] !== 0)
          inversions++;
      }
    }
    if (size % 2 === 0) {
      const rowFromBottom = Math.floor(pieces.indexOf(0) / size) + 1;
      return (rowFromBottom % 2 === 0) === (inversions % 2 === 0);
    }
    return inversions % 2 === 0;
  };

  const resetPuzzle = () => {
    const pieces = generatePieces(gridSize);
    setCorrectPositions(pieces);
    const shuffled = shufflePieces(pieces);
    setImage(imagesArray[level % imagesArray.length]);
    // setScore(0);
    setTimer(100 - level * 10);
    // setLevel((prev) => prev + 1);    
    setFeedback("");
    setShuffledPieces(shuffled);
    setIncorrectMoves(0);

    // console.log(shuffled); //displays
    // console.log(pieces); //displays

    localStorage.setItem(
      "puzzleData",
      JSON.stringify({
        gridSize,
        shuffledPieces: shuffled,
        score,
        level,
        incorrectMoves,
       failure,
      })
    );
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
     (( !wasPiece1CorrectBefore &&
      !isPiece1NowCorrect) &&
    (  !wasPiece2CorrectBefore &&
      !isPiece2NowCorrect)) ||   (( wasPiece1CorrectBefore &&
        !isPiece1NowCorrect) &&
      (  wasPiece2CorrectBefore &&
        !isPiece2NowCorrect))
    ) {
        updatedIncorrectMoves += 1;
        setIncorrectMoves(updatedIncorrectMoves);
        setTimer((prev) => prev - 10);
    }

    setShuffledPieces(updatedPieces);

    //to check if the puzzle is solved
    if (JSON.stringify(updatedPieces) === JSON.stringify(correctPositions)) {
        setFeedback("Puzzle Solved!");
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

  useEffect(() => {
  if (isSolved()) {
    const completionTime = (100 - level * 10) - timer;
    const maxTime = 100 - level * 10;
    let newScore = score;
    let newlevel = level;

    if (completionTime <= maxTime * 0.3 && incorrectMoves === 0) {
      setFeedback("Excellent!");
      newScore +=200;
    } else if (completionTime <= maxTime * 0.5 && incorrectMoves <= 3) {
      setFeedback("Good job!");
      newScore += 150;
    } else if (completionTime <= maxTime * 0.99 && incorrectMoves <= 6) {
      setFeedback("Well done!");
      newScore += 100;
    } else {
      setFeedback("Please Try Again");
      newScore -= 50; 
    }

    
    newlevel +=1;
    setTimeout(()=>{
        resetPuzzle();
        setLevel(newlevel);
    },4000)

    setScore(newScore);
    localStorage.setItem(
        "puzzleData",
        JSON.stringify({
          gridSize,
          shuffledPieces,
          score: newScore,
          level:newlevel,
          incorrectMoves,
          failure,
        })
      );
  }
}, [shuffledPieces]); // Run this effect when shuffledPieces change


  const startTimer = () => {
    if (timer > 0) {
      if (!isSolved()) {
        setTimeout(() => setTimer(timer - 1), 1000);
        console.log(timer);
      }
    } else {
      setFeedback("Please Try Again");
      setFailure((prev)=> prev + 1);
    }
  };

  useEffect(() => {
    startTimer();
  }, [timer]);

  //get data from localStorage
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


