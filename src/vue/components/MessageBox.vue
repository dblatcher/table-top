<template>
  <section>
      <ul>
        <li v-for="(message, index) in messages" v-bind:key="index">{{message}}</li>
      </ul>
  </section>
</template>

<script>
export default {
    props: ['messages']
}
</script>

<style scoped>

    section {
        border: 3px double black;
        background-color: lightslategray;
    }

    ul {
        height: 8rem;
        overflow-y: auto;
    }
</style>