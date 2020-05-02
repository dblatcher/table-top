<template>
  <article>
      <p>{{question}}</p>
      <div class="button" @click="($event)=>{$emit('answer',true,request)}">yes</div>
      <div class="button" @click="($event)=>{$emit('answer',false,request)}">no</div>
  </article>
</template>

<script>
export default {
    props: ['request'],

    computed: {
        question() {
            return `Let ${this.request.player.playerName} into the game?`
        }
    }
}
</script>

<style scoped>

    article {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    p {
        margin-left: auto;
    }

</style>