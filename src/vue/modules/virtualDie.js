const supportedSideNumbers = [4, 6, 8, 10, 12, 20]
const supportedColors = ['red','blue','yellow','green','black','white']
const supportedContent = ['number', 'letter', 'numeral','wrath and glory']

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

class VirtualDie {

    constructor (config) {
        this.sides   = supportedSideNumbers.includes(config.sides) ? config.sides : 6
        this.color   = supportedColors.includes(config.color) ? config.color : 'white'
        this.content = supportedContent.includes(config.content) ? config.content : 'number'
        this.useResultClass = !!config.useResultClass

        this.result = (config.result && config.result > 0 && config.result <= this.sides) ? config.result : this.sides
        this.size   = config.size || 60
    }

    get faceClass() { return `preset-e3d-${this.color}` }
    get resultFaceClass() { return `flash` }

    get faceContentFunction() {
        const {sides, result, faceClass, resultFaceClass, content, useResultClass} = this;
        const getFaceString = {
            'number': function(faceIndex) {
                const numbersToUnderline = [9, 6, 16, 19]
                const underline = numbersToUnderline.indexOf(faceIndex+1) !== -1 && sides > 6;
                return `<p style="font-size: ${shapeTypes[sides].fontSize * 100}%; ${underline ? 'text-decoration:underline;' :''}">${faceIndex+1}</p>`
            },
            'letter': function(faceIndex) {
                return `<p style="font-size: ${shapeTypes[sides].fontSize * 100}%;">${String.fromCharCode(65+faceIndex)}</p>`
            },
            'numeral': function(faceIndex) {
                const faceStrings = ['I','II','III','IV','V','VI','VII', 'VIII', 'IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX']
                return `<p style="font-size: ${shapeTypes[sides].fontSize * 50}%;">${faceStrings[faceIndex] || '-'}</p>`
            },
            'wrath and glory': function(faceIndex) {
                const faceStrings = ['!',' ',' ','*','*','**']
                return `<p style="font-size: ${shapeTypes[sides].fontSize * 100}%;">${faceStrings[faceIndex] || '-'}</p>`
            },
        }

        return function(face, faceIndex) {
            if ( !(shapeTypes[sides].shape === 'TruncatedCube' && faceIndex >= 6 ) ) {
                face.innerHTML = getFaceString[content](faceIndex)
            }
            if ( faceIndex+1 === result && useResultClass ) {
                face.classList = faceClass + " " + resultFaceClass
            } else {
                face.classList = faceClass
            }
        }
    }

    randomiseResult() {
        this.result = 1 + Math.floor(Math.random()*this.sides)
        return this.result
    }

    static get supportedColors() {return supportedColors}
    static get supportedSideNumbers() {return supportedSideNumbers}
    static get supportedContent() {return supportedContent}
}


export {VirtualDie, resultOrientations, shapeTypes}