import React, { useState, useEffect, TouchEvent } from "react";
import { usePuzzleData } from "../context/PuzzleContext";

const Puzzle: React.FC = () => {
  const {
    gridSize,
    shuffledPieces,
    correctPositions,
    image,
    score,
    setScore,
    timer,
    level,
    setGridSize,
    isSolved,
    handleMove,
    resetPuzzle,
    feedback,
    incorrectMoves,
    failure,
  } = usePuzzleData();

  //for drag and drop the pieces
  const handleDragStart = (index: number, event: React.DragEvent) => {
    event.dataTransfer.setData("pieceIndex", index.toString());
  };

  const handleDrop = (
    index: number,
    event: React.DragEvent | React.TouchEvent
  ) => {
    event.preventDefault();
    let draggedIndex: number;

    if ("dataTransfer" in event) {
      draggedIndex = parseInt(event.dataTransfer.getData("pieceIndex"), 10);
    } else {
      draggedIndex = touchStartIndex as number;
    }

    if (draggedIndex !== null && draggedIndex !== undefined) {
      handleMove(draggedIndex, index);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  //for mobile touch
  const [touchStartIndex, setTouchStartIndex] = useState<number | null>(null);

  const handleTouchStart = (
    index: number,
    e: React.TouchEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    if (!isSolved() && !feedback) {
      setTouchStartIndex(index);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleTouchEnd = (
    dropIndex: number,
    e: React.TouchEvent<HTMLDivElement>
  ) => {
    if (touchStartIndex !== null && !isSolved() && !feedback) {
      handleDrop(dropIndex, e);
      setTouchStartIndex(null);
    }
  };

  //to get background position of the draggable pieces
  const getBackgroundPosition = (index: number, size: number) => {
    const row = Math.floor(index / size);
    const col = index % size;

    const xPosition = (col * 100) / (size - 1);
    const yPosition = (row * 100) / (size - 1);

    return `${xPosition}% ${yPosition}%`;
  };

  //for the image preview modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ispreview, setIspreview] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePreviewImage = () => {
    setIspreview(true);

    localStorage.setItem(
      "puzzleData",
      JSON.stringify({
        gridSize,
        shuffledPieces,
        score: score - 1,
        level,
        incorrectMoves,
        failure,
      })
    );
    setScore(score - 1);
    setTimeout(() => {
      setIspreview(false);
      setIsModalOpen(false);
    }, 5000);
  };

  const [tileSize, setTileSize] = useState(500);

  useEffect(() => {
    const updateSize = () => {
      setTileSize(window.innerWidth <= 640 ? 300 : 500);
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className={`w-full h-screen flex flex-col items-center justify-center bg-gradient-to-r from-dark to-semidark px-4 md:px-6 py-10`}
    >
      <h1 className="text-3xl  text-center font-bold text-light mb-10">
        Dynamic Puzzle Game
      </h1>

      <div className="w-full flex flex-col lg:flex-row justify-center md:justify-between max-lg:gap-y-10 gap-4 items-center">
        {/* Insights Area */}
        <div className="w-full lg:w-3/12 h-full flex flex-col md:max-lg:flex-row justify-between lg:gap-y-6 md:items-center lg:px-6 font-semibold text-white">
          {/* Grid Size Selector */}
          <div className="flex lg:flex-row items-center max-lg:gap-y-2 mb-2 lg:mb-8">
            <label
              htmlFor="gridSize"
              className="mr-4 text-xl md:text-2xl font-medium text-lightdark"
            >
              Select Grid Size:
            </label>
            <select
              id="gridSize"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="border-2 border-white/80 rounded-lg px-4 py-2 bg-dark text-white/90 focus:outline-none cursor-pointer hover:scale-105"
            >
              {[...Array(11).keys()].map((_, i) => (
                <option key={i + 2} value={i + 2}>
                  {i + 2} x {i + 2}
                </option>
              ))}
            </select>
          </div>

          {/* Level, Score, Timer */}
          <div className="flex flex-col text-xl gap-y-2 text-lightdark mb-8">
            <h2>
              Level: <span className="text-light font-semibold"> {level}</span>
            </h2>
            <h2>
              Score: <span className="text-light font-semibold"> {score}</span>
            </h2>
            <h2>
              Time Left:
              <span className="text-light text-xl font-semibold">
                {" "}
                {timer} s
              </span>
            </h2>
          </div>

          {/* Incorrect Moves & Failures */}
          <div className="flex flex-col text-xl gap-y-2 text-lightdark">
            <h2>
              Incorrect Moves:
              <span className="text-light font-semibold">
                {" "}
                {incorrectMoves}
              </span>
            </h2>
            <h2>
              Failures:
              <span className="text-light font-semibold"> {failure}</span>
            </h2>
          </div>
        </div>

        {/* Puzzle Grid */}
        <div
          className={`w-full lg:w-6/12 h-auto flex flex-col rounded-xl justify-center items-center  transition-opacity duration-500 ${
            isSolved() ? "opacity-100" : "opacity-100"
          } transition-transform transform ${
            isSolved() ? "scale-110" : "scale-100"
          }`}
        >
          <div
            className={`grid   ${
              isSolved() ? "gap-0" : "gap-0 md:gap-0.5"
            } w-[300px] h-[300px] sm:w-[500px] sm:h-[500px]`}
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`,
              touchAction: "none",
            }}
          >
            {shuffledPieces.map((piece, index) => (
              <div
                key={index}
                draggable={!isSolved() && !feedback}
                onDragStart={(e) => {
                  if (!isSolved() && !feedback) {
                    handleDragStart(index, e);
                  }
                }}
                onDrop={(e) => handleDrop(index, e)}
                onDragOver={handleDragOver}
                // Mobile touch events
                onTouchStart={(e) => handleTouchStart(index, e)}
                onTouchMove={(e) => handleTouchMove(e)}
                onTouchEnd={(e) => handleTouchEnd(index, e)}
                className={`relative border-2 ${
                  correctPositions[index] === piece
                    ? "border-1 border-green-500"
                    : "border-2 border-red-500"
                } rounde shadow-md `}
                style={{
                  width: `${tileSize / gridSize}px`,
                  height: `${tileSize / gridSize}px`,
                  backgroundImage: `url(${image})`,

                  backgroundPosition: getBackgroundPosition(
                    piece - 1,
                    gridSize
                  ),

                  backgroundSize: `${gridSize * 100}%`,
                }}
              ></div>
            ))}
          </div>
        </div>

{/* score table */}
        <div className=" flex  lg:w-3/12 h-full  flex-col items-center">
                <h1 className="text-lightdark text-2xl font-semibold underline mb-6">
                  ScoreTable:
                </h1>
               
              </div>

      </div>
      <div
        className=" px-4 py-2 mt-8 self-center bg-semidark rounded-full shadow text-light font-semibold cursor-pointer"
        onClick={handleOpenModal}
      >
        Preview image
      </div>

      {feedback && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-semidark/90 p-1 rounded-lg shadow-lg max-w-xl w-full flex justify-center items-center py-10">
              {/* Feedback Section */}
              <div className=" flex  lg:w-6/12 h-full  flex-col items-center">
               
                {/* If game complete */}
                {isSolved() && shuffledPieces.length > 0 && (
                  <div className="mt-4 p-4 bg-green-600 text-white font-bold rounded-xl shadow-lg transition transform duration-300 ease-in-out hover:scale-105">
                    Puzzle Solved!
                  </div>
                )}

                {feedback && (
                  <div
                    className="mt-4 p-4 flex flex-col justify-center text-lg items-center text-white font-bold rounded-xl shadow-lg cursor-pointer transition transform duration-300 ease-in-out scale-105"
                    onClick={resetPuzzle}
                  >
                    {feedback}
                    <h2 className="font-normal text-base">You have solved in {timer} s</h2>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal for image preview */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-semidark/90 p-1 rounded-lg shadow-lg max-w-xl w-full">
            {/* alert section */}
            {!ispreview ? (
              <div className="w-full flex flex-col items-center justify-center gap-y-6 my-10">
                <h2 className="text-xl font-semibold text-light">
                  You will loose 1 score
                </h2>
                <div className="w-5/12 flex justify-around  gap-10">
                  <button
                    className="bg-lightdark text-white w-5/12 px-3 py-1 rounded-full hover:scale-105"
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-dark text-white w-5/12  px-3 py-1 rounded-full hover:scale-105"
                    onClick={handlePreviewImage}
                  >
                    OK
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full ">
                <img
                  src={image}
                  alt="Puzzle Preview"
                  className="w-full  rounded-md shadow-md"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Puzzle;
