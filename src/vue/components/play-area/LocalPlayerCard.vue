<template>
  <article v-bind:class="`${color} card`">
      <h2>*{{player.playerName}}</h2>

      <table>
        <tr v-for="(data,name) in localCharacterSheet" v-bind:key="name">
          <td>{{name}}</td>
          <td><input @change="handleUpdate" type="text" v-model="data.value"/> {{getTextAfterInput(data)}}</td>
        </tr>
      </table>

      <roll-zone v-bind="{rollData, size:40}"/>
  </article>
</template>

<script>

import RollZone from './RollZone.vue'

export default {
    components : {RollZone},
    props: ["player", "color","gm", "rollData","characterSheet"],
    data() {
        return {
            localCharacterSheet: this.characterSheet,
        }
    },

    methods : {
        getTextAfterInput(data){
            if (data.max && data.type === 'count') { return ` / ${data.max}`}
            return '';
        },

        handleUpdate(event) {
            console.log('handleUpdate', event)
            this.$emit('update-character-sheet', this.localCharacterSheet)
        }

    },

    mounted() {
        this.$emit('update-character-sheet', this.localCharacterSheet)
    }

}
</script>

<style scoped>

  table {
    font-size: smaller;
  }

</style>