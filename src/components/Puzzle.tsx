import React, { useState, useEffect } from "react";
import { usePuzzleData } from "../context/PuzzleContext";

const Puzzle: React.FC = () => {
  const {
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

  const handleDrop = (index: number, event: React.DragEvent) => {
    event.preventDefault();
    const draggedIndex = parseInt(event.dataTransfer.getData("pieceIndex"));
    handleMove(draggedIndex, index);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const getBackgroundPosition = (index: number, size: number) => {
    const row = Math.floor(index / size);
    const col = index % size;

    const xPosition = (col * 100) / (size - 1);
    const yPosition = (row * 100) / (size - 1);

    return `${xPosition}% ${yPosition}%`;
  };

  // useEffect(() => {
  //   console.log(getBackgroundPosition(0, 2));  // 0% 0%
  //   console.log(getBackgroundPosition(1, 2)); // 100% 0%
  //   console.log(getBackgroundPosition(2, 2)); // 0% 100%
  //   console.log(getBackgroundPosition(3, 2));  // 100% 100%
  // }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 to-cyan-800 px-6 py-10">
      <h1 className="text-4xl font-bold text-white/80 mb-10">
        Dynamic Puzzle Game
      </h1>
      <div className="w-full flex justify-between gap-4 items-center">
        {/* Insights Area */}
        <div className="w-3/12 h-full flex flex-col justify-between gap-y-6 items-center px-6 font-semibold text-white">
          {/* Grid Size Selector */}
          <div className="flex items-center mb-8">
            <label
              htmlFor="gridSize"
              className="mr-4 text-xl font-medium text-white/80"
            >
              Select Grid Size:
            </label>
            <select
              id="gridSize"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="border-2 border-white/80 rounded-lg px-4 py-2 bg-gray-800 text-white/90 focus:outline-none cursor-pointer hover:scale-105"
            >
              {[...Array(11).keys()].map((_, i) => (
                <option key={i + 2} value={i + 2}>
                  {i + 2} x {i + 2}
                </option>
              ))}
            </select>
          </div>

          {/* Level, Score, Timer */}
          <div className="flex flex-col text-lg gap-y-2 text-white/80 mb-8">
            <h2>
              Level: <span className="text-black font-semibold"> {level}</span>
            </h2>
            <h2>
              Score: <span className="text-black font-semibold"> {score}</span>
            </h2>
            <h2>
              Time Left:
              <span className="text-black font-semibold"> {timer} s</span>
            </h2>
          </div>

          {/* Incorrect Moves & Failures */}
          <div className="flex flex-col text-lg gap-y-2 text-white/80">
            <h2>
              Incorrect Moves:
              <span className="text-black font-semibold">
                {" "}
                {incorrectMoves}
              </span>
            </h2>
            <h2>
              Failures:
              <span className="text-black font-semibold"> {failure}</span>
            </h2>
          </div>
        </div>

        {/* Puzzle Grid */}
        <div className="w-6/12 flex flex-col justify-center items-center">
          <div
            className="grid gap-0.5"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`,
              width: "500px",
              height: "500px",
            }}
          >
            {shuffledPieces.map((piece, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(index, e)}
                onDrop={(e) => handleDrop(index, e)}
                onDragOver={handleDragOver}
                className={`relative border-2 ${
                  correctPositions[index] === piece
                    ? "border-1 border-green-500"
                    : "border-2 border-red-500"
                } rounded-md shadow-md`}
                style={{
                  width: `${500 / gridSize}px`,
                  height: `${500 / gridSize}px`,
                  backgroundImage: `url(${image})`,

                  backgroundPosition: getBackgroundPosition(
                    piece - 1,
                    gridSize
                  ),

                  backgroundSize: `${gridSize * 100}%`,
                }}
              >
                {piece}
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="w-3/12 h-full flex flex-col items-center">
          <h1 className="text-white/80 text-2xl font-semibold underline mb-6">
            Feedback:
          </h1>
          {/* If game complete */}
          {isSolved() && shuffledPieces.length > 0 && (
            <div className="mt-4 p-4 bg-green-600 text-white font-bold rounded-xl shadow-lg transition transform duration-300 ease-in-out hover:scale-105">
              Puzzle Completed!
            </div>
          )}

          {feedback && (
            <div
              className="mt-4 p-4  text-white font-bold rounded-xl shadow-lg cursor-pointer transition transform duration-300 ease-in-out hover:scale-105"
              onClick={resetPuzzle}
            >
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Puzzle;
