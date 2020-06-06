<template>
  <div class="frame">
    <form @submit="addDie"
    style="display:flex;">
        <select name='sides'>
            <option v-for="(number,index) in supportedSideNumbers" v-bind:key="index" v-bind:value="number">
                d{{number}}
            </option>
        </select>
        <select name='color'>
            <option v-for="(color,index) in supportedColors" v-bind:key="index" v-bind:value="color">
                {{color}}
            </option>
        </select>
        <button>add</button>
    </form>

    <div>
        <p @click="()=>{addSpecialDie('wrath') }" class="button">Add Wrath die</p>
        <p @click="()=>{addSpecialDie('success') }" class="button">Add success die</p>
    </div>

    <div class="roll-zone roll-zone--control">
        <div v-for="(virtualDie, index) in dice" v-bind:key="index"
        @click="removeDie(index)"
        style="cursor:not-allowed;"> 
            <e3d-dice v-bind="{virtualDie, index}" ref="dice"/> 
        </div>
    </div>

    <button @click="()=>{rollDice(false)}">Roll!</button> 
    <button v-if="amGamemaster" @click="()=>{rollDice(true)}">Roll behind screen</button> 

  </div>
</template>

<script>
import {VirtualDie, specialDice} from '../../modules/virtualDie'
import E3dDice from '../E3dDice.vue'
export default {

    components: {E3dDice},
    props: ['amGamemaster'],

    data() {
        return {
            dice : [
                new VirtualDie({sides:20, color:'black'}),
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

            this.dice.push( new VirtualDie({
                sides: Number(event.target.elements.sides.value),
                color: event.target.elements.color.value,
            }))
        },

        addSpecialDie(type) {
            if (!specialDice[type]) {return false}
            this.dice.push( new VirtualDie(specialDice[type]) )
        },

        removeDie(index) {
           this.dice.splice(index,1)
           this.$nextTick( ()=>{
               this.$refs.dice.forEach(die => {die.renderDie()})
           })
        },

        rollDice(behindScreen = false) {

            this.dice.forEach(virtualDie => {
                virtualDie.randomiseResult()
                virtualDie.useResultClass = true;
            })
            
            if(behindScreen) {
                this.$emit('secret-dice-roll', this.dice)
            } else {
                this.$emit('virtual-dice-roll', this.dice)
            }
            
            this.$nextTick( ()=>{
               this.$refs.dice.forEach(die => {die.rollDie(400)})
           })
        }
    },

}
</script>


<style>


</style>