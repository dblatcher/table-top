<template>
      <aside v-bind:class='{"modal":true, "modal--open":isOpen}'>
      <div class="modal-content">
        <div class="close-button-holder">
            <h3>New Derived Stat</h3>
            <div  @click="$emit('close')" class="stud-button stud-button--red">&times;</div> 
        </div> 

        <p>this is where the control for adding new Derived Stats will be.</p>

      </div>
    </aside>
</template>

<script>
export default {
    props: ['isOpen',],
}
</script>

<style>

</style>