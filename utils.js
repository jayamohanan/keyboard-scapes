// Common utilities shared across all game modes

// Standard QWERTY keyboard layout
const CORRECT_LAYOUT = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

// Common word lists for different difficulty levels
const WORD_LISTS = {
    easy: ['LOVE', 'HOPE', 'TIME', 'LIFE', 'HOME', 'WORK', 'PLAY', 'JUMP', 'FAST', 'BEST'],
    medium: ['HOUSE', 'WORLD', 'PLACE', 'THINK', 'PHONE', 'WATER', 'MUSIC', 'LIGHT', 'FIRST', 'HEART'],
    hard: ['TYPING', 'PLAYER', 'RECORD', 'BUTTON', 'SCREEN', 'PEOPLE', 'MOMENT', 'WINTER', 'SPRING', 'SUMMER']
};

// Get a flat array of all letters
function getAllLetters() {
    return CORRECT_LAYOUT.flat();
}

// Find position of a letter in the correct layout
function findLetterPosition(letter) {
    for (let row = 0; row < CORRECT_LAYOUT.length; row++) {
        const col = CORRECT_LAYOUT[row].indexOf(letter);
        if (col !== -1) {
            return { row, col };
        }
    }
    return null;
}

// Check if current layout matches correct layout
function isLayoutCorrect(currentLayout) {
    for (let row = 0; row < currentLayout.length; row++) {
        for (let col = 0; col < currentLayout[row].length; col++) {
            if (currentLayout[row][col] !== CORRECT_LAYOUT[row][col]) {
                return false;
            }
        }
    }
    return true;
}

// Get random word from word list
function getRandomWord(difficulty = 'medium') {
    const words = WORD_LISTS[difficulty];
    return words[Math.floor(Math.random() * words.length)];
}

// Get multiple unique random words
function getRandomWords(count, difficulty = 'medium') {
    const words = [...WORD_LISTS[difficulty]];
    const selected = [];
    for (let i = 0; i < count && words.length > 0; i++) {
        const index = Math.floor(Math.random() * words.length);
        selected.push(words.splice(index, 1)[0]);
    }
    return selected;
}

// Show win overlay
function showWinOverlay(onNext, onHome) {
    const overlay = document.createElement('div');
    overlay.className = 'game-overlay show';
    overlay.innerHTML = `
        <div class="overlay-content win">
            <h2>🎉 Perfect!</h2>
            <p>You completed the level!</p>
            <div class="buttons">
                <button class="home-btn" onclick="handleHomeClick()">🏠 Home</button>
                <button class="next-btn show" onclick="handleNextClick()">Next Level →</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    window.handleNextClick = () => {
        document.body.removeChild(overlay);
        if (onNext) onNext();
    };
    
    window.handleHomeClick = () => {
        window.location.href = 'index.html';
    };
}

// Show fail overlay
function showFailOverlay(message, onRetry, onHome) {
    const overlay = document.createElement('div');
    overlay.className = 'game-overlay show';
    overlay.innerHTML = `
        <div class="overlay-content fail">
            <h2>❌ Oops!</h2>
            <p>${message}</p>
            <div class="buttons">
                <button class="home-btn" onclick="handleHomeClick()">🏠 Home</button>
                <button class="retry-btn" onclick="handleRetryClick()">🔄 Retry</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    window.handleRetryClick = () => {
        document.body.removeChild(overlay);
        if (onRetry) onRetry();
    };
    
    window.handleHomeClick = () => {
        window.location.href = 'index.html';
    };
}

// Update message in info bar
function updateMessage(text) {
    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.textContent = text;
    }
}

// Update level number
function updateLevel(level) {
    const levelElement = document.getElementById('levelNumber');
    if (levelElement) {
        levelElement.textContent = level;
    }
}

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Get random items from array
function getRandomItems(array, count) {
    const shuffled = shuffleArray(array);
    return shuffled.slice(0, count);
}

// Deep clone layout
function cloneLayout(layout) {
    return JSON.parse(JSON.stringify(layout));
}
