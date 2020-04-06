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
    ul {
        height: 8rem;
        overflow-y: auto;
        background-color: aquamarine;
    }
</style>