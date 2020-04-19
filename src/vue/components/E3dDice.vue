<template>
  <div class="dice-frame" 
  v-bind:style="{'height':`${this.safeSize}em`, 'width':`${this.safeSize}em`,}"></div>
</template>

<script>

import * as e3d from '3d-elements'
const shapeTypes = {
  6:  {scale: 1, shape: 'TruncatedCube'},
  8:  {scale: 1.1, shape: 'Octahedron'},
  10: {scale: .8, shape: 'PentagonalTrapezohedron'},
  12: {scale: 1.2, shape: 'Dodecahedron'},
  20: {scale: 1.5, shape: 'Icosahedron'},
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

  mounted() {

    const {sides, safeSize, safeFaceClass, result, resultFaceClass} = this


    this.shape = e3d.make[shapeTypes[sides].shape]({
    size: [safeSize * 0.6 * shapeTypes[sides].scale, safeSize * 0.075 * shapeTypes[sides].scale  ],
    units: 'em',
    spin: [30,30,0],
    faceContent: function(face, faceIndex) {
            if (faceIndex < 6 || shapeTypes[sides].shape !== 'TruncatedCube') {
              const underline = numbersToUnderline.indexOf(faceIndex+1) !== -1 && sides > 6;
              face.innerHTML = `<p style="font-size: 125%; ${underline ? 'text-decoration:underline;' :''}">${faceIndex+1}</p>`
            }
            if ( faceIndex+1 === result && resultFaceClass) {
              face.classList = resultFaceClass
            } else {
              face.classList = safeFaceClass
            }
          }
    })

    this.$el.appendChild(this.shape)
    this.shape.constant.turnVector.x = 0
    this.shape.constant.turnVector.y = 0
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
    border: 1px solid black;
    margin: 1em;
  }

  .dice-frame [e3d-face] {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @keyframes example {
    from {filter: brightness(.75) } 
    to   {filter: brightness(1)}
  }

  .flash {
    animation-name: example;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }

</style>