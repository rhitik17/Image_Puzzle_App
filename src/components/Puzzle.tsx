import React, { useState, useEffect } from "react";

const Puzzle: React.FC = () => {
  const [gridSize, setGridSize] = useState(3); // Set initial grid size (e.g., 3x3)
  const [image, setImage] = useState(""); // Random image
  const [shuffledPieces, setShuffledPieces] = useState<number[]>([]);
  const [correctPositions, setCorrectPositions] = useState<number[]>([]);
  const imagesArray = ["/part1.jpg"]; // Add your image URLs here

  //to generate the required pieces
  const generatePieces = (size: number) =>
    Array.from({ length: size * size }, (_, i) => i);

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

  useEffect(() => {
    const pieces = generatePieces(gridSize);
    setCorrectPositions(pieces);
    setShuffledPieces(shufflePieces(pieces));
    setImage(imagesArray[Math.floor(Math.random() * imagesArray.length)]);
  }, [gridSize]);

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
    </div>
  );
};

export default Puzzle;
