const supportedSideNumbers = [4, 6, 8, 10, 12, 20]
const supportedColors = ['red','blue','green','black','white']


class FaceType  {
    constructor (config = {}) {
        this.getFaceString = config.getFaceString || function(faceIndex, sides) {
            const numbersToUnderline = [9, 6, 16, 19]
            const underline = numbersToUnderline.indexOf(faceIndex+1) !== -1 && sides > 6;
            return `<p style="font-size: ${shapeTypes[sides].fontSize * 100}%; ${underline ? 'text-decoration:underline;' :''}">${faceIndex+1}</p>`
        };
        this.supportedSideNumbers = config.supportedSideNumbers || supportedSideNumbers;
        this.getFaceValue = config.getFaceValue || function(faceIndex) {
            return [{quantity:faceIndex}]
        }
    }
}

const supportedFaceTypes = {
    number: new FaceType (),
    letter: new FaceType ({
        getFaceString: function(faceIndex, sides) {
            return `<p style="font-size: ${shapeTypes[sides].fontSize * 100}%;">${String.fromCharCode(65+faceIndex)}</p>`
        }
    }),
    numeral: new FaceType ({
        getFaceString: function(faceIndex,sides) {
            const faceStrings = ['I','II','III','IV','V','VI','VII', 'VIII', 'IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX']
            return `<p style="font-size: ${shapeTypes[sides].fontSize * 50}%;">${faceStrings[faceIndex] || '-'}</p>`
        }
    }),
    success: new FaceType ({
        getFaceString: function(faceIndex,sides) {
            const faceStrings = ['!',' ',' ','*','*','**']
            return `<p style="font-size: ${shapeTypes[sides].fontSize * 100}%;">${faceStrings[faceIndex] || '-'}</p>`
        },
        supportedSideNumbers: [6],
        getFaceValue: function(faceIndex) {
            switch (faceIndex) {
                case 1: 
                return [{quantity:1, type:'fail'}]
                case 4:
                case 5:
                return [{quantity:1, type:'success'}]
                case 6:
                return [{quantity:2, type:'success'}]
                default:
                return []
            }
        }
    }),
    wrath: new FaceType ({
        getFaceString: function(faceIndex,sides) {
            const faceStrings = ['!',' ',' ','*','*','**']
            return `<p style="font-size: ${shapeTypes[sides].fontSize * 100}%;">${faceStrings[faceIndex] || '-'}</p>`
        },
        supportedSideNumbers: [6],
        getFaceValue: function(faceIndex) {
            switch (faceIndex) {
                case 1: 
                return [{quantity:1, type:'critFail'}]
                case 4:
                case 5:
                return [{quantity:1, type:'success'}]
                case 6:
                return [{quantity:2, type:'success'}]
                default:
                return []
            }
        }
    }),
    tens: new FaceType({
        getFaceString: function(faceIndex, sides) {
            const numbersToUnderline = [9, 6, 16, 19]
            const underline = numbersToUnderline.indexOf(faceIndex+1) !== -1 && sides > 6;
            return `<p style="font-size: ${shapeTypes[sides].fontSize*.75 * 100}%; ${underline ? 'text-decoration:underline;' :''}">${faceIndex}0</p>`
        },
        getFaceValue: function(faceIndex) {
            return [{quantity:(faceIndex-1)*10}]
        }
    }),
}


class DescribedFaceValue {
    constructor (description, plural) {
        this.description = description;
        this.plural = plural
    }
}

const describedFaceValues = {
    fail: new DescribedFaceValue('failure', 'failures'),
    critFail: new DescribedFaceValue('critical failure', 'critical failures'),
    success: new DescribedFaceValue('success','successes'),
}

const resultOrientations = {
    4: [
      [60,0,0],
      [60,0,240],
      [60,0,120],
      [0,180,0],
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
        this.content = Object.keys(supportedFaceTypes).includes(config.content) ? config.content : 'number'
        this.useResultClass = !!config.useResultClass

        this.result = (config.result && config.result > 0 && config.result <= this.sides) ? config.result : this.sides
        this.size   = config.size || 50
    }

    get faceClass() { return `preset-e3d-${this.color}` }
    get resultFaceClass() { return `flash` }

    get faceContentFunction() {
        const {sides, result, faceClass, resultFaceClass, content, useResultClass} = this;

        return function(face, faceIndex) {
            if ( !(shapeTypes[sides].shape === 'TruncatedCube' && faceIndex >= 6 ) ) {
                face.innerHTML = supportedFaceTypes[content].getFaceString(faceIndex,sides)
            }
            if ( faceIndex+1 === result && useResultClass ) {
                face.classList = faceClass + " " + resultFaceClass
            } else {
                face.classList = faceClass
            }
        }
    }

    get value() {
        const {result, content} = this;
        if (typeof result !== 'number') {return undefined}

        return supportedFaceTypes[content].getFaceValue(result)
    }

    randomiseResult() {
        this.result = 1 + Math.floor(Math.random()*this.sides)
        return this.result
    }

    clone() {
        return new VirtualDie(this)
    }

    static combineValues(virtualDice) {
        let itemMap = {};
        virtualDice.forEach(die => {
            if (!die.value) {return}
            die.value.forEach(item => {
                let type = item.type || "_UNIT"
                itemMap[type] = itemMap[type] ? itemMap[type] + item.quantity : item.quantity
            })
        })

        return itemMap
    }

    static describeCombinedValues(virtualDice) {
        const itemMap = VirtualDie.combineValues(virtualDice)
        let output = [];
        if (itemMap['_UNIT']) {
            output.push (itemMap['_UNIT'].toString())
        }
        for (const type in itemMap) {
            if (type === '_UNIT') {continue}
            if (describedFaceValues[type]) {
                output.push (`${itemMap[type]} ${itemMap[type] === 1 ? describedFaceValues[type].description : describedFaceValues[type].plural}`)
                continue
            }
            output.push (`${itemMap[type]}x ${type}`)
        }
        return output
    }

    static get supportedColors() {return supportedColors}
    static get supportedSideNumbers() {return supportedSideNumbers}
    static get supportedFaceTypes() {return supportedFaceTypes}
}

const specialDice = {
    wrath : {
        color: 'red',
        sides: 6,
        content: 'wrath',
    },
    success : {
        color: 'black',
        sides: 6,
        content: 'success',
    },
    tens : {
        color: 'black',
        sides: 10,
        content: 'tens',
    },
}

export {VirtualDie, resultOrientations, shapeTypes, specialDice}