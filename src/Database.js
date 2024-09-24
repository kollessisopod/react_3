import item1Asset from './assets/walkPlaceholder.gif';
import item2Asset from './assets/walkPlaceholder.gif';
import item3Asset from './assets/walkPlaceholder.gif';
import item4Asset from './assets/walkPlaceholder.gif';
import item5Asset from './assets/walkPlaceholder.gif';

    /////////////////////////////////////////////   Database.js   /////////////////////////////////////////////
    //                                                                                                       //  
    //                                                                                                       //




  //Stairs
  export const stairs = [
    { x: 400, y: 640, width: 10, height: 10 , stairId: 1, stairPointer: 2},
    { x: 400, y: 300, width: 10, height: 10 , stairId: 2, stairPointer: 1},
    { x: 600, y: 640, width: 10, height: 10 , stairId: 3, stairPointer: 4},
    { x: 600, y: 300, width: 10, height: 10 , stairId: 4, stairPointer: 3},
  ];

  //Grounds
  export const ground = [
    { x: 0, y: 690, width: 1080, height: 20 },
    { x: 0, y: 350, width: 1080, height: 20 }
  ];

  //Items
  export const items = [
    { index: 1, x: 200, y: 620, width: 30, height: 30, glow: true, assetIndex: item1Asset},
    { index: 2, x: 160, y: 310, width: 30, height: 30, glow: true, assetIndex: item3Asset},
    { index: 3, x:  80, y: 310, width: 30, height: 30, glow: true, assetIndex: item2Asset},
    { index: 4, x: 240, y: 310, width: 30, height: 30, glow: true, assetIndex: item4Asset},
    { index: 5, x: 320, y: 310, width: 30, height: 30, glow: true, assetIndex: item5Asset},
    { index: 6, x: 400, y: 620, width: 30, height: 30, glow: true, assetIndex: item5Asset},
  ];

  //Strings
  export const strings = {
    endefault: 'default String en.',
    en1: 'This is string 1 EN ',
    en2: 'This is string 2 EN',
    en3: 'String 3 be like EN, Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at augue vel enim scelerisque malesuada id ' + 
    'eu eros. Phasellus at EN urna libero. Nullam at diam ultrices, gravida massa id, vestibulum nisi. Praesent tempus eget ' + 
    'purus in aliquam. Qui ENsque placerat rutrum lorem ac ullamcorper. In hac habitasse platea dictumst. Ut gravida ullamcorper ' + 
    'pretium. Vestibulum s ENodales ante tristique volutpat pretium. Suspendisse suscipit libero in eros fermentum efficitur.',
    en4: 'This is string 4 EN',
    en5: 'This is string 5 EN',
    en6: 'This is string 6 EN',





    trdefault: 'default String tr.',
    tr1: 'This is string 1 TR ',
    tr2: 'This is string 2 TR ',
    tr3: 'String 3 be like TR , Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at augue vel enim scelerisque malesuada id ' + 
    'eu eros. Phasellus at TR  urna libero. Nullam at diam ultrices, gravida massa id, vestibulum nisi. Praesent tempus eget ' + 
    'purus in aliquam. Qui TR sque placerat rutrum lorem ac ullamcorper. In hac habitasse platea dictumst. Ut gravida ullamcorper ' + 
    'pretium. Vestibulum s TR odales ante tristique volutpat pretium. Suspendisse suscipit libero in eros fermentum efficitur.',
    tr4: 'This is string 4 TR ',
    tr5: 'This is string 5 TR ',
    tr6: 'This is string 6 TR ',

  }