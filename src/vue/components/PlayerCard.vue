<template>
  <article v-bind:class="`${color} card`">
      <h2>{{player.playerName}}</h2>
  </article>
</template>

<script>
export default {
    props: ["player", "color","gm","local"],
}
</script>

<style>

</style>