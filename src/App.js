import { useState, useEffect, useRef } from "react";
import "./App.css";
import { playExplosionSound, speakNumber, warmUpVoices } from "./audioUtils";

function App() {
  const [totalCount, setTotalCount] = useState(0);
  const [clickedCount, setClickedCount] = useState(0);
  const [shapes, setShapes] = useState([]);
  const [explodingShapes, setExplodingShapes] = useState(new Set());

  // Refs to access current state in event handler
  const shapesRef = useRef(shapes);
  const explodingShapesRef = useRef(explodingShapes);
  const handleShapeClickRef = useRef(null);

  // Keep refs in sync with state
  useEffect(() => {
    shapesRef.current = shapes;
    explodingShapesRef.current = explodingShapes;
  }, [shapes, explodingShapes]);

  const SHAPE_SIZE = 300; // Size in pixels
  const shapeTypes = ["circle", "square", "triangle", "star", "heart"];
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
  ];

  const checkOverlap = (x, y, existingShapes) => {
    // Shapes are 300px and positioned as percentage of viewport
    // On a 1920px wide screen, 300px = ~15.6% of width
    // On a 1280px wide screen, 300px = ~23.4% of width
    // Use 40% as safe minimum distance to ensure no overlap on any screen size
    const minDistancePercent = 40;

    for (const shape of existingShapes) {
      const distance = Math.sqrt(
        Math.pow(x - shape.x, 2) + Math.pow(y - shape.y, 2),
      );
      console.log(`Checking distance between (${x}, ${y}) and (${shape.x}, ${shape.y}): ${distance} (min: ${minDistancePercent})`);
      if (distance < minDistancePercent) {
        console.log(`OVERLAP DETECTED! Distance ${distance} < ${minDistancePercent}`);
        return true;
      }
    }
    return false;
  };

  const generatePosition = (existingShapes, maxAttempts = 100) => {
    for (let i = 0; i < maxAttempts; i++) {
      const x = Math.random() * 70 + 15; // 15-85% (wider range)
      const y = Math.random() * 60 + 20; // 20-80% (taller range)
      console.log(`Attempt ${i + 1}: Testing position (${x}, ${y})`);
      if (!checkOverlap(x, y, existingShapes)) {
        console.log(`✓ Position (${x}, ${y}) accepted!`);
        return { x, y };
      }
    }
    // Fallback if no position found
    console.warn(`⚠️ FALLBACK: Could not find non-overlapping position after ${maxAttempts} attempts, using random position anyway`);
    const fallbackPos = {
      x: Math.random() * 70 + 15,
      y: Math.random() * 60 + 20,
    };
    console.log(`Fallback position: (${fallbackPos.x}, ${fallbackPos.y})`);
    return fallbackPos;
  };

  const generateShapes = () => {
    const newCount = Math.floor(Math.random() * 3) + 1; // Changed from 5 to 3 max
    console.log(`\n=== Generating ${newCount} shapes ===`);
    const newShapes = [];
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

    for (let i = 0; i < newCount; i++) {
      console.log(`\n--- Shape ${i + 1} of ${newCount} ---`);
      const position = generatePosition(newShapes);
      newShapes.push({
        id: Date.now() + i,
        type: shapeType,
        color: colors[Math.floor(Math.random() * colors.length)],
        x: position.x,
        y: position.y,
        rotation: Math.random() * 360,
      });
    }

    console.log(`\n=== Final shape positions ===`);
    newShapes.forEach((shape, idx) => {
      console.log(`Shape ${idx + 1}: (${shape.x}, ${shape.y})`);
    });
    console.log(`===========================\n`);

    setTotalCount(newCount);
    setClickedCount(0);
    setShapes(newShapes);
    setExplodingShapes(new Set());
  };

  const handleShapeClick = (e, shapeId) => {
    e.stopPropagation();

    if (explodingShapes.has(shapeId)) return;

    setExplodingShapes((prev) => new Set([...prev, shapeId]));

    // Calculate new count value
    const newCount = clickedCount + 1;

    // Play sounds immediately in user gesture context (required for Chrome)
    playExplosionSound();
    speakNumber(newCount);

    // Update count state (pure function, no side effects)
    setClickedCount(newCount);

    // Remove shape after animation completes
    setTimeout(() => {
      setShapes((prev) => prev.filter((s) => s.id !== shapeId));
    }, 500);
  };

  // Store the click handler in ref so keyboard handler can use it
  handleShapeClickRef.current = handleShapeClick;

  useEffect(() => {
    generateShapes();
    warmUpVoices(); // Pre-load voices on app start
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Separate effect for keyboard handler that doesn't re-run on state changes
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default behavior for space to avoid page scroll
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
      }

      // Use refs to get current state without causing re-renders
      const unclickedShapes = shapesRef.current.filter(
        (shape) => !explodingShapesRef.current.has(shape.id),
      );

      if (unclickedShapes.length > 0) {
        // Pick a random unclicked shape
        const randomShape =
          unclickedShapes[Math.floor(Math.random() * unclickedShapes.length)];

        // Use the ref to get the current click handler
        const fakeEvent = { stopPropagation: () => {} };
        handleShapeClickRef.current(fakeEvent, randomShape.id);
      } else {
        // All shapes clicked - generate new number
        generateShapes();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); // Empty deps - only set up listener once

  const handleNewNumber = (e) => {
    e.stopPropagation();
    generateShapes();
  };

  const handleReset = (e) => {
    e.stopPropagation();
    const newShapes = [];
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

    for (let i = 0; i < totalCount; i++) {
      const position = generatePosition(newShapes);
      newShapes.push({
        id: Date.now() + i,
        type: shapeType,
        color: colors[Math.floor(Math.random() * colors.length)],
        x: position.x,
        y: position.y,
        rotation: Math.random() * 360,
      });
    }

    setClickedCount(0);
    setShapes(newShapes);
    setExplodingShapes(new Set());
  };

  const renderShape = (shape) => {
    const isExploding = explodingShapes.has(shape.id);
    const style = {
      position: "absolute",
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      transform: `rotate(${shape.rotation}deg)`,
      cursor: "pointer",
    };

    const shapeClass = isExploding ? "shape exploding" : "shape";

    switch (shape.type) {
      case "circle":
        return (
          <div
            key={shape.id}
            className={`${shapeClass} circle`}
            style={{
              ...style,
              backgroundColor: shape.color,
              width: `${SHAPE_SIZE}px`,
              height: `${SHAPE_SIZE}px`,
            }}
            onClick={(e) => handleShapeClick(e, shape.id)}
          />
        );
      case "square":
        return (
          <div
            key={shape.id}
            className={`${shapeClass} square`}
            style={{
              ...style,
              backgroundColor: shape.color,
              width: `${SHAPE_SIZE}px`,
              height: `${SHAPE_SIZE}px`,
            }}
            onClick={(e) => handleShapeClick(e, shape.id)}
          />
        );
      case "triangle":
        return (
          <div
            key={shape.id}
            className={`${shapeClass} triangle`}
            style={{
              ...style,
              borderBottomColor: shape.color,
              borderLeftWidth: `${SHAPE_SIZE / 2}px`,
              borderRightWidth: `${SHAPE_SIZE / 2}px`,
              borderBottomWidth: `${SHAPE_SIZE}px`,
            }}
            onClick={(e) => handleShapeClick(e, shape.id)}
          />
        );
      case "star":
        return (
          <div
            key={shape.id}
            className={`${shapeClass} star`}
            style={{
              ...style,
              color: shape.color,
              fontSize: `${SHAPE_SIZE}px`,
            }}
            onClick={(e) => handleShapeClick(e, shape.id)}
          >
            ★
          </div>
        );
      case "heart":
        return (
          <div
            key={shape.id}
            className={`${shapeClass} heart`}
            style={{
              ...style,
              color: shape.color,
              fontSize: `${SHAPE_SIZE}px`,
            }}
            onClick={(e) => handleShapeClick(e, shape.id)}
          >
            ❤
          </div>
        );
      default:
        return null;
    }
  };

  const isComplete = clickedCount === totalCount && totalCount > 0;

  return (
    <div className="App">
      <div className={`number-display ${isComplete ? "complete" : ""}`}>
        {clickedCount}
      </div>
      <div className="button-container">
        <button className="control-button" onClick={handleNewNumber}>
          New Number
        </button>
        <button className="control-button" onClick={handleReset}>
          Reset
        </button>
      </div>
      <div className="shapes-container">
        {shapes.map((shape) => renderShape(shape))}
      </div>
    </div>
  );
}

export default App;
