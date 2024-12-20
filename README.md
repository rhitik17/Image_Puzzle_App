# Puzzle Game Application

## Overview
This puzzle game application is built using **React.js**, **TypeScript**, and **Tailwind CSS**, offering a challenging and engaging experience for users. The app features dynamic puzzle grids, real-time validation, a scoring system, and secure user authentication.

---

## Features

### 1. **Puzzle Grid Logic**
- **Dynamic Puzzle Generation**:
  - Starts with a 2x2 grid and increases up to 12x12.
  - Displays a randomly chosen image, adjusted based on the grid size.
  - Grid pieces are draggable.
- **Real-time Puzzle Solver Validation**:
  - Validates each drag-and-drop move in real time.
  - Highlights correctly placed pieces (e.g., with a green border).
- **Custom Shuffling Algorithm**:
  - Ensures randomized but solvable puzzles.
  - Avoids using libraries like Fisher-Yates.

### 2. **Timer, Score, and User Progression**
- **Complex Scoring System**:
  - Scoring based on time and incorrect moves:
    - Excellent: Finish within 30% of time, 0 incorrect moves.
    - Good Job: Finish in 30%-50% of time, up to 3 incorrect moves.
    - You Can Do Better: Finish in 50%-99% of time, 4-6 incorrect moves.
    - Please Try Again: Time runs out or >6 incorrect moves.
- **Dynamic Timer**:
  - Time reduces as per level increases for difficulty.
  - Additional 10-second penalty per incorrect move.
- **Level Persistence**:
  - Progress to the next puzzle after completing one.
  - Restart the game if failed 3 times in a row, clearing localStorage.

### 3. **Puzzle Behavior**
- **Custom Drag-and-Drop Logic**:
  - Implemented without external libraries.
  - Pieces snap into place when correctly placed but remain movable until solved.
- **Customizable Grid**:
  - Difficulty ranges from 2x2 to 12x12 grids.
- **Persistence on Refresh**:
  - Saves current puzzle state in localStorage.
  - Reloads from the saved state on refresh.
- **Piece Scramble on New Puzzle**:
  - Randomizes piece locations for each restart.

### 4. **Advanced Scoreboard**
- **Real-time Leaderboard**:
  - Displays scores, levels, and completion times.
  - Data stored in localStorage and dynamically updated.
  - Feature to clear Leaderboard.
- **Cross-Browser Compatibility**:
  - Ensures functionality in Chrome, Firefox, Safari, and Edge.

### 5. **Authentication**
- **Custom Authentication System**:
  - Simple register/login and logout system using sessionStorage.
  - Persists user session across tabs.
- **Password Hashing**:
  - Stores hashed passwords using a custom hash function.
  - No plain-text storage.
- **Session Validation**:
  - Validates sessionStorage on each page load.
  - Redirects to login if the session expires.

### 6. **State Management & Performance Optimization**
- **Custom State Management**:
  - Uses React Context API for efficient state handling.
  - Avoids unnecessary re-renders for smooth performance.
  - Critical game data accessible across components.

### 7. **LocalStorage and SessionStorage**
- **Storage Constraints**:
  - Notifies the user if storage limits are reached.
  - Provides options to clear space.
- **Encryption**:
  - Implements custom encryption for all stored data.

### 8. **Image Preview with Point Deduction**
- **Starting Points**:
  - Users start with 3 points.
  - Points deducted for time over, or preview usage.
- **Image Preview Feature**:
  - Displays the full puzzle image as a hint for 5 seconds.
  - Costs 1 point per preview.
  - Tracks preview usage and adjusts score accordingly.

---

## Installation and Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/rhitik17/Image_Puzzle_App.git
   ```
2. Navigate to the project directory:
   ```bash
   cd puzzle-game
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the app in your browser at `http://localhost:5173` (or the provided port).

---

## Folder Structure
```
src/
├── components/         # Reusable React components
├── context/            # Custom state management using React Context API
├── styles/             # Tailwind CSS styles and configurations
├── utils/              # Helper functions (e.g., encryption, shuffling)
├── App.tsx             # Root component
├── index.tsx           # Application entry point
```

---

## Technologies Used
- **React.js**
- **TypeScript**
- **Tailwind CSS**

---

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request for review.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

## Contact
For any inquiries or feedback, feel free to reach out:
- **Email**: ritikbhandari17@gmail.com
- **GitHub**: [GitHub Profile](https://github.com/rhitik17)

