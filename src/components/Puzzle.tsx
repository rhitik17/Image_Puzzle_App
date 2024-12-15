import React, { useState, useEffect } from "react";
import { usePuzzleData } from "../context/PuzzleContext";

const Puzzle: React.FC = () => {

  const {
    gridSize,
    shuffledPieces,
    correctPositions,
    image,
    setGridSize,
    setShuffledPieces,
    isSolved,
  } = usePuzzleData();





 

  //for drag and drop the pieces
  const handleDragStart = (index: number, event: React.DragEvent) => {
    event.dataTransfer.setData("pieceIndex", index.toString());
  };

  const handleDrop = (index: number, event: React.DragEvent) => {
    event.preventDefault();
    const draggedIndex = parseInt(event.dataTransfer.getData("pieceIndex"));
    const updatedPieces = [...shuffledPieces];
    [updatedPieces[index], updatedPieces[draggedIndex]] = [
      updatedPieces[draggedIndex],
      updatedPieces[index],
    ];
    setShuffledPieces(updatedPieces);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // to calculate background position for each piece
  const getBackgroundPosition = (index: number, size: number) => {
    const row = Math.floor(index / size);
    const col = index % size;
    return `${(col * 100) / (size - 1)}% ${(row * 100) / (size - 1)}%`;
  };

  
  

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-cyan-800 px-6">
      <h1 className="text-2xl font-bold text-white mb-4">
        Dynamic Puzzle Game
      </h1>

      {/* Grid size selector */}
      <div className="mb-4">
        <label htmlFor="gridSize" className="mr-2 text-white">
          Select Grid Size:
        </label>
        <select
          id="gridSize"
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
          className="border rounded px-2 bg-gray-800 text-white"
        >
          {[...Array(11).keys()].map((_, i) => (
            <option key={i + 2} value={i + 2}>
              {i + 2} x {i + 2}
            </option>
          ))}
        </select>
      </div>

      {/* Puzzle grid */}
      <div
        className="grid gap-1"
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
            className={`border ${
              correctPositions[index] === piece
                ? "border-2 border-green-500"
                : " border-2 border-red-500"
            }`}
            style={{
              width: `${500 / gridSize}px`,
              height: `${500 / gridSize}px`,
              backgroundImage: `url(${image})`,
              backgroundPosition: getBackgroundPosition(piece, gridSize),
              backgroundSize: `${gridSize * 100}%`,
            }}
          ></div>
        ))}
      </div>

      {/* if game complete  */}
      {isSolved() && (
        <div className="mt-4 p-2 bg-green-600 text-white font-bold rounded">
          Puzzle Completed!
        </div>
      )}

    </div>
  );
};

export default Puzzle;
