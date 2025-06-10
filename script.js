const emojis = ["🍎", "🍌", "🍇", "🍒", "🍉", "🍍", "🥝", "🍑"];
let cards = [...emojis, ...emojis]; // Duplicate for matching pairs
cards = shuffle(cards);

const gameBoard = document.getElementById("game-board"); // The game board element
const statusText = document.getElementById("status-text"); // Status text element
const timerEl = document.getElementById("timer"); // Timer element
const movesEl = document.getElementById("moves"); // Moves element
const leaderboardEl = document.getElementById("leaderboard");
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

// Start the timer when the game starts
cards.forEach((emoji) => {
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
                    statusText.textContent = `🎉 You won in ${moves} moves and ${time} seconds! Refresh to play again.`;
                    stopTimer();
                    saveToLeaderboard(moves, time);
                    statusText.textContent = `🎉 You won in ${moves} moves and ${time} seconds! Refresh to play again.`;

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


    gameBoard.appendChild(card);
});

// Start the timer when the first card is flipped
function flipCard(card) {
    card.textContent = card.dataset.emoji;
    card.classList.add("flipped");
}

// Start the timer when the first card is flipped
function unflipCard(card) {
    card.textContent = "❓";
    card.classList.remove("flipped");
}

// Start the timer
function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Update moves and timer display
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

// Start the game and timer when the first card is flipped
function stopTimer() {
    clearInterval(timerInterval);
}

// Load leaderboard from local storage
function loadLeaderboard() {
    const stored = JSON.parse(localStorage.getItem(LEADERBOARD_KEY)) || [];
    renderLeaderboard(stored);
}

// Load leaderboard when the page loads
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

//  Save high score and leaderboard when the game is won
function renderLeaderboard(entries) {
    leaderboardEl.innerHTML = "";

    entries.forEach((entry, index) => {
        const li = document.createElement("li");
        li.textContent = `#${index + 1}: ${entry.moves} moves in ${entry.time}s (${entry.timestamp})`;
        leaderboardEl.appendChild(li);
    });
}

// Load leaderboard when the page loads
// loadHighScore(); // Load high score when the page loads
loadLeaderboard(); // Load leaderboard when the page loads

