<template>
  <form @submit="handleSubmit">
      <select name="choice">
          <option v-for="choice in templateChoices" v-bind:key="choice" v-bind:value="choice">{{choice}}</option>
      </select>
      <input type="submit" value="use"/>
  </form>
</template>

<script>
export default {
    props: ["templateChoices"],

    methods: {
        handleSubmit(event) {
            event.preventDefault();
            const form = event.target;
            this.$emit('submit',form.elements.choice.value)
        }
    }
}
</script>

<style>

</style>