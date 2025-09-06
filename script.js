const emojis = ["🍎", "🍌", "🍇", "🍒", "🍉", "🍍", "🥝", "🍑"];
let cards = [...emojis, ...emojis]; // Duplicate for matching pairs
cards = shuffle(cards);

const gameBoard = document.getElementById("game-board"); // The game board element
const statusText = document.getElementById("status-text"); // Status text element
const timerEl = document.getElementById("timer"); // Timer element
const movesEl = document.getElementById("moves"); // Moves element
const leaderboardEl = document.getElementById("leaderboard");
const newGameBtn = document.getElementById("new-game-btn"); // New game button
const LEADERBOARD_KEY = "memoryMatchLeaderboard";
const MAX_ENTRIES = 10;

// Initialize game state variables
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let moves = 0;

// Timer variables
let time = 0;
let timerInterval = null;
let gameStarted = false;

// Create a card element with click handler
function createCard(emoji) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.emoji = emoji;
    card.textContent = "❓";

    card.addEventListener("click", () => {
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
            movesEl.textContent = moves;

            if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
                firstCard.classList.add("matched");
                secondCard.classList.add("matched");
                resetTurn();
                matches++;

                if (matches === emojis.length) {
                    stopTimer();
                    statusText.textContent = `🎉 You won in ${moves} moves and ${time} seconds!`;
                    saveToLeaderboard(moves, time);
                }
            } else {
                setTimeout(() => {
                    unflipCard(firstCard);
                    unflipCard(secondCard);
                    resetTurn();
                }, 1000);
            }
        }
    });

    return card;
}

// Create initial game board
function createGameBoard() {
    gameBoard.innerHTML = "";
    cards.forEach((emoji) => {
        const card = createCard(emoji);
        gameBoard.appendChild(card);
    });
}

// Initialize the game
createGameBoard();

// Flip a card to reveal its emoji
function flipCard(card) {
    card.textContent = card.dataset.emoji;
    card.classList.add("flipped");
}

// Unflip a card to hide its emoji
function unflipCard(card) {
    card.textContent = "❓";
    card.classList.remove("flipped");
}

// Reset the turn state for the next pair of cards
function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Shuffle an array using Fisher-Yates algorithm
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Start the game and timer
function startTimer() {
    timerInterval = setInterval(() => {
        time++;
        timerEl.textContent = time;
    }, 1000);
}

// Stop the game timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Load leaderboard from local storage
function loadLeaderboard() {
    const stored = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
    renderLeaderboard(stored);
}

// Save a new score to the leaderboard
function saveToLeaderboard(moves, time) {
    const timestamp = new Date().toLocaleString();
    const newEntry = { moves, time, timestamp };

    let leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];

    leaderboard.push(newEntry);

    leaderboard.sort((a, b) => {
        // Sort by moves, then time
        if (a.moves !== b.moves) return a.moves - b.moves;
        return a.time - b.time;
    });

    leaderboard = leaderboard.slice(0, MAX_ENTRIES);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
    renderLeaderboard(leaderboard);
}

// Render the leaderboard entries to the DOM
function renderLeaderboard(entries) {
    leaderboardEl.innerHTML = "";

    entries.forEach((entry, index) => {
        const li = document.createElement("li");
        li.textContent = `#${index + 1}: ${entry.moves} moves in ${entry.time}s (${entry.timestamp})`;
        leaderboardEl.appendChild(li);
    });
}

// Reset the game to initial state
function resetGame() {
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
    timerEl.textContent = time;
    movesEl.textContent = moves;
    statusText.textContent = "";
    
    // Reshuffle cards
    cards = [...emojis, ...emojis];
    cards = shuffle(cards);
    
    // Recreate the game board
    createGameBoard();
}

// Add event listener to new game button
newGameBtn.addEventListener("click", resetGame);

// Load leaderboard when the page loads
loadLeaderboard();

