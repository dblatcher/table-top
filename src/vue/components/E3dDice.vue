<template>
  <div class="dice-frame"
  v-bind:style="styleObject">
  </div>
</template>

<script>
import {resultOrientations, shapeTypes} from '../modules/virtualDie'
import * as e3d from '3d-elements'


const randomInt = function (n) {
  return  1 + Math.floor(Math.random()*n)
}

const randomSpin = function (maxDegrees) {
  return [ randomInt(maxDegrees*2)-maxDegrees, randomInt(maxDegrees*2)-maxDegrees, randomInt(maxDegrees*2)-maxDegrees ]
}

const normaliseSpin = function(spinValueObject) {
  return [spinValueObject.x, spinValueObject.y, spinValueObject.z].map( value => value%360 < 0 ? value%360+360 : value%360 )
}

export default {
  props : ['virtualDie', 'index'],

  data() {
    return{
      shape: null,
    }
  },

  computed: {

    styleObject() {
      const {size} = this.virtualDie;
      const baseFontSize = 16 * (size / 75)

      return {
        'position': 'relative',
        'justify-content': 'center',
        'height':`${size}px`, 
        'width': `${size}px`,
        'font-size': `${baseFontSize}px`,
      }
    }
  },

  methods: {
    renderDie () {
      const {size, sides, result, faceClass, resultFaceClass, faceContentFunction} = this.virtualDie

      if (this.shape) {
        this.$el.removeChild(this.shape)
        this.shape = null;
      }

      this.shape = e3d.make[shapeTypes[sides].shape]({
        size: [size * 0.6 * shapeTypes[sides].scale, size * 0.075 * shapeTypes[sides].scale  ],
        units: 'px',
        spin: resultOrientations[sides][result-1],
        move: [0,0,0],
        faceContent: faceContentFunction
      })

      this.$el.appendChild(this.shape)
    },

    getFrameWidth() {
      this.$el.style.width = this.styleObject.width;
      return this.$el.clientWidth 
    },

    rollDie(throwHeight = 300, throwDistance = 0, jumpToStartPosition = false) {
      const{size, sides, result, resultFaceClass} = this.virtualDie;
      const e3dDie = this.shape;

      const scatter = 30 * (size / 75)
      // to do - shadow effect?? circular div on the frame that grows and shrinks in time with z??

      let i;
      for (i=0; i< e3dDie.children.length; i++) {
        e3dDie.children[i].classList.remove(resultFaceClass)
      }

      function moveToStart() {
        if (jumpToStartPosition) {
          e3dDie.move = {x: -throwDistance, y: 0, z:throwHeight}
          e3dDie.spin = randomSpin(90)
          return Promise.resolve()
        }
        return e3dDie.gradual.moveAndSpin ({
          move:{x: -throwDistance, y: 0, z:throwHeight},
          spinBy:randomSpin(90)
        },{duration: 40 })
      }


      moveToStart()
      .then( () => {
        e3dDie.spin = normaliseSpin(e3dDie.spin)
        return e3dDie.gradual.moveAndSpin (
        {
          move:{x: -throwDistance*2/3, y: randomInt(scatter/2), z:0},
          spinBy:randomSpin(360)
        },{duration: 30 + randomInt(10)})
      })
      .then( () => {
        e3dDie.spin = normaliseSpin(e3dDie.spin)
        return e3dDie.gradual.moveAndSpin (
        {
          move:{x: randomInt(scatter) - scatter/2, y: randomInt(scatter/2), z:throwHeight/2},
          spinBy:  [
            (resultOrientations[sides][result-1][0] - e3dDie.spin.x)/2,
            (resultOrientations[sides][result-1][1] - e3dDie.spin.y)/2,
            (resultOrientations[sides][result-1][2] - e3dDie.spin.z)/2,
          ]
        },{duration: 25 + randomInt(10)})
      })
      .then( () => {
        e3dDie.spin = normaliseSpin(e3dDie.spin)
        return e3dDie.gradual.moveAndSpin (
        {
          move:{x: 0, y: 0, z:0},
          spin:resultOrientations[sides][result-1]
        },{duration: 25 + randomInt(10)})
      })
      .then( () => {
        for (i=0; i< e3dDie.children.length; i++) {
          e3dDie.children[i].classList.remove(resultFaceClass)
        }
        e3dDie.children[result-1].classList.add(resultFaceClass)
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