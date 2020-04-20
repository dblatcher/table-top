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

const numbersToUnderline = [9, 6, 16, 19]

export default {
  props : ['sides', 'faceClass', 'size', 'result', 'resultFaceClass', 'index'],

  data() {
    return{
      shape: null,
    }
  },

  computed: {
    safeSize() {return this.size || 75},
    safeFaceClass() {return this.faceClass || 'preset-e3d-white'},
    
    placement() {
      return {
        x: this.index/2, 
        y: this.index%2 ? 0 : 1
      }
    },

    styleObject() {
      const {safeSize, placement} = this;
      return{
        'height':`${safeSize}px`, 
        'padding-right': `${safeSize*.5}px`,
        'width': `calc(100% - ${safeSize*placement.x}px)`,
        'top' : `${safeSize*placement.y}px`
      }
    }
  },

  methods: {
    renderDie () {
      const {sides, safeSize, safeFaceClass, result, resultFaceClass, getFrameWidth} = this

      if (this.shape) {
        this.$el.removeChild(this.shape)
        this.shape = null;
      }

      this.shape = e3d.make[shapeTypes[sides].shape]({
      size: [safeSize * 0.6 * shapeTypes[sides].scale, safeSize * 0.075 * shapeTypes[sides].scale  ],
      units: 'px',
      spin: [0,0,0],
      move: [-getFrameWidth(),0,0],
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
      return this.$el.clientWidth 
    },

    rollDie () {
      this.shape.gradual.moveAndSpin (
        {
          move:{x: Math.floor(Math.random()*20)-10, y: Math.floor(Math.random()*10) },
          spin:{x:360}
        },
        {
          duration: 50 + Math.floor(Math.random()*30),
        }
      )

    }
  },

  mounted() {
    this.renderDie();
    this.rollDie()
  },

  updated() {
      this.renderDie();
      this.rollDie()
  },

}
</script>

<style>
  .dice-frame {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 0;
    box-sizing: border-box;
    position: absolute;
  }

  .dice-frame [e3d-face] {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @keyframes flash {
    from {filter: brightness(.75) } 
    to   {filter: brightness(1)}
  }

  .flash {
    animation-name: flash;
    animation-duration: .5s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }

</style>