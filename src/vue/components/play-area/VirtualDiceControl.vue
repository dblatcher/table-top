<template>
  <div class="frame">
    <form @submit="addDie"
    style="display:flex;">
        <select name='sides'>
            <option v-for="(color,index) in supportedSideNumbers" v-bind:key="index" v-bind:value="color">
                {{color}}
            </option>
        </select>
        <select name='color'>
            <option v-for="(number,index) in supportedColors" v-bind:key="index" v-bind:value="number">
                {{number}}
            </option>
        </select>
        <button>add</button>
    </form>

    <div style="display:flex; flex-wrap:wrap; min-height:60px;">
        <div v-for="(virtualDie, index) in dice" v-bind:key="index"
        @click="removeDie(index)"
        style="cursor:not-allowed;"> 
            <e3d-dice-new v-bind="{virtualDie, index}" ref="dice"/> 
        </div>
    </div>

  </div>
</template>

<script>
import {VirtualDie} from '../../modules/virtualDie'
import E3dDiceNew from '../E3dDiceNew.vue'
export default {

    components: {E3dDiceNew},

    data() {
        return {
            dice : [
                new VirtualDie({sides:20, color:'red', content:'numeral', size:150}),
                new VirtualDie({sides:6, color:'blue', size:60}),
                new VirtualDie({sides:6, color:'red', size:60}),
                new VirtualDie({sides:6, result:1, color:'green', size:60, content:'wrath and glory'}),
                new VirtualDie({sides:6, result:2, color:'green', size:60, content:'wrath and glory'}),
                new VirtualDie({sides:6, result:3, color:'green', size:60, content:'wrath and glory'}),
                new VirtualDie({sides:6, result:4, color:'green', size:60, content:'wrath and glory'}),
                new VirtualDie({sides:6, result:5, color:'green', size:60, content:'wrath and glory'}),
                new VirtualDie({sides:6, result:6, color:'green', size:60, content:'wrath and glory'}),
                new VirtualDie({sides:10, color:'black', size:60}),
            ]
        }
    },

    computed: {
        supportedSideNumbers() {return VirtualDie.supportedSideNumbers},
        supportedColors() {return VirtualDie.supportedColors}
    },

    methods: {
        addDie(event) {
            event.preventDefault()
            console.log(event.target.elements)

            this.dice.push( new VirtualDie({
                sides: Number(event.target.elements.sides.value),
                color: event.target.elements.color.value,
            }))
        },

        removeDie(index) {
           console.log('removeDie',index)
           this.dice.splice(index,1)
           this.$nextTick( ()=>{
               this.$refs.dice.forEach(die => {die.renderDie()})
           })
        }
    },

}
</script>


<style>

</style>