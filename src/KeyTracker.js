import React, { useState, useEffect } from 'react';
import version from './version.json'; // Adjust path as needed

const KeyTracker = () => {
  const [pressedKeys, setPressedKeys] = useState({});
  const [keyConfig, setKeyConfig] = useState([]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      setPressedKeys((prevKeys) => ({
        ...prevKeys,
        [event.key]: true,
      }));
    };

    const handleKeyUp = (event) => {
      setPressedKeys((prevKeys) => {
        const updatedKeys = { ...prevKeys };
        delete updatedKeys[event.key];
        return updatedKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const getKeySymbol = (key) => {
      switch (key) {
        case 'ArrowLeft':
          return '←';
        case 'ArrowRight':
          return '→';
        case 'ArrowUp':
          return '↑';
        case 'ArrowDown':
          return '↓';
        default:
          return key;
      }
    };

    const keysArray = Object.keys(pressedKeys).map(getKeySymbol);
    setKeyConfig(keysArray);
  }, [pressedKeys]);

  return (
    <div>
      <p>Pressed Keys: {keyConfig.join(' ')}</p>
      <p>Version: {version.version}</p> 
    </div>
  );
};

export default KeyTracker;