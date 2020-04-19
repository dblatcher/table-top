<template>
  <div class="dice-frame" 
  v-bind:style="{'height':`${this.safeSize}em`, 'width':`${this.safeSize}em`,}"></div>
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
  props : ['sides', 'faceClass', 'size', 'result', 'resultFaceClass'],

  data() {
    return{
      shape: null,
    }
  },

  computed: {
    safeSize() {return this.size || 5},
    safeFaceClass() {return this.faceClass || 'preset-e3d-white'}
  },

  methods: {
    renderDie () {
      const {sides, safeSize, safeFaceClass, result, resultFaceClass} = this

      if (this.shape) {
        this.$el.removeChild(this.shape)
        this.shape = null;
      }

      this.shape = e3d.make[shapeTypes[sides].shape]({
      size: [safeSize * 0.6 * shapeTypes[sides].scale, safeSize * 0.075 * shapeTypes[sides].scale  ],
      units: 'em',
      spin: [0,0,0],
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
      }
  },

  mounted() {
    this.renderDie();
    this.shape.constant.turnVector.x = 1
    this.shape.constant.turnVector.y = 3
    this.shape.constant.turnVector.z = 0
    this.shape.constant.go()
  },
}
</script>

<style>
  .dice-frame {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin: 0;
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