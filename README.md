# Kids Counting App

An interactive counting application for young children, built with React. Kids click on colorful shapes that explode with satisfying sound effects, helping them learn to count from 1 to 3.

![React](https://img.shields.io/badge/React-19.2.3-blue)
![Create React App](https://img.shields.io/badge/Create%20React%20App-5.0.1-green)

## Features

- 🎨 **Colorful Shapes** - Circles, squares, triangles, stars, and hearts in vibrant colors
- 🎵 **Sound Effects** - Explosion sounds and number speech on each click
- ⌨️ **Keyboard Support** - Press any key to count automatically
- 🎉 **Celebration Animation** - Number grows and animates when counting is complete
- 🔄 **Smart Collision Detection** - Shapes never overlap, ensuring clear visibility
- 📱 **Responsive Design** - Works on all screen sizes

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd counting
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open in your browser at [http://localhost:3000](http://localhost:3000)

## How to Use

### For Kids

1. **Click on shapes** - Click any colorful shape to make it explode and count up
2. **Press any key** - Alternatively, press any key on the keyboard to automatically click a random shape
3. **Watch the counter** - The number in the top-left shows your progress (e.g., "2 / 3")
4. **Celebrate!** - When you've clicked all shapes, the number grows big in the middle of the screen
5. **Keep going** - Press any key to get new shapes and start counting again

### Control Buttons

- **New Number** - Generate a new set of shapes (1-3 random shapes)
- **Reset** - Reset the current shapes back to their original positions

## Technical Details

### Built With

- **React** - UI framework
- **Web Audio API** - Explosion sound synthesis
- **Web Speech API** - Text-to-speech for counting
- **CSS3 Animations** - Shape animations and transitions

### Key Features

#### Collision Detection
- Uses Euclidean distance algorithm to prevent shape overlap
- Minimum 40% distance between shape centers
- Up to 100 placement attempts before fallback
- Ensures shapes are always clearly visible and clickable

#### Sound System
- **Explosion Sound**: Synthesized using Web Audio API with frequency sweep (400Hz → 50Hz) and white noise
- **Number Speech**: Uses browser's text-to-speech to speak numbers 1-3
- All audio triggers from user gestures (required for Chrome)

#### Animations
- **Pop-in**: Shapes appear with scale/rotate animation (0.3s)
- **Explode**: Shapes grow and fade when clicked (0.5s)
- **Celebrate**: Number grows to 50vh and bounces when complete (0.6s)

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Safari on macOS may have speech synthesis volume routing issues

## Development

### Available Scripts

- `npm start` - Run development server with hot reload
- `npm test` - Run tests in watch mode
- `npm run build` - Create production build
- `npm run eject` - Eject from Create React App (⚠️ irreversible)

### Project Structure

```
counting/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── App.js          # Main application component
│   ├── App.css         # Styles and animations
│   ├── audioUtils.js   # Sound effects and speech
│   ├── index.js        # Application entry point
│   └── ...
├── CLAUDE.md           # Technical documentation for AI assistants
├── README.md           # This file
└── package.json
```

### Key Files

- **[src/App.js](src/App.js)** - Main React component with shape generation, click handling, and collision detection
- **[src/audioUtils.js](src/audioUtils.js)** - Audio synthesis and speech functions
- **[src/App.css](src/App.css)** - All styles including animations
- **[CLAUDE.md](CLAUDE.md)** - Detailed technical documentation

## Known Issues

1. **macOS Speech Synthesis** - On macOS, the browser may report that it's speaking but no audio is heard. This is due to system speech volume routing and is not a code issue. Check System Settings > Accessibility > Spoken Content.

2. **Occasional Overlap** - In rare cases when generating 3 shapes, shapes may slightly overlap if the algorithm exhausts all placement attempts.

## Contributing

This is a personal educational project. Feel free to fork and modify for your own use.

## License

MIT License - feel free to use this for educational purposes.

## Acknowledgments

- Built with [Create React App](https://create-react-app.dev/)
- Sound effects synthesized with [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- Speech powered by [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
