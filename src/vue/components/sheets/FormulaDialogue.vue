<template>
      <aside v-bind:class='{"modal":true, "modal--open":isOpen}'>
      <div class="modal-content">
        <div class="close-button-holder">
            <h3>New Derived Stat</h3>
        </div> 

        <ul>
            <li @click="()=>{addExpression(null)}">[constant]</li>
            <li v-for="value in numberValues" v-bind:key="value.keyName"
            @click="()=>{addExpression(value)}"
            >
                {{value.name}} = {{value.value}}
            </li>
        </ul>

        <p>
            <span v-for="(formulaExpression, index) in expressions" v-bind:key="index">
               {{formulaExpression.displayName}}
               <input class="multiplier-input" type="number" v-model="formulaExpression.multiplier"/>
               <span v-if="index < expressions.length -1 ">&nbsp;+&nbsp;</span>
            </span> 
        </p>

        <p>
            <span v-for="(formulaExpression, index) in expressions" v-bind:key="index">
                {{formulaExpression.evaluation}}
                <span v-if="index < expressions.length -1 ">&nbsp;+&nbsp;</span>
            </span>
            <span>
                 = {{total}}
            </span>
        </p>

        <button class="button" @click="$emit('done')">DONE</button>

      </div>
    </aside>
</template>

<script>



import {DerivedStat, FormulaExpression} from "../../modules/characterSheets"

export default {
    props: ['isOpen','localCharacterSheet','stat'],


    computed: {
        numberValues() {
            return this.localCharacterSheet.values
            .filter(value => value.type === 'number')
        },
        expressions() {
            if (!this.stat || !this.stat.expressions) {return []}
            return this.stat.expressions
        },
        total() {
            if (!this.stat) {return 0}
            return this.stat.value
        }
    },

    methods: {
        addExpression(datum) {
            if (!datum) {
                this.stat.addFormulaExpression( new FormulaExpression(undefined,1,{}))
                return
            }
            this.stat.addFormulaExpression( new FormulaExpression(datum.name,1,{}))
        }
    },
}
</script>

<style>

 .multiplier-input {
    width: 3rem;
 }
</style>