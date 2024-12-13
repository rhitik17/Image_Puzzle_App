import React, { useState } from "react";

const Puzzle: React.FC = () => {
  const [gridSize, setGridSize] = useState(2);

  const images = Array.from(
    { length: gridSize * gridSize },
    (_, i) => `/part${i + 1}.jpg`
  );

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6 min-h-screen md:bg-gradient-to-r from-blue-900 to-cyan-800 via-gray-800 px-6import React, { useState } from ">
      <h1 className="text-2xl font-bold mb-4 text-white/90">Puzzle Game</h1>

      {/* Grid size selection section */}
      <div className="mb-4">
        <label htmlFor="gridSize" className="mr-2 font-medium text-white/60">
          Select Grid Size:
        </label>
        <select
          id="gridSize"
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
          className="border rounded px-1 bg-cyan-900 text-white"
        >
          <option value={2}>2 x 2</option>
          <option value={3}>3 x 3</option>
          <option value={4}>4 x 4</option>
          <option value={5}>5 x 5</option>
          <option value={6}>6 x 6</option>
          <option value={7}>7 x 7</option>
          <option value={8}>8 x 8</option>
          <option value={9}>9 x 9</option>
          <option value={10}>10 x 10</option>
          <option value={11}>11 x 11</option>
          <option value={12}>12 x 12</option>
        </select>
      </div>

      {/* Puzzle grid section */}
      <div
        className={`grid }`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            className="border border-gray-300 flex items-center justify-center"
          >
            <img
              src={img}
              alt={`${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Puzzle;
