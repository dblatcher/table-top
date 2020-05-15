<template>
  <div v-bind="{class: holderClass}">
      <h3 @click="toggleFolded" class="title">
            {{title}}
            <span>{{isFolded ? '  &#710;' : '  &#711;'}}</span>
        </h3>
      <transition v-bind:name="transitionClass || 'fold'">
          <div v-show="!isFolded" class="holder">
            <slot></slot>
          </div>
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
        }
    }
}
</script>

<style scoped>

    .bordered .title {
        border-bottom: 3px double black; 
    }

    .bordered .holder {
        border-bottom: 3px double black; 
        border-left:  1px solid black; 
        border-right:  1px solid black; 
        padding: 5px;
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