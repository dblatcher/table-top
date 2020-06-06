<template>
    <div class="roll-zone"
    v-bind:style="styleObject">
      <E3dDice v-for="(die, index) in rollData" v-bind:key="index"  
      v-bind="{virtualDie: die, index}" 
      ref="dice"/>
      <s>{{dataString}}</s>
    </div>
</template>

<script>
import E3dDice from '../E3dDice.vue'

export default {
    components: {E3dDice},

    props: ['rollData','zoneHeight'],

    computed: {
      dataString() {
          if (!this.rollData) return new Date().toString()
          const {diceList, results} = this.rollData
          return new Date().toString() + (diceList ? diceList.toString() : '-n-') + (results ? results.toString() : '-n-')
      },

      styleObject() {
        return {
          'min-height': `${this.zoneHeight || 100}px`,
        }
      },
    },

    updated() {
        if (this.$refs.dice) {
            this.$refs.dice.forEach(die => {
               die.renderDie()
               die.rollDieVertically(600,150,true)
            } )
        }
    },
}

</script>

<style scoped>

  s {
    display: none;
  }
</style>