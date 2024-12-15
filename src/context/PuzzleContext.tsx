import React, { createContext, useContext, useState, useEffect } from "react";

interface PuzzlecontextType {
  gridSize: number;
  shuffledPieces: number[];
  correctPositions: number[];
  image: String;
  score: number;
  timer: number;
  level: number;
  setGridSize: (size: number) => void;
  setShuffledPieces: (pieces: number[]) => void;
  isSolved: () => Boolean;
  resetPuzzle: () => void;
}

const PuzzleContext = createContext<PuzzlecontextType | undefined>(undefined);

export const PuzzleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gridSize, setGridSize] = useState(3);
  const [image, setImage] = useState("");
  const [shuffledPieces, setShuffledPieces] = useState<number[]>([]);
  const [correctPositions, setCorrectPositions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [level, setLevel] = useState(1);
  const imagesArray = ["/part1.jpg"];

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
    setImage(imagesArray[Math.floor(Math.random() * imagesArray.length)]);
    setScore(0);
    setTimer(60);
    setLevel(1);
    setShuffledPieces(shuffled);

    console.log(shuffled); //displays
    console.log(pieces); //displays

    localStorage.setItem(
      "puzzleData",
      JSON.stringify({ gridSize, shuffledPieces: shuffled, score, level })
    );
  };

  useEffect(() => {
    resetPuzzle();
  }, [gridSize]);

  //to check if the puzzle is solved
  const isSolved = () =>
    JSON.stringify(shuffledPieces) === JSON.stringify(correctPositions);

  //get data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("puzzleData");
    if (storedData) {
      const data = JSON.parse(storedData);
      setGridSize(data.gridSize);
      setShuffledPieces(data.shuffledPieces);
      setScore(data.score);
      setLevel(data.level);
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
