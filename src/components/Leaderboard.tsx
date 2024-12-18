import React, { } from 'react';
import { usePuzzleData } from '../context/PuzzleContext';



const Leaderboard: React.FC = () => {
 

const {leaderboard, resetPuzzle} = usePuzzleData();

const handleClear =()=>{
    localStorage.removeItem("leaderboard");
    resetPuzzle();

}
  

  return (
    <div className=" flex flex-col justify-center p-4">
     
      {leaderboard.length === 0 ? (
        <p className='text-light'>No leaderboard data available.</p>
      ) : (
       <>
       
       <div className='h-[380px] overflow-y-auto'>
            <table className="  w-full border-collapse border border-gray-300">
          <thead className='text-lightdark'>
            <tr>
              
              <th className="border border-gray-300 px-4 py-2 text-center">Username</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Score</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Level</th>
              <th className="border border-gray-300 px-4 py-2 text-center">Completion Time</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard
              .sort((a, b) => b.score - a.score) // Sort by score in descending order
              .map((entry, index) => (
                <tr key={index} className="odd:bg-light even:text-white">
               
                  <td className="border border-gray-300 px-4 py-2">{entry.username}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.score}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.level}</td>
                  <td className="border border-gray-300 px-4 py-2">{entry.completionTime}s</td>
                </tr>
              ))}
          </tbody>
        </table>

        
        </div>
        <div
        className=" px-4 py-2 mt-8 self-center bg-semidark rounded-full shadow text-light font-semibold cursor-pointer"
        onClick={handleClear}
      >
        Clear List
      </div>
       </>
      )}
       
    </div>
  );
};

export default Leaderboard;
