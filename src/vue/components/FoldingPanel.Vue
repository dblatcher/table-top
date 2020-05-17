<template>
  <div>
      <div v-if="title" @click="toggleFolded" v-bind="{class: holderClass ? holderClass + ' header' : 'header'}">
        <slot name="title"><h4 class="header__title">{{title}}</h4></slot>
        <span v-bind:class="isFolded ? 'fold-indicator fold-indicator--down' : 'fold-indicator'">{{isFolded ? '  &#711;' : '  &#710;'}}</span>
      </div>
      <transition v-bind:name="transitionClass || 'fold'">
          <div v-show="!isFolded" v-bind="{class: holderClass ? holderClass + ' holder' : 'holder'}"><slot></slot></div>
      </transition>
  </div>
</template>

<script>

export default {
    props: ["title", "holderClass", "transitionClass"],

    data() {
        return{
            isFolded: false,
        }
    },

    methods: {
        toggleFolded() {
            this.isFolded = !this.isFolded
            this.$emit('is-folded', this.isFolded)
        }
    }
}
</script>

<style scoped>

    .header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
    }

    .header__title {
        margin: 0;
    }

    .bordered.header {
        border-bottom: 3px double black; 
    }

    .bordered.holder {
        border-bottom: 3px double black; 
        border-left:  1px solid black; 
        border-right:  1px solid black; 
        padding: 5px;
    } 

    .fold-indicator {
        margin-left: auto;

    }

    .fold-indicator--down {

    }

    .fold-enter-active, .fold-leave-active {
        transition: transform .5s;
        transform-origin: top; 
    }
    .fold-enter, .fold-leave-to {
        transform: scaleY(0);
    }

    .corner-fold-enter-active, .corner-fold-leave-active {
        transition: transform .5s;
        transform-origin: left top; 
    }
    .corner-fold-enter, .corner-fold-leave-to {
        transform: scaleY(0) scaleX(0);
    }

</style>