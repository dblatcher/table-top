<template>

    <article class="roll-zone roll-zone--control">
        <form @submit="addDie" class="dice-form">
            <select name='sides' v-bind:disabled="currentSpecialDie !== ''">
                <option v-for="(number,index) in supportedSideNumbers" v-bind:key="index" v-bind:value="number">
                    d{{number}}
                </option>
            </select>
            <select name='color' v-bind:disabled="currentSpecialDie !== ''">
                <option v-for="(color,index) in supportedColors" v-bind:key="index" v-bind:value="color">
                    {{color}}
                </option>
            </select>
            <select name='special' v-model="currentSpecialDie">
                <option value="">-special dice-</option>
                <option v-for="(name,index) in specialDiceOptions" v-bind:key="index" v-bind:value="name">
                    {{name}}
                </option>
            </select>
            <button>add</button>
        </form>

        <div v-for="(virtualDie, index) in dice" v-bind:key="index"
        @click="removeDie(index)"
        style="cursor:not-allowed;"> 
            <e3d-dice v-bind="{virtualDie, index}" ref="dice"/> 
        </div>

        <div class="roll-button-holder">
            <button @click="()=>{rollDice(false)}">Roll</button> 
            <button v-if="amGamemaster" @click="()=>{rollDice(true)}">Roll behind screen</button> 
        </div>
    </article>

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
            ],
            currentSpecialDie: '',
        }
    },

    computed: {
        supportedSideNumbers() {return VirtualDie.supportedSideNumbers},
        supportedColors() {return VirtualDie.supportedColors},
        specialDiceOptions() {return Object.keys(specialDice)},
    },

    methods: {
        addDie(event) {
            event.preventDefault()

            if (this.currentSpecialDie !== '') {
                if (!specialDice[this.currentSpecialDie]) {return false}
                this.dice.push( new VirtualDie(specialDice[this.currentSpecialDie]) )
                return
            }

            this.dice.push( new VirtualDie({
                sides: Number(event.target.elements.sides.value),
                color: event.target.elements.color.value,
            }))
        },

        handleSpecialOptionChange(event) {
            console.log(event.target.value)
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

    .dice-form {
        position:absolute; 
        top:0; 
        left:0;
        width: 100%;
        max-width: 20rem;
        padding: .25em;
        display:flex; 
        flex-wrap: wrap;
        justify-content: space-between;
        box-sizing: border-box;
    }

    .roll-button-holder {
        box-sizing: border-box;
        position:absolute; 
        bottom:0; 
        right:1em;
        padding: .25em;
    }

</style>