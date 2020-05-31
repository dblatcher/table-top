const supportedSideNumbers = [4, 6, 8, 10, 12, 20]
const supportedColors = ['red','blue','yellow','green','black','white']

class VirtualDie {

    constructor (config) {
        this.sides  = supportedSideNumbers.includes(config.sides) ? config.sides : 6
        this.size   = config.size || 60
        this.color  = supportedColors.includes(config.color) ? config.color : 'white'
        this.result = (config.result && config.result > 0 && config.result <= this.sides) ? config.result : this.sides
    }

    get faceClass() { return `preset-e3d-${this.color}` }
    get resultFaceClass() { return `preset-e3d-${this.color} flash` }

    static get supportedColors() {return supportedColors}
    static get supportedSideNumbers() {return supportedSideNumbers}
}

const resultOrientations = {
    4: [
      [240,0,0],
      [120,0,60],
      [120,0,300],
      [0,0,0],
    ],
    6: [
      [0,0,0],
      [90,270,90],
      [270,0,0],
      [90,0,0],
      [0,90,0],
      [0,180,0],
    ],
    8: [
      [35,0,0],
      [35,270,0],
      [35,180,0],
      [35,90,0],
      [35,0,180],
      [35,270,180],
      [35,180,180],
      [35,90,180],
    ],
    10: [
      [36,0,0],
      [36,288,0],
      [36,216,0],
      [36,144,0],
      [36,72,0],
      [36,252,180],
      [36,180,180],
      [36,180,180],
      [36,108,180],
      [36,36,180],
    ],
    12: [
      [0,0,0],
      [60,210,20],
      [60,145,340],
      [280,0,180],
      [114,180,144],
      [114,180,214],
      [114,180,72],
      [290,0,110],
      [64,210,230],
      [230,25,25],
      [60,144,124],
      [0,180,100],
    ],
    20: [
      [0,0,0],
      [330,0,180],
      [330,0,60],
      [324,0,300],
      [290, 35, 260],
      [300, 324, 0],
      [290, 35, 370],
      [312, 324, 120],
      [290, 35, 140],
      [300, 324, 228],
      [0,180,180],
      [335,180,0],
      [156,0,300],
      [320, 180, 240],
      [120, 324, 108],
      [120, 36, 12],
      [305, 215, 176],
      [120, 36, 252],
      [305,215,55],
      [120, 36, 132],
    ],
  }

const shapeTypes = {
    4:  {scale: 1.4, shape: 'Tetrahedron', fontSize:1.75},
    6:  {scale: 1, shape: 'TruncatedCube', fontSize:1.75},
    8:  {scale: 1.1, shape: 'Octahedron', fontSize:1.25},
    10: {scale: .8, shape: 'PentagonalTrapezohedron', fontSize:1.25},
    12: {scale: 1.2, shape: 'Dodecahedron', fontSize:1.25},
    20: {scale: 1.5, shape: 'Icosahedron', fontSize:1},
} 

export {VirtualDie, resultOrientations, shapeTypes}