<template>
  <div class="dice-frame"
  v-bind:style="styleObject">
  </div>
</template>

<script>
import {resultOrientations, shapeTypes} from '../modules/virtualDie'
import * as e3d from '3d-elements'


const numbersToUnderline = [9, 6, 16, 19]

const randomInt = function (n) {
  return  1 + Math.floor(Math.random()*n)
}

export default {
  props : ['virtualDie', 'index'],

  data() {
    return{
      shape: null,
      forRolling: false,
    }
  },

  computed: {
    placement() {
      return {
        x: this.index/2, 
        y: this.index%2 ? 1 : 0
      }
    },

    styleObject() {
      const {placement,forRolling} = this;
      const {size} = this.virtualDie;
      const baseFontSize = 16 * (size / 75)

        if (forRolling) {
          return{
            'height':`${size}px`, 
            'padding-right': `${size*.5}px`,
            'width': forRolling ? `calc(100% - ${size*placement.x}px)` : `${size}px`,
            'top' :  forRolling ? `${size*placement.y}px` : 'unset',
            'justify-content': 'flex-end',
            'position': 'absolute',
            'font-size': `${baseFontSize}px`,
          }
        } else {
          return {
            'height':`${size}px`, 
            'width': `${size}px`,
            'justify-content': 'center',
            'position': 'relative',
            'font-size': `${baseFontSize}px`,
          }
        }
    }
  },

  methods: {
    renderDie (forRolling) {
      const {size, sides, result, faceClass, resultFaceClass} = this.virtualDie

      if (this.shape) {
        this.$el.removeChild(this.shape)
        this.shape = null;
      }

      this.forRolling = forRolling

      this.shape = e3d.make[shapeTypes[sides].shape]({
        size: [size * 0.6 * shapeTypes[sides].scale, size * 0.075 * shapeTypes[sides].scale  ],
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
            face.classList = faceClass
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

      const{size, sides, result} = this.virtualDie;
      const scatter = 20 * (size / 75)

      this.shape.gradual.moveAndSpin ({
          move:{x: this.shape.move.x/2, y: randomInt(scatter), z:0},
          spin:[ randomInt(6)*45, randomInt(6)*45, randomInt(6)*45 ]
        },{duration: 50 + randomInt(30)}
      )

      .then( () => {
        return this.shape.gradual.moveAndSpin (
        {
          move:{x: randomInt(scatter) - scatter/2, y: randomInt(scatter/2), z:0},
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