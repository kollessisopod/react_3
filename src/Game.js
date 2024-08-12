import React, { useState, useEffect, useCallback } from 'react';
import KeyTracker from './KeyTracker';
import idleAsset from './assets/idlePlaceholder.png';
import walkAsset from './assets/walkPlaceholder.gif';
import fullmap from './assets/mapPlaceholder.png';
import glowAsset from './assets/glowPlaceholder.gif';
import { items as itemsInit, strings, stairs, ground } from './Database';
import './styles.css';

    /////////////////////////////////////////////   Game.js   /////////////////////////////////////////////
    //                                                                                                  //  

const Game = () => {
    // State variables //-------------------------------------
    const [keys, setKeys] = useState({ left: false, right: false, up: false, down: false, e: false });  // Arrow keys including 'e'
    const [items, setItems] = useState(itemsInit);  // Items
    const [activeAsset, setActiveAsset] = useState(idleAsset); // Player asset selector
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
    const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1.5 }); // Camera state
    const gravity = 0.5;  // Gravity static value

    // Methods //-------------------------------------
    //
    //------------------------------------------------

    // Use useCallback to memoize functions
    const handleKeyDown = useCallback((e) => {
        e.preventDefault();
        setKeys((prevKeys) => {
            switch (e.key) {
                case 'ArrowLeft':
                    return { ...prevKeys, left: true };
                case 'ArrowRight':
                    return { ...prevKeys, right: true };
                case 'ArrowUp':
                    return { ...prevKeys, up: true };
                case 'ArrowDown':
                    return { ...prevKeys, down: false };
                case 'E':
                case 'e':
                    return { ...prevKeys, e: true };
                default:
                    return prevKeys;
            }
        });
    }, []);

    const handleKeyUp = useCallback((e) => {
        e.preventDefault();
        setKeys((prevKeys) => {
            switch (e.key) {
                case 'ArrowLeft':
                    return { ...prevKeys, left: false };
                case 'ArrowRight':
                    return { ...prevKeys, right: false };
                case 'ArrowUp':
                    return { ...prevKeys, up: false };
                case 'ArrowDown':
                    return { ...prevKeys, down: false };
                case 'E':
                case 'e':
                    return { ...prevKeys, e: false };
                default:
                    return prevKeys;
            }
        });
    }, []);

    // Wheel listener
    const handleWheel = (e) => {
        setCamera((prevCamera) => {
          let newZoom = prevCamera.zoom + (e.deltaY * -0.001);
          newZoom = Math.min(Math.max(newZoom, 1), 2);
          return { ...prevCamera, zoom: newZoom };
        });
    };

    // Collision detection logic
    const checkCollision = (rect1, rect2) => {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    };

    // Linear interpolation function
    const lerp = (start, end, t) => {
        return start * (1 - t) + end * t;
    };


    // UseEffects //-------------------------------------
    //
    //---------------------------------------------------

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

    // Key listener adders / removers
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        window.addEventListener('wheel', handleWheel);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('wheel', handleWheel);
        };
    }, [handleKeyDown, handleKeyUp]);

    // MC asset flipper
    useEffect(() => {
        if (keys.left) {
            setIsFlipped(true);
        } else if (keys.right) {
            setIsFlipped(false);
        }
    }, [keys.left, keys.right]);

    // E Key Actions
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

    // Asset changer
    useEffect(() => {
        if (player.isOnGround) {
            if (keys.left || keys.right) {
                setActiveAsset(walkAsset);
            } else if (keys.up) {
                setActiveAsset(walkAsset);
            } else {
                setActiveAsset(idleAsset);
            }
        }
    }, [keys, player.isOnGround]);

    // Glow Effect Manager
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
                        if(keys.up) {
                            newPlayer.velocityY = -10;
                        }
                        else {
                        newPlayer.isOnGround = true;
                        newPlayer.y = ground.y - newPlayer.height; // Align player with the ground
                        newPlayer.velocityY = 0;
                        }
                    }
                });

                return newPlayer;
            });

            setCamera((camera) => {

                let newCameraX = camera.x;
                let newCameraY = camera.y;

                if (player.y < 360) {
                    newCameraX= player.x;  // Centering the player in the viewport (1080/2)
                    newCameraY= 0;  // Centering the player in the viewport (720/2)
                        
                } else {
                    newCameraX= player.x;  // Centering the player in the viewport (1080/2)
                    newCameraY= player.y + 20;  // Centering the player in the viewport (720/2)
                };

                const smoothX = lerp(camera.x, newCameraX, 0.1);
                const smoothY = lerp(camera.y, newCameraY, 0.1);
                
                return { ...camera, x: smoothX, y: smoothY };
                });
            };

        const interval = setInterval(movePlayer, 20);
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [keys, player]);

    

    // Return //--------------------------------------
    //
    //------------------------------------------------
    
    return (
        <div className="wrapper">
            
            <div className="hud">
                        <p>Zoom Level: {camera.zoom.toFixed(2)}</p>
                        <KeyTracker/>
                </div>
            <div
                className="game-container"
                style={{
                    backgroundImage: `url(${fullmap})`,
                    transform: `translate(-50%, -50%) scale(${camera.zoom})`,
                    transformOrigin: `${camera.x}px ${camera.y}px`,
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
                    position: 'absolute', // Ensure the container is relatively positioned
                    boxShadow: activeItem === item ? '0 0 10px 5px #ff00ff' : 'none', // Add a glow effect
                    }}
                >
                    <img
                    src= {item.assetIndex}
                    alt="Item"
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute', // Stack the images
                        top: 0,
                        left: 0,
                    }}
                    />
                    <img
                    src={item.glow ? glowAsset : null}
                    alt="Item Glow"
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute', // Stack the images
                        top: 0,
                        left: 0,
                        opacity: item.glow ? 0.5 : 0, // Adjust opacity for the glow effect
                    }}
                    />
                </div>
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
                            boxShadow: activeStair === stair ? '0 0 10px 5px #00ffff' : 'none', // Add a glow effect
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
                            bottom: `${window.innerHeight - activeItem.y}px`,
                            left: `${activeItem.x + activeItem.width / 2}px`,
                            transform: 'translateX(-50%)',
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