// Game configuration
const DIFFICULTY_CONFIGS = {
    easy: {
        name: "Easy",
        gridSize: 4,
        emojis: ["🍎", "🍌", "🍇", "🍒", "🍉", "🍍", "🥝", "🍑"]
    },
    medium: {
        name: "Medium", 
        gridSize: 6,
        emojis: ["🍎", "🍌", "🍇", "🍒", "🍉", "🍍", "🥝", "🍑", "🍊", "🍋", "🍐", "🥭", "🍓", "🫐", "🥥", "🍈", "🍏", "🍅"]
    },
    hard: {
        name: "Hard",
        gridSize: 8,
        emojis: ["🍎", "🍌", "🍇", "🍒", "🍉", "🍍", "🥝", "🍑", "🍊", "🍋", "🍐", "🥭", "🍓", "🫐", "🥥", "🍈", "🍏", "🍅", "🥕", "🌽", "🥔", "🍠", "🥜", "🌰", "🍯", "🥛", "🍼", "🧀", "🥚", "🍳", "🥞", "🥨"]
    }
};

const LEADERBOARD_KEY = "memoryMatchLeaderboard";
const MAX_ENTRIES = 10;

// Error handling utility functions
function logError(message, error = null) {
    console.error(`Memory Match Game Error: ${message}`, error);
    showStatusMessage(`⚠️ ${message}`, 'error');
}

function showStatusMessage(message, type = 'info') {
    const statusText = document.getElementById("status-text");
    if (statusText) {
        statusText.textContent = message;
        statusText.className = type;
    }
}

function validateDOMElement(element, elementName) {
    if (!element) {
        throw new Error(`Required DOM element '${elementName}' not found`);
    }
    return element;
}

// Initialize DOM elements with validation
let gameBoard, statusText, timerEl, movesEl, leaderboardEl, newGameBtn, difficultySelect;

try {
    gameBoard = validateDOMElement(document.getElementById("game-board"), "game-board");
    statusText = validateDOMElement(document.getElementById("status-text"), "status-text");
    timerEl = validateDOMElement(document.getElementById("timer"), "timer");
    movesEl = validateDOMElement(document.getElementById("moves"), "moves");
    leaderboardEl = validateDOMElement(document.getElementById("leaderboard"), "leaderboard");
    newGameBtn = validateDOMElement(document.getElementById("new-game-btn"), "new-game-btn");
    difficultySelect = validateDOMElement(document.getElementById("difficulty"), "difficulty");
} catch (error) {
    logError("Failed to initialize game elements", error);
    throw error;
}

// Initialize game state
let currentDifficulty = 'medium';
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let moves = 0;

// Timer variables
let time = 0;
let timerInterval = null;
let gameStarted = false;

// Initialize cards based on current difficulty
function initializeCards() {
    const config = DIFFICULTY_CONFIGS[currentDifficulty];
    const totalPairs = (config.gridSize * config.gridSize) / 2;
    const selectedEmojis = config.emojis.slice(0, totalPairs);
    cards = [...selectedEmojis, ...selectedEmojis]; // Duplicate for matching pairs
    cards = shuffle(cards);
}

// Initialize cards on startup
initializeCards();

// Create a card element with click handler
function createCard(emoji) {
    try {
        // Validate input
        if (!emoji || typeof emoji !== 'string') {
            throw new Error('Invalid emoji provided to createCard');
        }

        const card = document.createElement("div");
        if (!card) {
            throw new Error('Failed to create card element');
        }

        card.classList.add("card");
        card.dataset.emoji = emoji;
        card.textContent = "❓";

        card.addEventListener("click", () => {
            try {
                handleCardClick(card);
            } catch (error) {
                logError("Error handling card click", error);
            }
        });

        return card;
    } catch (error) {
        logError("Failed to create card", error);
        return null;
    }
}

// Handle card click with error handling
function handleCardClick(card) {
    if (!card) {
        throw new Error('Invalid card element');
    }

    if (lockBoard || card.classList.contains("flipped")) return;

    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }

    flipCard(card);

    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        lockBoard = true;
        moves++;
        
        try {
            movesEl.textContent = moves;
        } catch (error) {
            logError("Failed to update moves display", error);
        }

        if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            resetTurn();
            matches++;

            const config = DIFFICULTY_CONFIGS[currentDifficulty];
            const totalPairs = (config.gridSize * config.gridSize) / 2;
            
            if (matches === totalPairs) {
                stopTimer();
                showStatusMessage(`🎉 You won in ${moves} moves and ${time} seconds!`, 'success');
                saveToLeaderboard(moves, time, currentDifficulty);
            }
        } else {
            setTimeout(() => {
                try {
                    unflipCard(firstCard);
                    unflipCard(secondCard);
                    resetTurn();
                } catch (error) {
                    logError("Error in card unflip timeout", error);
                }
            }, 1000);
        }
    }
}

// Create initial game board
function createGameBoard() {
    try {
        if (!gameBoard) {
            throw new Error('Game board element not available');
        }

        // Update game board class for current difficulty
        gameBoard.className = `game-board ${currentDifficulty}`;
        gameBoard.innerHTML = "";
        
        if (!cards || cards.length === 0) {
            throw new Error('No cards available to create game board');
        }

        cards.forEach((emoji, index) => {
            const card = createCard(emoji);
            if (card) {
                gameBoard.appendChild(card);
            } else {
                logError(`Failed to create card at index ${index}`);
            }
        });
    } catch (error) {
        logError("Failed to create game board", error);
    }
}

// Initialize the game
createGameBoard();

// Flip a card to reveal its emoji
function flipCard(card) {
    try {
        if (!card) {
            throw new Error('Invalid card element provided to flipCard');
        }
        if (!card.dataset.emoji) {
            throw new Error('Card missing emoji data');
        }
        
        card.textContent = card.dataset.emoji;
        card.classList.add("flipped");
    } catch (error) {
        logError("Failed to flip card", error);
    }
}

// Unflip a card to hide its emoji
function unflipCard(card) {
    try {
        if (!card) {
            throw new Error('Invalid card element provided to unflipCard');
        }
        
        card.textContent = "❓";
        card.classList.remove("flipped");
    } catch (error) {
        logError("Failed to unflip card", error);
    }
}

// Reset the turn state for the next pair of cards
function resetTurn() {
    try {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    } catch (error) {
        logError("Failed to reset turn", error);
    }
}

// Shuffle an array using Fisher-Yates algorithm
function shuffle(array) {
    try {
        if (!Array.isArray(array)) {
            throw new Error('Invalid input: expected array');
        }
        if (array.length === 0) {
            return array;
        }

        const shuffledArray = [...array]; // Create a copy to avoid mutating original
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    } catch (error) {
        logError("Failed to shuffle array", error);
        return array; // Return original array if shuffle fails
    }
}

// Start the game and timer
function startTimer() {
    try {
        if (timerInterval) {
            clearInterval(timerInterval); // Clear any existing timer
        }
        
        timerInterval = setInterval(() => {
            try {
                time++;
                if (timerEl) {
                    timerEl.textContent = time;
                }
            } catch (error) {
                logError("Error updating timer display", error);
            }
        }, 1000);
    } catch (error) {
        logError("Failed to start timer", error);
    }
}

// Stop the game timer
function stopTimer() {
    try {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    } catch (error) {
        logError("Failed to stop timer", error);
    }
}

// Load leaderboard from local storage
function loadLeaderboard() {
    try {
        if (!leaderboardEl) {
            throw new Error('Leaderboard element not available');
        }

        let stored = [];
        try {
            const storedData = localStorage.getItem(LEADERBOARD_KEY);
            if (storedData) {
                stored = JSON.parse(storedData);
                if (!Array.isArray(stored)) {
                    throw new Error('Invalid leaderboard data format');
                }
            }
        } catch (storageError) {
            logError("Failed to load leaderboard from storage", storageError);
            stored = [];
        }

        renderLeaderboard(stored);
    } catch (error) {
        logError("Failed to load leaderboard", error);
    }
}

// Save a new score to the leaderboard
function saveToLeaderboard(moves, time, difficulty = currentDifficulty) {
    try {
        // Validate input parameters
        if (typeof moves !== 'number' || moves < 0 || !Number.isInteger(moves)) {
            throw new Error('Invalid moves value');
        }
        if (typeof time !== 'number' || time < 0) {
            throw new Error('Invalid time value');
        }
        if (!DIFFICULTY_CONFIGS[difficulty]) {
            throw new Error('Invalid difficulty value');
        }

        const timestamp = new Date().toLocaleString();
        const config = DIFFICULTY_CONFIGS[difficulty];
        const newEntry = { moves, time, timestamp, difficulty, gridSize: config.gridSize };

        let leaderboard = [];
        try {
            const storedData = localStorage.getItem(LEADERBOARD_KEY);
            if (storedData) {
                leaderboard = JSON.parse(storedData);
                if (!Array.isArray(leaderboard)) {
                    throw new Error('Invalid leaderboard data format');
                }
            }
        } catch (storageError) {
            logError("Failed to load existing leaderboard", storageError);
            leaderboard = [];
        }

        leaderboard.push(newEntry);

        // Sort by moves, then time
        leaderboard.sort((a, b) => {
            if (a.moves !== b.moves) return a.moves - b.moves;
            return a.time - b.time;
        });

        leaderboard = leaderboard.slice(0, MAX_ENTRIES);
        
        try {
            localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
        } catch (storageError) {
            logError("Failed to save leaderboard to storage", storageError);
            return;
        }

        renderLeaderboard(leaderboard);
    } catch (error) {
        logError("Failed to save to leaderboard", error);
    }
}

// Render the leaderboard entries to the DOM
function renderLeaderboard(entries) {
    try {
        if (!leaderboardEl) {
            throw new Error('Leaderboard element not available');
        }

        if (!Array.isArray(entries)) {
            throw new Error('Invalid entries format');
        }

        leaderboardEl.innerHTML = "";

        entries.forEach((entry, index) => {
            try {
                if (!entry || typeof entry.moves !== 'number' || typeof entry.time !== 'number') {
                    logError(`Invalid entry at index ${index}`);
                    return;
                }

                const li = document.createElement("li");
                const difficultyText = entry.difficulty ? ` (${DIFFICULTY_CONFIGS[entry.difficulty]?.name || entry.difficulty})` : '';
                li.textContent = `#${index + 1}: ${entry.moves} moves in ${entry.time}s${difficultyText} (${entry.timestamp || 'Unknown'})`;
                leaderboardEl.appendChild(li);
            } catch (error) {
                logError(`Failed to render leaderboard entry at index ${index}`, error);
            }
        });
    } catch (error) {
        logError("Failed to render leaderboard", error);
    }
}

// Reset the game to initial state
function resetGame() {
    try {
        // Stop timer if running
        stopTimer();
        
        // Reset game state variables
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        matches = 0;
        moves = 0;
        time = 0;
        gameStarted = false;
        
        // Reset display
        try {
            if (timerEl) timerEl.textContent = time;
            if (movesEl) movesEl.textContent = moves;
            if (statusText) statusText.textContent = "";
        } catch (error) {
            logError("Failed to reset display elements", error);
        }
        
        // Reshuffle cards
        try {
            initializeCards();
        } catch (error) {
            logError("Failed to reshuffle cards", error);
            return;
        }
        
        // Recreate the game board
        createGameBoard();
    } catch (error) {
        logError("Failed to reset game", error);
    }
}

// Handle difficulty change
function handleDifficultyChange() {
    try {
        if (!difficultySelect) {
            throw new Error('Difficulty select element not available');
        }
        
        const newDifficulty = difficultySelect.value;
        if (!DIFFICULTY_CONFIGS[newDifficulty]) {
            throw new Error(`Invalid difficulty: ${newDifficulty}`);
        }
        
        // Only change difficulty if it's different from current
        if (newDifficulty !== currentDifficulty) {
            currentDifficulty = newDifficulty;
            
            // Reset the game with new difficulty
            resetGame();
            
            showStatusMessage(`Switched to ${DIFFICULTY_CONFIGS[currentDifficulty].name} difficulty`, 'info');
        }
    } catch (error) {
        logError("Failed to change difficulty", error);
    }
}

// Add event listeners with error handling
try {
    if (newGameBtn) {
        newGameBtn.addEventListener("click", () => {
            try {
                resetGame();
            } catch (error) {
                logError("Error in new game button click", error);
            }
        });
    } else {
        logError("New game button not found");
    }
    
    if (difficultySelect) {
        difficultySelect.addEventListener("change", handleDifficultyChange);
    } else {
        logError("Difficulty select not found");
    }
} catch (error) {
    logError("Failed to add event listeners", error);
}

// Initialize the game with error handling
try {
    // Load leaderboard when the page loads
    loadLeaderboard();
} catch (error) {
    logError("Failed to initialize game", error);
}

