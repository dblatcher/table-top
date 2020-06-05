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

const normalisedSpin = function(spinValueObject) {
  return [spinValueObject.x, spinValueObject.y, spinValueObject.z].map( value => value%360 < 0 ? value%360+360 : value%360 )
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
            'position': 'absolute',
            'justify-content': 'flex-end',
            'height':`${size}px`, 
            'width': `calc(100% - ${size*placement.x}px)`,
            'padding-right': `${size*.5}px`,
            'top' :  `${size*placement.y}px`,
            'font-size': `${baseFontSize}px`,
          }
        } else {
          return {
            'position': 'relative',
            'justify-content': 'center',
            'height':`${size}px`, 
            'width': `${size}px`,
            'font-size': `${baseFontSize}px`,
          }
        }
    }
  },

  methods: {
    renderDie (forRolling) {
      const {size, sides, result, faceClass, resultFaceClass, faceContentFunction} = this.virtualDie

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
        faceContent: faceContentFunction
      })

      this.$el.appendChild(this.shape)
    },

    getFrameWidth() {
      this.$el.style.width = this.styleObject.width;
      return this.$el.clientWidth 
    },

    rollDie () {
      const{size, sides, result, resultFaceClass} = this.virtualDie;
      const scatter = 20 * (size / 75)

      let i;
      for (i=0; i< this.shape.children.length; i++) {
        this.shape.children[i].classList.remove(resultFaceClass)
      }

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
        this.shape.children[result-1].classList.add(resultFaceClass)
      })
    },

    rollDieVertically() {
      const{size, sides, result, resultFaceClass} = this.virtualDie;
      const scatter = 30 * (size / 75)

      let i;
      for (i=0; i< this.shape.children.length; i++) {
        this.shape.children[i].classList.remove(resultFaceClass)
      }
// to do - shadow effect?? circular div on the frame that grows and shrinks in time with z??
      this.shape.gradual.moveAndSpin ({
          move:{x: -10-randomInt(20), y: 0, z:400 + randomInt(50)},
          spinBy:[ randomInt(180)-90, randomInt(180)-90, randomInt(180)-90 ]
        },{duration: 40 }
      )

      .then( () => {
        this.shape.spin = normalisedSpin(this.shape.spin)
        return this.shape.gradual.moveAndSpin (
        {
          move:{x: randomInt(scatter) - scatter/2, y: randomInt(scatter/2), z:0},
          spinBy:[ randomInt(180)-90, randomInt(180)-90, randomInt(180)-90 ]
        },{duration: 30 + randomInt(10)})
      })


      .then( () => {
        this.shape.spin = normalisedSpin(this.shape.spin)

        const halfWay = [
          (resultOrientations[sides][result-1][0] - this.shape.spin.x)/2,
          (resultOrientations[sides][result-1][1] - this.shape.spin.y)/2,
          (resultOrientations[sides][result-1][2] - this.shape.spin.z)/2,
        ]

        return this.shape.gradual.moveAndSpin (
        {
          move:{x: randomInt(scatter) - scatter/2, y: randomInt(scatter/2), z:200},
          spinBy: halfWay
        },{duration: 25 + randomInt(10)})
      })

      .then( () => {
        this.shape.spin = normalisedSpin(this.shape.spin)
        return this.shape.gradual.moveAndSpin (
        {
          move:{x: 0, y: 0, z:0},
          spin:resultOrientations[sides][result-1]
        },{duration: 25 + randomInt(10)})
      })

      .then( () => {
        this.shape.children[result-1].classList.add(resultFaceClass)
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