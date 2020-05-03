<template>
  <article v-bind:class="`${color} card`">
      <h2>{{player.playerName}}</h2>
      <roll-zone v-bind="{rollData, size:40}"/>
  </article>
</template>

<script>

import RollZone from './RollZone.vue'

export default {
    components : {RollZone},
    props: ["player", "color","gm","local", "rollData"],
}
</script>

<style>

</style>