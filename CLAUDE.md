# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interactive counting app for kids built with React. Kids click on colorful shapes that explode with sound effects, helping them learn to count from 1 to 3. The app displays a counter showing progress (e.g., "2 / 3") and celebrates when all shapes are clicked.

## Development Commands

- `npm start` - Run development server at http://localhost:3000 with hot reload
- `npm test` - Run tests in interactive watch mode
- `npm test -- --coverage` - Run tests with coverage report
- `npm run build` - Create production build in `build/` folder

## Architecture

### Core Application Flow

The app is a single-component React application ([src/App.js](src/App.js)) with the following features:

1. **Shape Generation**: Generates 1-3 random shapes of the same type on load or when requested
2. **Interactive Counting**: Kids click shapes or press any key to count up
3. **Sound Effects**: Plays explosion sound and speaks the number on each click
4. **Celebration**: When all shapes are clicked, the number grows to 50vh and animates to center screen
5. **Auto-progression**: Pressing any key after completion generates new shapes

### Shape Generation Details

- **Count**: Random 1-3 shapes (reduced from 5 to prevent overlap)
- **Shape Types**: circle, square, triangle, star (★), heart (❤)
- **Colors**: 8 vibrant colors from predefined palette
- **Positions**: Random with collision detection
  - X: 15-85% of viewport width
  - Y: 20-80% of viewport height
  - Minimum 40% distance between shapes to prevent overlap
  - Up to 100 attempts to find valid position before fallback
- **Size**: All shapes are 300px
- **Rotation**: Random 0-360 degrees

### Collision Detection

The app uses a distance-based algorithm to prevent shape overlap:
- Calculates Euclidean distance between shape centers
- Minimum distance: 40% (in percentage coordinates)
- Attempts up to 100 placements before using fallback position
- Debug logging shows placement attempts (in development mode)

### State Management

Uses React hooks for state:
- `totalCount` - Total number of shapes
- `clickedCount` - Number of shapes clicked so far
- `shapes` - Array of shape objects: `{id, type, color, x, y, rotation}`
- `explodingShapes` - Set of IDs for shapes currently exploding

Uses refs for keyboard handler:
- `shapesRef`, `explodingShapesRef` - Current state accessible without re-renders
- `handleShapeClickRef` - Latest click handler for keyboard events

### Audio System

Located in [src/audioUtils.js](src/audioUtils.js):

**Explosion Sound** (`playExplosionSound`):
- Web Audio API synthesis (no audio files needed)
- Frequency sweep: 400Hz → 50Hz over 100ms
- White noise burst for texture
- Volumes: oscillator 0.15, noise 0.08
- Duration: 250ms total

**Speech Synthesis** (`speakNumber`):
- Web Speech API for text-to-speech
- Speaks the count (1, 2, 3...) after each click
- Prefers English voices, falls back to first available
- `warmUpVoices()` pre-loads voices on app start (Chrome async requirement)
- May not work on macOS due to system speech volume routing

**Important**: Audio must be triggered from user gesture (Chrome requirement). Both functions are called directly in `handleShapeClick` to maintain gesture context.

### Keyboard Interaction

Any key press triggers counting:
- If shapes remain: clicks random unclicked shape
- If all shapes clicked: generates new set of shapes
- Space bar: prevents default page scroll behavior
- Uses refs to avoid effect dependency issues

### Animations

Defined in [src/App.css](src/App.css):

- **pop-in**: Shapes appear with scale/rotate animation (0.3s)
- **explode**: Shapes scale up and fade out on click (0.5s)
- **celebrate**: Number grows and bounces when complete (0.6s)

Shape removal happens 500ms after click (after explosion animation).

### Component Structure

Single functional component with:
- Shape generation logic
- Click and keyboard handlers
- Collision detection algorithm
- Shape rendering switch statement (circle, square, triangle, star, heart)
- Two control buttons: "New Number" and "Reset"

### Styling

All styles in [src/App.css](src/App.css):
- Full viewport gradient background (purple tones)
- Absolute positioned shapes
- Large counter display (180px, grows to 50vh when complete)
- Glassmorphic control buttons (top right)
- CSS animations for pop-in, explode, and celebrate effects

## Testing

Tests use React Testing Library and Jest (configured via Create React App). Test files follow the `*.test.js` naming convention. Setup in [src/setupTests.js](src/setupTests.js).

**Note**: Current test file needs updating to match new interactive functionality.

## Known Issues

1. **Speech Synthesis on macOS**: May not produce audio due to system speech volume routing, even though Chrome reports it's "speaking". This is a macOS system issue, not a code issue.

2. **Collision Detection Debug Logging**: Extensive console.log statements are present for debugging overlap issues. These should be removed or wrapped in DEBUG flag for production.

3. **Occasional Overlap**: In rare cases (typically when generating 3 shapes), the fallback position is used after 100 attempts, which may cause overlap. This is visible in console warnings.

## Development Notes

- Shape size is controlled from React (`SHAPE_SIZE = 300`), not CSS
- Event handlers use `stopPropagation()` to prevent event bubbling
- State updaters are pure functions (side effects moved out for React StrictMode compatibility)
- Keyboard handler uses empty dependency array with refs to prevent infinite loops
