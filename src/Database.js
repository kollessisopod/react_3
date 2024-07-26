
  export const items = [
    { x: 200, y: 310, width: 10, height: 10, glow: true, text: 'st1' },
    { x: 80, y: 650, width: 10, height: 10, glow: true, text: 'st2' },
    { x: 180, y: 650, width: 10, height: 10, glow: true, text: 'st3' },
  ];
  
  export const stairs = [
    { x: 400, y: 640, width: 10, height: 10 , stairId: 1, stairPointer: 2},
    { x: 400, y: 300, width: 10, height: 10 , stairId: 2, stairPointer: 1},
    { x: 600, y: 640, width: 10, height: 10 , stairId: 3, stairPointer: 4},
    { x: 600, y: 300, width: 10, height: 10 , stairId: 4, stairPointer: 3},
  ];
  
  export const ground = [
    { x: 0, y: 690, width: 1080, height: 20 },
    { x: 0, y: 350, width: 1080, height: 20 }
  ];

  export const strings = {
    stdefault: 'default String.',
    st1: 'This is string 1',
    st2: 'This is string 2',
    st3: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In at augue vel enim scelerisque malesuada id ' + 
    'eu eros. Phasellus at urna libero. Nullam at diam ultrices, gravida massa id, vestibulum nisi. Praesent tempus eget ' + 
    'purus in aliquam. Quisque placerat rutrum lorem ac ullamcorper. In hac habitasse platea dictumst. Ut gravida ullamcorper ' + 
    'pretium. Vestibulum sodales ante tristique volutpat pretium. Suspendisse suscipit libero in eros fermentum efficitur.',
  }