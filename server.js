const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3456;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Default route serves the game
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Snake game server running at http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});