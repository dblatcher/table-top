<template>
  <span>
    <tool-tip-holder v-if="toolTipContent" v-bind:content="toolTipContent">
        <span @click="handleClick" class="stud-button">a</span>
    </tool-tip-holder>
    <span @click="handleClick"  v-if="!toolTipContent" class="stud-button">a</span>
  </span>
</template>

<script>
import ToolTipHolder from '../ToolTipHolder.vue'
export default {
    components: {ToolTipHolder},
    props: ["datum"],
    computed: {
        toolTipContent() { return this.datum.action ? this.datum.action.toolTipContent : false}
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