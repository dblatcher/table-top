<template>
    <div class="roll-zone">
      <E3dDice  v-for="(die, key) in displayDice"  v-bind:key="key"  v-bind="die" ref="dice"/>
      <s>{{dataString}}</s>
    </div>
</template>

<script>
import E3dDice from './E3dDice.vue'

export default {
    components: {E3dDice},

    props: ['rollData'],

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
                })
            }
            return list
        },
        dataString() {
            if (!this.rollData) return new Date().toString()
            const {diceList, results} = this.rollData
            return new Date().toString() + (diceList ? diceList.toString() : '-n-') + (results ? results.toString() : '-n-')
        }
    },

    updated() {
        if (this.$refs.dice) {
            this.$refs.dice.forEach(die => {
               die.renderDie(true)
               die.rollDie()
            } )
        }
    }


}

</script>

<style scoped>
  .roll-zone {
    height: 150px;
    position: relative;
    perspective: 75vw;
  }

  s {
    display: none;
  }
</style>