<template>
  <article v-bind:class="`${color} card`">
      <h2>{{player.playerName}}</h2>

      <table>
        <tr v-for="(data,name) in characterSheet" v-bind:key="name">
          <td>{{name}}</td>
          <td>{{displayValue(data)}}</td>
        </tr>
      </table>

      <roll-zone v-bind="{rollData, size:40}"/>
  </article>
</template>

<script>

import RollZone from './RollZone.vue'

export default {
    components : {RollZone},
    props: ["player", "color","gm","local", "rollData","characterSheet"],

    methods : {
      displayValue(data){
        if (data.max && data.type === 'count') { return `${data.value} / ${data.max}`}
        return data.value.toString();
      },
    }
}
</script>

<style scoped>

  table {
    font-size: smaller;
  }

</style>