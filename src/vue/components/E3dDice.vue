<template>
  <div class="dice-frame"
  v-bind:style="styleObject">
  </div>
</template>

<script>

import * as e3d from '3d-elements'
const shapeTypes = {
  4:  {scale: 1.4, shape: 'Tetrahedron', fontSize:1.75},
  6:  {scale: 1, shape: 'TruncatedCube', fontSize:1.75},
  8:  {scale: 1.1, shape: 'Octahedron', fontSize:1.25},
  10: {scale: .8, shape: 'PentagonalTrapezohedron', fontSize:1.25},
  12: {scale: 1.2, shape: 'Dodecahedron', fontSize:1.25},
  20: {scale: 1.5, shape: 'Icosahedron', fontSize:1},
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

const numbersToUnderline = [9, 6, 16, 19]

const randomInt = function (n) {
  return  1 + Math.floor(Math.random()*n)
}

export default {
  props : ['sides', 'faceClass', 'size', 'result', 'resultFaceClass', 'index'],

  data() {
    return{
      shape: null,
      forRolling: false,
    }
  },

  computed: {
    safeSize() {return this.size || 75},
    safeFaceClass() {return this.faceClass || 'preset-e3d-white'},

    placement() {
      return {
        x: this.index/2, 
        y: this.index%2 ? 1 : 0
      }
    },

    styleObject() {
      const {safeSize, placement,forRolling} = this;
      const baseFontSize = 16 * (safeSize / 75)

        if (forRolling) {
          return{
            'height':`${safeSize}px`, 
            'padding-right': `${safeSize*.5}px`,
            'width': forRolling ? `calc(100% - ${safeSize*placement.x}px)` : `${safeSize}px`,
            'top' :  forRolling ? `${safeSize*placement.y}px` : 'unset',
            'justify-content': 'flex-end',
            'position': 'absolute',
            'font-size': `${baseFontSize}px`,
          }
        } else {
          return {
            'height':`${safeSize}px`, 
            'width': `${safeSize}px`,
            'justify-content': 'center',
            'position': 'relative',
            'font-size': `${baseFontSize}px`,
          }
        }
    }
  },

  methods: {
    renderDie (forRolling) {
      const {sides, safeSize, safeFaceClass, result, resultFaceClass} = this

      if (this.shape) {
        this.$el.removeChild(this.shape)
        this.shape = null;
      }

      this.forRolling = forRolling

      this.shape = e3d.make[shapeTypes[sides].shape]({
        size: [safeSize * 0.6 * shapeTypes[sides].scale, safeSize * 0.075 * shapeTypes[sides].scale  ],
        units: 'px',
        spin: forRolling ? [0,0,0] : resultOrientations[sides][result-1],
        move: forRolling ? [-this.getFrameWidth(),0,500] : [0,0,0],
        faceContent: function(face, faceIndex) {
          if (faceIndex < 6 || shapeTypes[sides].shape !== 'TruncatedCube') {
            const underline = numbersToUnderline.indexOf(faceIndex+1) !== -1 && sides > 6;
            face.innerHTML = `<p style="font-size: ${shapeTypes[sides].fontSize * 100}%; ${underline ? 'text-decoration:underline;' :''}">${faceIndex+1}</p>`
          }
          if ( faceIndex+1 === result && resultFaceClass) {
            face.classList = resultFaceClass
          } else {
            face.classList = safeFaceClass
          }
        }
      })

      this.$el.appendChild(this.shape)
    },

    getFrameWidth() {
      this.$el.style.width = this.styleObject.width;
      return this.$el.clientWidth 
    },

    rollDie () {
      const{sides, result} = this;

      this.shape.gradual.moveAndSpin ({
          move:{x: this.shape.move.x/2, y: randomInt(20), z:0},
          spin:[ randomInt(6)*45, randomInt(6)*45, randomInt(6)*45 ]
        },{duration: 50 + randomInt(30)}
      )

      .then( () => {
        return this.shape.gradual.moveAndSpin (
        {
          move:{x: randomInt(20)-10, y: randomInt(10), z:0},
          spin:resultOrientations[sides][result-1]
        },{duration: 30 + randomInt(40)})
      })

      .then( () => {
        this.shape.children[result-1].classList.add("flash")
      })
    }
  },

  mounted() {
    this.renderDie();
  },


}
</script>

<style>
  .dice-frame {
    display: flex;
    align-items: center;
    margin: 0;
    box-sizing: border-box;
  }

  .dice-frame [e3d-face] {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @keyframes flash {
    from {filter: brightness(.65) } 
    to   {filter: brightness(.9)}
  }

  .flash {
    animation-name: flash;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }

</style>