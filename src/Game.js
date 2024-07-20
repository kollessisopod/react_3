import React, { useState, useEffect } from 'react';
import catasset from './assets/catasset.png';
import gifasset from './assets/gifasset.gif';
import fullmap from './assets/fullmap.png';
import { items as itemsInit, strings as stringInit, stairs, ground } from './Database';


const Game = () => {
    const [keys, setKeys] = useState({ left: false, right: false, up: false, down: false });
    const [items, setItems] = useState(itemsInit);
    const [activeAsset, setActiveAsset] = useState(catasset);
    const [isFlipped, setIsFlipped] = useState(false); // State for flipping
    const [player, setPlayer] = useState({
      x: 50,
      y: 50,
      width: 50,
      height: 50,
      velocityY: 0,
      isOnGround: false,
      directionX: 1
    });
  
    const gravity = 0.5;
    const [activeItem, setActiveItem] = useState(null);
    const [activeStair, setActiveStair] = useState(null);
    const [previousActiveStair, setPreviousActiveStair] = useState(null);
    const [previousActiveItem, setPreviousActiveItem] = useState(null);
    const [showTextbox, setShowTextbox] = useState(false); // Track the visibility of the textbox area
    const [strings, setStrings] = useState(stringInit);
    const [activeString, setActiveString] = useState(strings.stdefault);
    const [camera, setCamera] = useState({ x: 0, y: 0 });
    const originalXOffset = 500; // Original horizontal offset
    const originalYOffset = 355; // Original vertical offset
    const zoomLevel = 2;

    const scaledXOffset = originalXOffset / zoomLevel;
    const scaledYOffset = originalYOffset / zoomLevel;


    // Item and Stair Collision detection
    useEffect(() => {
      if (previousActiveStair !== activeStair) {
        if (activeStair && !previousActiveStair ) {
          console.log('Collision with a stair began:', activeStair);
        } else if (previousActiveStair && !activeStair) {
          console.log('Collision with a stair ended:', previousActiveStair);
        }
  
        setPreviousActiveStair(activeStair);
      }
  
      if (previousActiveItem !== activeItem) {
        if (activeItem && !previousActiveItem) {
          console.log('Collision with an item began:', activeItem);
          setActiveString(strings[activeItem.text]);
        } else if (previousActiveItem && !activeItem) {
          console.log('Collision with an item ended:', previousActiveItem);
          setShowTextbox(false);
        }
        setPreviousActiveItem(activeItem);
      }
    }, [activeStair, previousActiveStair, activeItem, previousActiveItem]);
  
  
  
  //Active listeners for arrow keys
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
  
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
  
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
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
  

  //Flipper
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

       if(activeItem){
        setItems((items) =>
          items.map((item) =>
            item === activeItem ? { ...item, glow: false } : item
          )
        );
        setShowTextbox(!showTextbox);
       }

        if(activeStair){
          stairs.map((stair) => {
            if (stair.stairId === activeStair.stairPointer) {
              setPlayer((player) => {
                return { ...player, x: stair.x, y: stair.y - player.height };
              });
            }
          });
        }
    }
}, [keys.e]);


//Asset change
  useEffect(() => {
    if(player.isOnGround){
      if (keys.left || keys.right) {
          setActiveAsset(gifasset);
      } else if (keys.up) {
          setActiveAsset(gifasset); // Use the same jump asset for both directions if applicable
      } else {
          setActiveAsset(catasset); // Idle asset can be the same for both directions
      }
    }
  }, [keys, player.isOnGround]);

  //Glow Effect
  useEffect(() => {
    console.log('Glowing items:', items.filter((item) => item.glow));
  }, [items.glow]);


  //Movement 
  useEffect(() => {
      const movePlayer = () => {
        setPlayer((player) => {
          let newX = player.x;
          let newY = player.y;
          let newVelocityY = player.velocityY;
          let newActiveItem = null;
          let newActiveStair = null;
          let newCameraX = camera.x;
          let newCameraY = camera.y;

          // Apply horizontal movement
          //Move Left
          if (keys.left){
            newX -= 5;
          }
          //Move Right
          if (keys.right) {
            newX += 5;
          }
          //Jump
          if (keys.up && player.isOnGround) {
            newVelocityY = -10;
          }
    
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

          newCameraX = player.x - scaledXOffset;
          newCameraY = player.y - scaledYOffset;
          setCamera({ x: newCameraX, y: newCameraY });

          return newPlayer;
        });
      };
    
      const interval = setInterval(movePlayer, 20);
      return () => clearInterval(interval);
    }, [keys, player]);

    return (
      <div
        style={{  //Game container style
          position: 'relative',
          width: '1080px',
          height: '710px',
          backgroundImage: `url(${fullmap})`,
          backgroundSize: 'cover',
          transform: `translate(${-camera.x}px, ${-camera.y}px) scale(${zoomLevel})`, // Apply zoom level
          transformOrigin: '0 0', // Ensure scaling is centered
          transition: 'transform 0.1s', // Add a transition to smooth the movement
        }}
      >
        <img    //Player style
          src={activeAsset}
          alt="Player"
          style={{
            position: 'absolute',
            left: player.x,
            top: player.y,
            width: player.width,
            height: player.height,
            directionX: player.directionX,
            transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)'
          }}
        ></img>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: item.x,
              top: item.y,
              width: item.width,
              height: item.height,
              backgroundColor: item.glow ? 'green' : 'gray'
            }}
          ></div>
        ))}
        {stairs.map((stair, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: stair.x,
              top: stair.y,
              width: stair.width,
              height: stair.height,
              backgroundColor: 'red'
            }}
          ></div>
        ))}
  
        {ground.map((ground, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: ground.x,
              top: ground.y,
              width: ground.width,
              height: ground.height,
              backgroundColor: 'brown'
            }}
          ></div>
        ))}

        {showTextbox && activeItem && (
                <div
                    style={{
                        position: 'absolute',
                        left: activeItem.x,
                        top: activeItem.y - 50, // Adjust as needed
                        width: '200px',
                        height: '100px',
                        backgroundColor: 'white',
                        border: '1px solid black',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <p>{activeString}</p>
                </div>
            )}
      </div>
    );
  };
  
  export default Game;