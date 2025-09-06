# 🧠 Memory Match Game

A modern, feature-rich memory matching game built with vanilla JavaScript, HTML5, and CSS3. Test your memory skills with three difficulty levels and track your progress on the leaderboard!

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Play%20Now-brightgreen?style=for-the-badge)](https://your-username.github.io/memory-match-game)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

## ✨ Features

### 🎮 Game Features
- **Three Difficulty Levels**: Easy (4×4), Medium (6×6), and Hard (8×8)
- **Dynamic Emoji Sets**: Curated emoji collections for each difficulty
- **Real-time Tracking**: Move counter and timer
- **Leaderboard**: Persistent high scores with difficulty tracking
- **New Game Button**: Instant restart without page refresh

### 🎨 User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Card flip transitions and hover effects
- **Visual Feedback**: Color-coded status messages (success, error, info)
- **Accessibility**: Keyboard navigation and screen reader support
- **Error Handling**: Graceful error recovery and user feedback

### 🛠️ Technical Features
- **Vanilla JavaScript**: No dependencies, pure ES6+ code
- **Local Storage**: Persistent leaderboard data
- **Modular Architecture**: Clean, maintainable code structure
- **Error Boundaries**: Comprehensive error handling throughout
- **Performance Optimized**: Efficient DOM manipulation and memory management

## 🚀 Quick Start

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required!

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/memory-match-game.git
   cd memory-match-game
   ```

2. **Open the game:**
   ```bash
   # Option 1: Open directly in browser
   open index.html
   
   # Option 2: Serve with a local server (recommended)
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **Start playing!** 🎉

## 🎯 How to Play

1. **Select Difficulty**: Choose from Easy (4×4), Medium (6×6), or Hard (8×8)
2. **Flip Cards**: Click on two cards to reveal their emojis
3. **Find Matches**: If the cards match, they stay revealed
4. **Complete the Game**: Match all pairs to win!
5. **Track Progress**: Your score is automatically saved to the leaderboard

### 🏆 Scoring
- **Moves**: Number of card pairs flipped
- **Time**: Total time to complete the game
- **Leaderboard**: Top 10 scores per difficulty level

## 🎨 Difficulty Levels

| Difficulty | Grid Size | Pairs | Emojis | Description |
|------------|-----------|-------|--------|-------------|
| **Easy** | 4×4 | 8 | 🍎🍌🍇🍒🍉🍍🥝🍑 | Perfect for beginners |
| **Medium** | 6×6 | 18 | Extended fruit & vegetable set | Balanced challenge |
| **Hard** | 8×8 | 32 | Comprehensive food collection | Expert level |

## 🛠️ Development

### Project Structure
```
memory-match-game/
├── index.html          # Main HTML file
├── script.js           # Game logic and functionality
├── styles.css          # Styling and responsive design
├── README.md           # Project documentation
├── .gitignore          # Git ignore rules
└── todo.md            # Development roadmap
```

### Key Components

- **Game Engine**: Core matching logic and state management
- **UI Controller**: DOM manipulation and user interactions
- **Storage Manager**: Local storage for leaderboard persistence
- **Error Handler**: Comprehensive error logging and user feedback
- **Responsive Layout**: CSS Grid and Flexbox for adaptive design

### Code Quality
- ✅ Comprehensive error handling
- ✅ Input validation and sanitization
- ✅ Clean, documented code
- ✅ No external dependencies
- ✅ Cross-browser compatibility

## 🎨 Customization

### Adding New Emojis
Edit the `DIFFICULTY_CONFIGS` object in `script.js`:
```javascript
const DIFFICULTY_CONFIGS = {
    easy: {
        name: "Easy",
        gridSize: 4,
        emojis: ["🍎", "🍌", "🍇", "🍒", "🍉", "🍍", "🥝", "🍑"]
    },
    // Add your custom emojis here
};
```

### Styling Changes
Modify `styles.css` to customize:
- Card colors and sizes
- Grid layouts
- Animations and transitions
- Responsive breakpoints

### Adding New Features
The modular architecture makes it easy to extend:
- New difficulty levels
- Sound effects
- Themes and skins
- Multiplayer support

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and patterns
- Add error handling for new features
- Test across different browsers and devices
- Update documentation for new features

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Emoji sets curated for optimal gameplay experience
- Responsive design patterns from modern web standards
- Error handling patterns from production applications

## 📊 Project Status

![Progress](https://img.shields.io/badge/Progress-85%25-brightgreen?style=for-the-badge)

### ✅ Completed Features
- [x] Core matching game mechanics
- [x] Three difficulty levels
- [x] Leaderboard system
- [x] Responsive design
- [x] Error handling
- [x] New game functionality

### 🚧 In Progress
- [ ] Sound effects
- [ ] Advanced animations
- [ ] Theme system

### 📋 Planned Features
- [ ] Multiplayer mode
- [ ] Daily challenges
- [ ] Achievement system
- [ ] Statistics tracking

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by John Norris

</div>