import React, { useState, useEffect } from 'react';
import catasset from './assets/catasset.png';
import gifasset from './assets/gifasset.gif';
import fullmap from './assets/fullmap.png';


const Game = () => {
    const [keys, setKeys] = useState({ left: false, right: false, up: false, down: false });
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
  
    const items = [
      { x: 80, y: 580, width: 50, height: 50 },
      { x: 200, y: 150, width: 20, height: 20 }
    ];
  
    const stairs = [
      { x: 330, y: 630, width: 50, height: 50 },
      { x: 400, y: 250, width: 50, height: 50 }
    ];
  
    const ground = [
      { x: 0, y: 690, width: 1080, height: 30 },
      { x: 380, y: 350, width: 300, height: 30 },
      { x: 750, y: 350, width: 320, height: 30 },
      { x: 0, y: 350, width: 320, height: 30 }
  
    ];
    const gravity = 0.5;
    const [activeItem, setActiveItem] = useState(null);
    const [activeStair, setActiveStair] = useState(null);
    const [previousActiveStair, setPreviousActiveStair] = useState(null);
    const [previousActiveItem, setPreviousActiveItem] = useState(null);
  
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
        } else if (previousActiveItem && !activeItem) {
          console.log('Collision with an item ended:', previousActiveItem);
        }
        setPreviousActiveItem(activeItem);
      }
    }, [activeStair, previousActiveStair, activeItem, previousActiveItem]);
  
  
  
  //Active listeners for arrow keys
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === 'ArrowLeft') setKeys((keys) => ({ ...keys, left: true }));
        if (e.key === 'ArrowRight') setKeys((keys) => ({ ...keys, right: true }));
        if (e.key === 'ArrowUp') setKeys((keys) => ({ ...keys, up: true }));
        if (e.key === 'ArrowDown') setKeys((keys) => ({ ...keys, down: true }));
      };
  
      const handleKeyUp = (e) => {
        if (e.key === 'ArrowLeft') setKeys((keys) => ({ ...keys, left: false }));
        if (e.key === 'ArrowRight') setKeys((keys) => ({ ...keys, right: false }));
        if (e.key === 'ArrowUp') setKeys((keys) => ({ ...keys, up: false }));
        if (e.key === 'ArrowDown') setKeys((keys) => ({ ...keys, down: false }));
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
  }, [keys]);
  
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
  
  
  useEffect(() => {
      const movePlayer = () => {
        setPlayer((player) => {
          let newX = player.x;
          let newY = player.y;
          let newVelocityY = player.velocityY;
          let newActiveItem = null;
          let newActiveStair = null;
  
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
          backgroundSize: 'cover'
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
              backgroundColor: 'green'
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
      </div>
    );
  };
  
  export default Game;