import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [totalCount, setTotalCount] = useState(0);
  const [clickedCount, setClickedCount] = useState(0);
  const [shapes, setShapes] = useState([]);
  const [explodingShapes, setExplodingShapes] = useState(new Set());

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
    const minDistance = 35; // Minimum distance between shape centers in percentage
    for (const shape of existingShapes) {
      const distance = Math.sqrt(Math.pow(x - shape.x, 2) + Math.pow(y - shape.y, 2));
      if (distance < minDistance) {
        return true;
      }
    }
    return false;
  };

  const generatePosition = (existingShapes, maxAttempts = 50) => {
    for (let i = 0; i < maxAttempts; i++) {
      const x = Math.random() * 60 + 20; // 20-80%
      const y = Math.random() * 50 + 25; // 25-75%
      if (!checkOverlap(x, y, existingShapes)) {
        return { x, y };
      }
    }
    // Fallback if no position found
    return {
      x: Math.random() * 60 + 20,
      y: Math.random() * 50 + 25,
    };
  };

  const generateShapes = () => {
    const newCount = Math.floor(Math.random() * 5) + 1;
    const newShapes = [];
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

    for (let i = 0; i < newCount; i++) {
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

    setTotalCount(newCount);
    setClickedCount(0);
    setShapes(newShapes);
    setExplodingShapes(new Set());
  };

  const handleShapeClick = (e, shapeId) => {
    e.stopPropagation();

    if (explodingShapes.has(shapeId)) return;

    setExplodingShapes((prev) => new Set([...prev, shapeId]));
    setClickedCount((prev) => prev + 1);

    // Remove shape after animation completes
    setTimeout(() => {
      setShapes((prev) => prev.filter((s) => s.id !== shapeId));
    }, 500);
  };

  useEffect(() => {
    generateShapes();
  }, []);

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

  return (
    <div className="App">
      <div className="number-display">{clickedCount} / {totalCount}</div>
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
