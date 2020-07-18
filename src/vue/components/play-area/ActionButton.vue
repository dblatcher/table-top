<template>
  <span>
    <tool-tip-holder v-if="toolTipContent" v-bind:content="toolTipContent">
        <span @click="handleClick" class="stud-button">{{icon}}</span>
    </tool-tip-holder>
    <span @click="handleClick"  v-if="!toolTipContent" class="stud-button">{{icon}}</span>
  </span>
</template>

<script>
import ToolTipHolder from '../ToolTipHolder.vue'
export default {
    components: {ToolTipHolder},
    props: ["datum"],
    computed: {
        toolTipContent() { return this.datum.action ? this.datum.action.toolTipContent : false},
        icon() {return this.datum.action ? this.datum.action.icon : '?'}
    },
    methods: {
        handleClick() {
            this.$emit('click',this.datum)
        }
    },
}
</script>

<style>

</style>