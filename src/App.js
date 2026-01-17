import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(3);
  const [shapes, setShapes] = useState([]);

  const shapeTypes = ['circle', 'square', 'triangle', 'star', 'heart'];
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

  const generateShapes = () => {
    const newCount = Math.floor(Math.random() * 5) + 1;
    const newShapes = [];
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];

    for (let i = 0; i < newCount; i++) {
      newShapes.push({
        id: Date.now() + i,
        type: shapeType,
        color: colors[Math.floor(Math.random() * colors.length)],
        x: Math.random() * 70 + 10,
        y: Math.random() * 60 + 20,
        rotation: Math.random() * 360,
      });
    }

    setCount(newCount);
    setShapes(newShapes);
  };

  useEffect(() => {
    generateShapes();
  }, []);

  useEffect(() => {
    const handleKeyPress = () => {
      generateShapes();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const renderShape = (shape) => {
    const style = {
      position: 'absolute',
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      transform: `rotate(${shape.rotation}deg)`,
    };

    switch (shape.type) {
      case 'circle':
        return (
          <div
            key={shape.id}
            className="shape circle"
            style={{ ...style, backgroundColor: shape.color }}
          />
        );
      case 'square':
        return (
          <div
            key={shape.id}
            className="shape square"
            style={{ ...style, backgroundColor: shape.color }}
          />
        );
      case 'triangle':
        return (
          <div
            key={shape.id}
            className="shape triangle"
            style={{
              ...style,
              borderBottomColor: shape.color,
            }}
          />
        );
      case 'star':
        return (
          <div
            key={shape.id}
            className="shape star"
            style={{ ...style, color: shape.color }}
          >
            ★
          </div>
        );
      case 'heart':
        return (
          <div
            key={shape.id}
            className="shape heart"
            style={{ ...style, color: shape.color }}
          >
            ❤
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App" onClick={generateShapes}>
      <div className="number-display">{count}</div>
      <div className="shapes-container">
        {shapes.map(shape => renderShape(shape))}
      </div>
    </div>
  );
}

export default App;
