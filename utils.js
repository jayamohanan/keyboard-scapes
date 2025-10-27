// Common utilities shared across all game modes

// Standard QWERTY keyboard layout
const CORRECT_LAYOUT = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

// Word lists loaded from CSV
let WORD_LISTS = {
    3: [],
    4: [],
    5: [],
    6: []
};

// Flag to check if words are loaded
let wordsLoaded = false;

// Load words from CSV file
async function loadWordsFromCSV() {
    if (wordsLoaded) return;
    
    try {
        const response = await fetch('data/words.csv');
        const csvText = await response.text();
        const lines = csvText.split('\n');
        
        // Skip header line
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const [word, letterCount] = line.split(',');
            if (!word || !letterCount) continue;
            
            const count = parseInt(letterCount);
            const cleanWord = word.trim().toUpperCase();
            
            // Only include words with 3-6 letters and only alphabetic characters
            if (count >= 3 && count <= 6 && /^[A-Z]+$/.test(cleanWord)) {
                if (WORD_LISTS[count]) {
                    WORD_LISTS[count].push(cleanWord);
                }
            }
        }
        
        wordsLoaded = true;
        console.log('Words loaded:', {
            '3-letter': WORD_LISTS[3].length,
            '4-letter': WORD_LISTS[4].length,
            '5-letter': WORD_LISTS[5].length,
            '6-letter': WORD_LISTS[6].length
        });
    } catch (error) {
        console.error('Error loading words:', error);
        // Fallback word lists
        WORD_LISTS = {
            3: ['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HER'],
            4: ['THAT', 'WITH', 'HAVE', 'THIS', 'WILL', 'YOUR', 'FROM', 'THEY', 'KNOW', 'WANT'],
            5: ['WOULD', 'THERE', 'THEIR', 'WHAT', 'ABOUT', 'WHICH', 'THINK', 'COULD', 'PEOPLE', 'FIRST'],
            6: ['SHOULD', 'BEFORE', 'PEOPLE', 'REALLY', 'LITTLE', 'THINGS', 'BECAUSE', 'CHANGE', 'PERSON', 'SCHOOL']
        };
        wordsLoaded = true;
    }
}

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

// Get random word from word list by letter count
function getRandomWord(letterCount = 4) {
    if (!WORD_LISTS[letterCount] || WORD_LISTS[letterCount].length === 0) {
        return null;
    }
    const words = WORD_LISTS[letterCount];
    return words[Math.floor(Math.random() * words.length)];
}

// Get multiple unique random words
function getRandomWords(count, letterCount = 4) {
    if (!WORD_LISTS[letterCount] || WORD_LISTS[letterCount].length === 0) {
        return [];
    }
    
    const words = [...WORD_LISTS[letterCount]];
    const selected = [];
    
    for (let i = 0; i < count && words.length > 0; i++) {
        const index = Math.floor(Math.random() * words.length);
        selected.push(words.splice(index, 1)[0]);
    }
    
    return selected;
}

// Get random words with mixed lengths (3-6 letters)
function getRandomMixedWords(count) {
    const selected = [];
    const availableLengths = [3, 4, 5, 6];
    
    for (let i = 0; i < count; i++) {
        // Pick a random length
        const length = availableLengths[Math.floor(Math.random() * availableLengths.length)];
        const word = getRandomWord(length);
        
        if (word) {
            selected.push(word);
        }
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
