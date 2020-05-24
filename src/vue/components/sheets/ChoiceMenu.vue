<template>
  <form @submit="emitData" ref="form">
      <input v-if="hasTextInput" name="text" type="text"/>
      <select v-if="choices" name="choice">
          <option v-for="choice in choices" v-bind:key="choice" v-bind:value="choice">{{choice}}</option>
      </select>
      <span @click="emitData">
        <slot>
            <span class="default-emit-button">use</span>
        </slot>
      </span>
  </form>
</template>

<script>
export default {
    props: ["choices","hasTextInput"],

    methods: {
        emitData(event) {
            if (event) {event.preventDefault()}
            const data = this.$refs.form.elements;
            this.$emit('submit',{
                choice: data.choice ? data.choice.value : undefined, 
                text: data.text ? data.text.value : undefined,
            })
        },
    }
}
</script>

<style scoped>

    form {
        display: flex;
        align-items: center;
        padding: .25em 0;
    }

    input+select {
        margin-left: 1em;
    }

    form>span {
        cursor: pointer;
        margin-left: 1em;
    }

    .default-emit-button {
        text-align: center;
        min-width: 3em;
        display: inline-block;
        padding: 2px;
        border: 1px solid black;
    }

</style>