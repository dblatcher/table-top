<template>

    <article>

        <section class="top-row">
            <form @submit="addDie" class="dice-form" ref="form">
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
                <button class="button">add</button>
                <p class="button" @click="addFavourite">favourite</p>
            </form>
        </section>

        <nav class="favourite-dice-menu"> 
            <h4>favourites</h4>
            <figure v-for="(virtualDie, index) in favourites" v-bind:key="index"
            @click="() => {handleFavouriteClick(virtualDie)}"
            class="button button--dice">
                <e3d-dice v-bind="{virtualDie, index}" ref="favourite"/> 
            </figure>
        </nav>


        <main class="roll-zone roll-zone--control">
            <div v-for="(virtualDie, index) in dice" v-bind:key="index"
            @click="removeDie(index)"
            style="cursor:not-allowed;"> 
                <e3d-dice v-bind="{virtualDie, index}" ref="dice"/> 
            </div>
            <div class="roll-button-holder">
                <button style="margin: 0 auto 0 .5em" @click="clearDice">clear all</button> 
                <button @click="()=>{rollDice(false)}">Roll</button> 
                <button v-if="amGamemaster" @click="()=>{rollDice(true)}">Roll behind screen</button> 
            </div>
        </main>

    </article>

</template>

<script>
import {VirtualDie, specialDice} from '../../modules/virtualDie'
import E3dDice from '../E3dDice.vue'
export default {

    components: {E3dDice},
    props: ['amGamemaster'],

    data() {
        const favourites = []

        favourites.push(new VirtualDie (
            Object.assign( {size:30}, specialDice['wrath'] )
        ))
        favourites.push(new VirtualDie (
            Object.assign({size:30}, specialDice['success'])
        ))


        return {
            dice : [],
            favourites,
            currentSpecialDie: '',
        }
    },

    computed: {
        supportedSideNumbers() {return VirtualDie.supportedSideNumbers},
        supportedColors() {return VirtualDie.supportedColors},
        specialDiceOptions() {return Object.keys(specialDice)},
    },

    methods: {

        getVirtualDieFromForm () {
            if (this.currentSpecialDie !== '') {
                if (!specialDice[this.currentSpecialDie]) {return false}
                return new VirtualDie(specialDice[this.currentSpecialDie])
            }
            return new VirtualDie({
                sides: Number(this.$refs.form.elements.sides.value),
                color: this.$refs.form.elements.color.value,
            })
        },

        addDie(event) {
            event.preventDefault()
            this.dice.push( this.getVirtualDieFromForm() )
        },

        handleFavouriteClick(virtualDie) {
            const clonedDie = virtualDie.clone()
            clonedDie.size = 50
            this.dice.push(clonedDie)
        },

        addFavourite () {
            const newFavourite = this.getVirtualDieFromForm()
            newFavourite.size = 30
            if (this.favourites.filter(virtualDie => 
                virtualDie.sides === newFavourite.sides && 
                virtualDie.color === newFavourite.color && 
                virtualDie.content === newFavourite.content
            )[0]) {return} 
            this.favourites.push(newFavourite)
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

        clearDice() {
            this.dice.splice(0, this.dice.length)
        },

        rollDice(behindScreen = false) {

            this.dice.forEach(virtualDie => {
                virtualDie.randomiseResult()
                virtualDie.useResultClass = true;
            })

            let description = VirtualDie.describeCombinedValues(this.dice)
            console.log(description)

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

    .top-row {
        display: flex;
        justify-content: space-between;
    }

    .favourite-dice-menu {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }

    .favourite-dice-menu h4 {
        align-self: flex-start;
        margin: 0;
    }

    .dice-form {
        padding: .25em;
        display:flex; 
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
    }

    .bottom-row {
        display: flex;
        justify-content: flex-end;
    }

    .roll-button-holder {
        display: flex;
        width: 100%;
        box-sizing: border-box;
        padding: .25em;
        margin: 0 .5em;
        position: absolute;
        bottom: 0;
        right: 0;
    }

</style>