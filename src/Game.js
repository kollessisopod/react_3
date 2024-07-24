import React, { useState, useEffect } from 'react';
import catasset from './assets/catasset.png';
import gifasset from './assets/gifasset.gif';
import fullmap from './assets/fullmap.png';
import { items as itemsInit, strings, stairs, ground } from './Database';
import './styles.css';

const Game = () => {
    const [keys, setKeys] = useState({ left: false, right: false, up: false, down: false, e: false });  // Arrow keys including 'e'
    const [items, setItems] = useState(itemsInit);  // Items
    const [activeAsset, setActiveAsset] = useState(catasset); // Player asset selector
    const [isFlipped, setIsFlipped] = useState(false);  // Player asset flipper boolean 
    const [activeItem, setActiveItem] = useState(null); // Active item
    const [activeStair, setActiveStair] = useState(null); // Active stair
    const [previousActiveStair, setPreviousActiveStair] = useState(null); // Previous active stair for collision detection
    const [previousActiveItem, setPreviousActiveItem] = useState(null); // Previous active item for collision detection
    const [showTextbox, setShowTextbox] = useState(false);  // Textbox show boolean
    const [showHint, setShowHint] = useState(false);  // Hint show boolean
    const [activeString, setActiveString] = useState(strings.stdefault); // Active string
    const [displayedString, setDisplayedString] = useState(''); // Displayed string
    const [charIndex, setCharIndex] = useState(0); // Character index for string showmaker
    const [player, setPlayer] = useState({ // Player object
        x: 50,
        y: 50,
        width: 50,
        height: 50,
        velocityY: 0,
        isOnGround: false,
        directionX: 1
    });
    const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 2 }); // Camera state

    const gravity = 0.5;  // Gravity static value

    // Item and Stair Collision detection
    useEffect(() => {
        if (previousActiveStair !== activeStair) {
            if (activeStair && !previousActiveStair) {
                console.log('Collision with a stair began:', activeStair);
                setShowHint(true);
            } else if (previousActiveStair && !activeStair) {
                console.log('Collision with a stair ended:', previousActiveStair);
                setShowHint(false);
            }
            setPreviousActiveStair(activeStair);
        }

        if (previousActiveItem !== activeItem) {
            if (activeItem && !previousActiveItem) {
                console.log('Collision with an item began:', activeItem);
                setActiveString(strings[activeItem.text]);
                setShowHint(true);
            } else if (previousActiveItem && !activeItem) {
                console.log('Collision with an item ended:', previousActiveItem);
                setShowTextbox(false);
                setShowHint(false);
                setCharIndex(0);
                setDisplayedString('');
            }
            setPreviousActiveItem(activeItem);
        }
    }, [activeStair, previousActiveStair, activeItem, previousActiveItem]);

    // Active listeners for arrow keys
    useEffect(() => {
        const handleKeyDown = (e) => {
            e.preventDefault();
            if (e.key === 'ArrowLeft') setKeys((keys) => ({ ...keys, left: true }));
            if (e.key === 'ArrowRight') setKeys((keys) => ({ ...keys, right: true }));
            if (e.key === 'ArrowUp') setKeys((keys) => ({ ...keys, up: true }));
            if (e.key === 'ArrowDown') setKeys((keys) => ({ ...keys, down: true }));
            if (e.key === 'E' || e.key === 'e') setKeys((keys) => ({ ...keys, e: true }));
        };

        const handleKeyUp = (e) => {
            e.preventDefault();
            if (e.key === 'ArrowLeft') setKeys((keys) => ({ ...keys, left: false }));
            if (e.key === 'ArrowRight') setKeys((keys) => ({ ...keys, right: false }));
            if (e.key === 'ArrowUp') setKeys((keys) => ({ ...keys, up: false }));
            if (e.key === 'ArrowDown') setKeys((keys) => ({ ...keys, down: false }));
            if (e.key === 'E' || e.key === 'e') setKeys((keys) => ({ ...keys, e: false }));
        };

        const handleWheel = (e) => {
          e.preventDefault();
          setCamera((camera) => ({
              ...camera,
              zoom: Math.max(0.1, camera.zoom + e.deltaY * -0.001) // Adjust zoom sensitivity
          }));
        };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      window.addEventListener('wheel', handleWheel);

      return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
          window.removeEventListener('wheel', handleWheel);
      };
    }, []);

    const checkCollision = (rect1, rect2) => {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    };

    // Flipper
    useEffect(() => {
        if (keys.left) {
            setIsFlipped(true);
        } else if (keys.right) {
            setIsFlipped(false);
        }
    }, [keys.left, keys.right]);

    // E Key
    useEffect(() => {
        if (keys.e) {
            console.log("e pressed");

            if (activeItem) {
                setItems((items) =>
                    items.map((item) =>
                        item === activeItem ? { ...item, glow: false } : item
                    )
                );
                setShowTextbox(!showTextbox);
                setShowHint(!showHint);
            }

            if (activeStair) {
                stairs.map((stair) => {
                    if (stair.stairId === activeStair.stairPointer) {
                        setPlayer((player) => {
                            return { ...player, x: stair.x, y: stair.y - player.height };
                        });
                    }
                    return null;
                });
            }
        }
        // eslint-disable-next-line
    }, [keys.e]);

    // Textbox Showmaker
    useEffect(() => {
        if (showTextbox && charIndex < activeString.length) {
            const timer = setTimeout(() => {
                setDisplayedString((prev) => prev + activeString[charIndex]);
                setCharIndex((prev) => prev + 1);
            }, 30); // Adjust the delay to control typing speed
            return () => clearTimeout(timer);
        }
    }, [charIndex, showTextbox, activeString]);

    // Asset change
    useEffect(() => {
        if (player.isOnGround) {
            if (keys.left || keys.right) {
                setActiveAsset(gifasset);
            } else if (keys.up) {
                setActiveAsset(gifasset);
            } else {
                setActiveAsset(catasset);
            }
        }
    }, [keys, player.isOnGround]);

    // Glow Effect
    useEffect(() => {
        console.log('Glowing items:', items.filter((item) => item.glow));
        // eslint-disable-next-line
    }, [items.glow]);

    // Movement and Camera
    useEffect(() => {
        const movePlayer = () => {
            setPlayer((player) => {
                let newX = player.x;
                let newY = player.y;
                let newVelocityY = player.velocityY;
                let newActiveItem = null;
                let newActiveStair = null;

                // Apply horizontal movement
                if (keys.left) newX -= 5;  // Move Left
                if (keys.right) newX += 5;  // Move Right
                if (keys.up && player.isOnGround) newVelocityY = -10;  // Jump

                // Apply gravity
                newVelocityY += gravity;
                newY += newVelocityY;

                const newPlayer = { ...player, x: newX, y: newY, velocityY: newVelocityY, isOnGround: false };

                // Handle collisions with items and stairs (unchanged)
                items.forEach((item) => {
                    if (checkCollision(newPlayer, item)) {
                        newActiveItem = item;
                    }
                });
                setActiveItem(newActiveItem);

                stairs.forEach((stair) => {
                    if (checkCollision(newPlayer, stair)) {
                        newActiveStair = stair;
                    }
                });
                setActiveStair(newActiveStair);

                // Check for ground collision
                ground.forEach((ground) => {
                    if (checkCollision(newPlayer, ground)) {
                        newPlayer.isOnGround = true;
                        newPlayer.y = ground.y - newPlayer.height; // Align player with the ground
                        newPlayer.velocityY = 0;
                    }
                });

                return newPlayer;
            });

                setCamera((camera) => {
                    return {
                        ...camera,
                        x: player.x - 540,  // Centering the player in the viewport (1080/2)
                        y: player.y - 360,  // Centering the player in the viewport (720/2)
                    };
                });
            };

        const interval = setInterval(movePlayer, 20);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [keys, player]);

    const calculateTransformOrigin = () => {
      const containerWidth = 1080; // Replace with actual width
      const containerHeight = 720; // Replace with actual height

      const originX = (player.x + player.width / 2) / containerWidth * 100;
      const originY = (player.y + player.height / 2) / containerHeight * 100;

      return `${originX}% ${originY}%`;
  };

    return (
        <div className="wrapper">
            <div
                className="game-container"
                style={{
                    backgroundImage: `url(${fullmap})`,
                    transform: `translate(-50%, -50%) scale(${camera.zoom})`,
                    transformOrigin: calculateTransformOrigin(),
                }}
            >
                <img
                    className="player"
                    src={activeAsset}
                    alt="Player"
                    style={{
                        left: player.x,
                        top: player.y,
                        transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)',
                    }}
                />

                {items.map((item, index) => (
                    <div
                        key={index}
                        className="item"
                        style={{
                            left: item.x,
                            top: item.y,
                            width: item.width,
                            height: item.height,
                            backgroundColor: item.glow ? 'green' : 'gray',
                        }}
                    />
                ))}

                {stairs.map((stair, index) => (
                    <div
                        key={index}
                        className="stair"
                        style={{
                            left: stair.x,
                            top: stair.y,
                            width: stair.width,
                            height: stair.height,
                        }}
                    />
                ))}

                {ground.map((ground, index) => (
                    <div
                        key={index}
                        className="ground"
                        style={{
                            left: ground.x,
                            top: ground.y,
                            width: ground.width,
                            height: ground.height,
                        }}
                    />
                ))}

                {showTextbox && activeItem && (
                    <div
                        className="textbox"
                        style={{
                            left: activeItem.x - 95,
                            top: activeItem.y - 100,
                        }}
                    >
                        <p>{displayedString}</p>
                    </div>
                )}

                {showHint && (activeItem || activeStair) && (
                    <div
                        className="hint"
                        style={{
                            left: player.x - 75,
                            top: player.y,
                        }}
                    >
                        <p>Press E</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Game;