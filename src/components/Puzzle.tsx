import React, { useState } from 'react';

const Puzzle: React.FC = () => {
  const [gridSize, setGridSize] = useState(2);

  
  const images = Array.from({ length: gridSize * gridSize }, (_, i) => `/part${i + 1}.jpg`);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-600">
      <h1 className="text-2xl font-bold mb-4">Puzzle Game</h1>

      {/* Grid size selection section */}
      <div className="mb-4">
        <label htmlFor="gridSize" className="mr-2 font-medium">
          Select Grid Size:
        </label>
        <select
          id="gridSize"
          value={gridSize}
          onChange={(e) => setGridSize(Number(e.target.value))}
          className="border rounded p-1 bg-cyan-800 text-white"
        >
          <option value={2}>2 x 2</option>
          <option value={3}>3 x 3</option>
          <option value={4}>4 x 4</option>
        </select>
      </div>

      {/* Puzzle grid section */}
      <div
  className={`grid  ${gridSize === 2 ? 'grid-cols-2 grid-rows-2' : ''} ${gridSize === 3 ? 'grid-cols-3 grid-rows-3' : ''} ${gridSize === 4 ? 'grid-cols-4 grid-rows-4' : ''}`}
>
  {images.map((img, index) => (
    <div
      key={index}
      className="border border-gray-300 flex items-center justify-center"
    >
      <img src={img} alt={`${index + 1}`} className="w-full h-full object-cover" />
    </div>
  ))}
</div>


    </div>
  );
};

export default Puzzle;
