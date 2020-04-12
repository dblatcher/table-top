<template>
  <div>
    <p @click="roll">{{label}}</p>
  </div>
</template>

<script>
export default {
    props: ['label', 'dice'],

    computed: {
        diceList() {
            return this.dice
            .split(',')
            .map(part => part.trim())
            .filter(part => !isNaN(Number(part)))
            .map(part => Number(part))
        }
    },

    methods: {
        roll() {
            let results = this.diceList.map (number => Math.floor((Math.random() * number)+1) )
            let total = results.reduce(function(a,b){return a+b})
            let message = `rolled ${this.label} and got ${results.toString()} (total: ${total})`
            this.$emit('dice-result',{
                diceList:this.diceList, results, total, message,
            })
        }
    }
}
</script>

<style scoped>

    p {
        border: 1px solid black;
        padding: .5rem;
        margin: 1rem;
        cursor: pointer;
    }

</style>