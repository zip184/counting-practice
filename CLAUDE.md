# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an educational counting app for kids built with React. The app displays random shapes (circles, squares, triangles, stars, hearts) along with a number, teaching children to count by matching the visual quantity to the displayed number.

## Development Commands

- `npm start` - Run development server at http://localhost:3000 with hot reload
- `npm test` - Run tests in interactive watch mode
- `npm test -- --coverage` - Run tests with coverage report
- `npm run build` - Create production build in `build/` folder

## Architecture

### Core Application Flow

The entire app is a single-component React application ([src/App.js](src/App.js)) with the following behavior:

1. **Shape Generation**: On load, click, or keypress, the app generates 1-5 random shapes of the same type
2. **Random Selection**: Each generation randomly selects:
   - Count (1-5)
   - Shape type (circle, square, triangle, star, heart)
   - Individual colors for each shape from a predefined palette
   - Random positions (x: 10-80%, y: 20-80%)
   - Random rotations (0-360 degrees)

3. **Shape Rendering**: The `renderShape` function creates DOM elements based on shape type:
   - `circle` and `square` use colored divs with border-radius styling
   - `triangle` uses CSS borders to create triangle shape
   - `star` and `heart` use Unicode characters (★ and ❤)

### State Management

Two primary state variables managed with `useState`:
- `count` - The number displayed to the user
- `shapes` - Array of shape objects with properties: `id`, `type`, `color`, `x`, `y`, `rotation`

### Styling

All styles are in [src/App.css](src/App.css). The app uses absolute positioning for shapes and centers the number display.

## Testing

Tests use React Testing Library and Jest (configured via Create React App). Test files follow the `*.test.js` naming convention. The test setup is configured in [src/setupTests.js](src/setupTests.js) which imports `@testing-library/jest-dom` for custom matchers.
