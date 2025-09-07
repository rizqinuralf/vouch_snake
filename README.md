# Snake Game 🐍

A classic Snake game built with Node.js and HTML5 Canvas, featuring modern web technologies and a clean, responsive design.

## Features

- **Classic Gameplay**: Grid-based movement with smooth controls
- **Responsive Controls**: Use arrow keys or WASD to control the snake
- **Progressive Difficulty**: Speed increases every 50 points
- **Score System**: Track your current score and persistent high score
- **Pause/Resume**: Space bar or button to pause anytime
- **Visual Feedback**: Snake with directional eyes that follow movement
- **Modern UI**: Gradient backgrounds, smooth animations, and clean design
- **Responsive Design**: Works on both desktop and mobile screens

## Installation

1. Clone the repository:
```bash
git clone git@github.com:josephvouch/vouch_snake.git
cd vouch_snake
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3456
```

## How to Play

- **Start**: Click the "Start Game" button
- **Move**: Use arrow keys (↑ ↓ ← →) or WASD keys
- **Pause**: Press Space bar or click "Pause" button
- **Objective**: Eat the red food to grow and increase your score
- **Avoid**: Don't hit the walls or your own tail!

## Game Controls

| Key | Action |
|-----|--------|
| ↑ / W | Move Up |
| ↓ / S | Move Down |
| ← / A | Move Left |
| → / D | Move Right |
| Space | Pause/Resume |

## Technical Stack

- **Backend**: Node.js with Express.js
- **Frontend**: Vanilla JavaScript with HTML5 Canvas
- **Styling**: Pure CSS with modern gradients and animations
- **Storage**: LocalStorage for high score persistence

## Project Structure

```
snake/
├── server.js           # Express server
├── package.json        # Node dependencies
├── public/
│   ├── index.html     # Game HTML structure
│   ├── styles.css     # Game styling
│   └── game.js        # Game logic and mechanics
└── README.md          # This file
```

## Game Mechanics

- **Snake Movement**: Continuous movement in the current direction
- **Growth System**: Snake grows by one segment when eating food
- **Collision Detection**: Game ends on wall or self-collision
- **Food Spawning**: Random placement on empty grid cells
- **Speed Scaling**: Increases progressively with score
- **180° Turn Prevention**: Cannot immediately reverse direction

## Development

To modify the game:

1. **Game Logic**: Edit `public/game.js`
2. **Styling**: Modify `public/styles.css`
3. **Server**: Update `server.js` for backend changes

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Any modern browser with Canvas support

## License

MIT License - Feel free to use and modify as needed.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## Author

Created with Node.js and vanilla JavaScript

---

Enjoy the game! 🎮