<template>
  <div>
      <div class="button" @click="toggleModal">close game</div>
      <aside v-bind:class='{"modal": true, "modal--open": modalIsOpen}'>
          <section class="modal-content">
                <p>Are you sure?</p>
                <div @click="emitCloseEvent" class="button">yes, close game</div>
                <div class="button" @click="toggleModal" >no</div>
          </section>
      </aside>
  </div>
</template>

<script>
export default {

    data: function() {
        return {
            modalIsOpen: false
        }
    },

    methods: {
        toggleModal: function() {this.modalIsOpen = !this.modalIsOpen},
        emitCloseEvent: function () {
            this.modalIsOpen = false;
            this.$emit('close-game')
        } 
    }
}
</script>

<style>

</style>