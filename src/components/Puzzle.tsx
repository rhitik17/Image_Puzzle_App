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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setTimeout(()=>{
      setIsModalOpen(false);
    },5000)
  };

 

  return (
    <div
      className={`w-full h-screen flex flex-col items-center justify-center bg-gradient-to-r from-dark to-semidark px-6 py-10`}
    >
      <h1 className="text-3xl font-bold text-light mb-10">
        Dynamic Puzzle Game
      </h1>
      <div className="w-full flex justify-between gap-4 items-center">
        {/* Insights Area */}
        <div className="w-3/12 h-full flex flex-col justify-between gap-y-6 items-center px-6 font-semibold text-white">
          {/* Grid Size Selector */}
          <div className="flex items-center mb-8">
            <label
              htmlFor="gridSize"
              className="mr-4 text-2xl font-medium text-lightdark"
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
              <span className="text-light font-semibold"> {incorrectMoves}</span>
            </h2>
            <h2>
              Failures:
              <span className="text-light font-semibold"> {failure}</span>
            </h2>
          </div>
        </div>

        {/* Puzzle Grid */}
        <div
          className={`w-6/12 flex flex-col justify-center items-center transition-opacity duration-500 ${
            isSolved() ? "opacity-100" : "opacity-100"
          } transition-transform transform ${
            isSolved() ? "scale-110" : "scale-100"
          }`}
        >
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
                draggable={!isSolved() && !feedback}
                onDragStart={(e) => {
                  if (!isSolved() && !feedback) {
                    handleDragStart(index, e);
                  }
                }}
                onDrop={(e) => handleDrop(index, e)}
                onDragOver={handleDragOver}
                className={`relative border-2 ${
                  correctPositions[index] === piece
                    ? "border-1 border-green-500"
                    : "border-2 border-red-500"
                } rounde shadow-md`}
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
               
              </div>
            ))}
          </div>

         
        </div>

        {/* Feedback Section */}
        <div className="w-3/12 h-full flex flex-col items-center">
          <h1 className="text-lightdark text-2xl font-semibold underline mb-6">
            Feedback:
          </h1>
          {/* If game complete */}
          {isSolved() && shuffledPieces.length > 0 && (
            <div className="mt-4 p-4 bg-green-600 text-white font-bold rounded-xl shadow-lg transition transform duration-300 ease-in-out hover:scale-105">
              Puzzle Solved!
            </div>
          )}

          {feedback && (
            <div
              className="mt-4 p-4 flex flex-col justify-center items-center text-white font-bold rounded-xl shadow-lg cursor-pointer transition transform duration-300 ease-in-out scale-105"
              onClick={resetPuzzle}
            >
              {feedback}
              <h2>You have solved in {timer} s</h2>
            </div>
          )}
        </div>
      </div>
      <div className=" px-4 py-2 mt-8 self-center bg-semidark rounded-full shadow text-light font-semibold cursor-pointer"
       onClick={handleOpenModal}
      >
            Preview image 
      </div>

       {/* Modal for image preview */}
       {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-1 rounded-lg shadow-lg max-w-lg w-full">
          
            <img
              src={image}
              alt="Puzzle Preview"
              className="w-full h-auto rounded-md shadow-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Puzzle;
