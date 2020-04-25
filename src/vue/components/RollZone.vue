<template>
    <div class="roll-zone"
    v-bind:style="styleObject">
      <E3dDice  
      v-for="(die, key) in displayDice"  
      v-bind:key="key"  
      v-bind="die" 
      ref="dice"/>
      <s>{{dataString}}</s>
    </div>
</template>

<script>
import E3dDice from './E3dDice.vue'

export default {
    components: {E3dDice},

    props: ['rollData','size','zoneHeight'],

    computed: {
        displayDice() {
            if (!this.rollData) return []
            const {diceList, results} = this.rollData

            let list = [], i
            for (i = 0; i< diceList.length; i++) {
                list.push ({
                index: i,
                sides:diceList[i],
                result:results[i],
                size:this.size, 
                })
            }
            return list
        },

        dataString() {
            if (!this.rollData) return new Date().toString()
            const {diceList, results} = this.rollData
            return new Date().toString() + (diceList ? diceList.toString() : '-n-') + (results ? results.toString() : '-n-')
        },

        styleObject() {
          return {
            'height': `${this.zoneHeight || this.size*2 || 150}px`,
          }
        },
    },

    updated() {
        if (this.$refs.dice) {
            this.$refs.dice.forEach(die => {
               die.renderDie(true)
               die.rollDie()
            } )
        }
    },
}

</script>

<style scoped>
  .roll-zone {
    position: relative;
    perspective: 75vw;
  }

  s {
    display: none;
  }
</style>