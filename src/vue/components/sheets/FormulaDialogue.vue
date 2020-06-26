<template>
      <aside v-bind:class='{"modal":true, "modal--open":isOpen}'>
      <div class="modal-content">

        <div class="close-button-holder">
            <h3>{{stat ? stat.name : 'New Derived Stat'}}</h3>
        </div> 

        <section>
            <p v-for="(formulaExpression, index) in expressions" v-bind:key="index"
            class="expression-control">
                <span class="expression-control__operator">{{index > 0 ? `+&nbsp;`: `&nbsp;`}}</span>
                <input class="multiplier-input" type="number" v-model.number="formulaExpression.multiplier"/>

                <span class="expression-control__operator">{{formulaExpression.datumName ? `x&nbsp;` : ``}}</span>

                <select v-model="formulaExpression.datumName">
                    <option v-bind:value="false">[constant]</option>
                    <option v-for="value in numberValues" v-bind:key="value.keyName" 
                    v-bind:value="value.name">{{value.name}}</option>
                </select>


                <span class="stud-button stud-button--red" @click="()=> {removeExpression(formulaExpression)}">
                    <span>&times;</span>
                </span>
            </p> 

            <p class="expression-control">
                <span class="expression-control__add">Add expression</span>
                <span class="stud-button" @click="()=> {addExpression()}">
                    <span>+</span>
                </span>
            </p>

        </section>

        <section class="bottom-row">

            <div class="evaluation">
                <p v-for="(formulaExpression, index) in expressions" v-bind:key="index">
                    <span>{{getSignFor(formulaExpression, index)}}</span>
                    <span>{{getEvaluationFor(formulaExpression)}}</span>
                </p>
                <p class="evaluation-total">{{total}}</p>
            </div>

            <button class="button" @click="$emit('done')">DONE</button>

        </section>

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
                this.stat.addFormulaExpression( new FormulaExpression(undefined,1))
                return
            }
            this.stat.addFormulaExpression( new FormulaExpression(datum.name,1))
        },
        removeExpression(formulaExpression) {
            if (!this.stat) {return false}
            this.stat.removeFormulaExpression(formulaExpression)
        },
        getEvaluationFor(formulaExpression) {
            if (!this.stat || !this.stat.expressions) {return ""}
            return formulaExpression.evaluate(this.stat.getSheetValues())
        },
        getSignFor(formulaExpression, index) {
            if (index === 0) {return ""}
            if (formulaExpression.multiplier < 0) {return "-"}
            return "+"
        },
    },
}
</script>

<style>


 .expression-control {
    min-width: 12em;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: 0;
    min-height: 1.4em;
 }

.expression-control__operator {
    flex-basis: 1.2em;
    text-align: center;
}

 .multiplier-input {
    width: 3em;
    margin: 0 .2em;
 }

.expression-control__add {
    font-size: small;
    color: gray;
    flex-basis: 100%;
    flex-shrink: 1;
    text-align: right;
    margin-right: .2em;
}

.expression-control .stud-button {
    margin-left: auto;
}

.bottom-row {
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.evaluation {
    text-align: right;
    display: inline-block;
    font-size: smaller;
    min-width: 4rem;
    font-family: monospace
}

.evaluation p {
    margin: 0;
    display: flex;
    justify-content: flex-end;
}

.evaluation p span:last-child {
    margin-left: auto;
}

.evaluation-total {
    border-top: 1px solid black;
}

</style>