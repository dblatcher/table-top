<template>

<article style="overflow:hidden">

    <span @click="copy" >
        <slot><button class="button">{{buttonText || 'copy to clipboard'}}</button></slot>
    </span>
    <span class="success-light" v-bind:class="{show: showSuccessLight}">&#10004;</span>

    <input ref="textHolder" readonly type="text" v-bind:value="stringToCopy"/>

    <aside v-bind:class='{"modal":true, "modal--open":modalOpen}'>
      <div class="modal-content">
          <div class="close-button-holder">
              <h3>Copy failed</h3>
              <div @click="()=>{modalOpen = false}" class="close-button">X</div> 
          </div>
          <p>Reason: <em>{{failReasonString}}</em></p>
          <p>please copy from the below and paste into a text editor to save</p>
            <textarea readonly v-bind:value="stringToCopy" />
      </div>
    </aside>

</article>

</template>

<script>
export default {
    props: ["stringToCopy", "buttonText"],

    data() {
        return {
            modalOpen:false,
            failReasonString: "",
            showSuccessLight:false,
            lastTimeLightWasTurnedOn:undefined,
        }
    },

    methods: {
        copy: async function() {

            // return this.confirmFail('test fail')

            if (navigator && navigator.clipboard) {
                try {
                    await navigator.clipboard.writeText(this.stringToCopy)
                    this.confirmSuccess()
                } catch (error) {
                    this.confirmFail(error)
                }
            }
            else if (document.execCommand) {
                this.$refs.textHolder.select()
                let sucess = document.execCommand('copy')
                if (sucess) {this.confirmSuccess()}
                else {this.confirmFail('command failed')}
            }
            else {
                this.confirmFail('not supported by browser')
            }
        },
        confirmSuccess() {
            this.showSuccessLight = true
            this.lastTimeLightWasTurnedOn = Date.now()
            let triggerTime = Date.now()

            setTimeout(()=>{
                if (triggerTime === this.lastTimeLightWasTurnedOn ) {
                    this.showSuccessLight = false
                }
            },2000)
        },
        confirmFail(error) {
            let errorString = '[unknown]'
            if (typeof error === 'string') {errorString = error}
            else if (typeof error === 'object' && error.message) {errorString = error.message}
            this.failReasonString = errorString
            this.modalOpen = true
        },
    }
}
</script>

<style scoped>

    article {
        display: inline;
        overflow: hidden;
        position: relative;
        margin: 0;
    }

    input {
       opacity: 0;
       position: absolute;
       left: -10000px;
       padding: 0;
    }

    textarea {
        min-width: 20rem;
        min-height: 8rem;
    }

    .success-light {
        min-width: 1rem;
        display: inline-flex;
        font-size: smaller;
        opacity: 0;
        transition: opacity 1s;
        color: black;
        background: green;
        border: 2px solid black;
        min-height: 1rem;
        text-align: center;
        align-items: center;
        justify-content: center;
        border-radius: 50% ;
        position: absolute;
        right: -.5rem;
        top: -100%;
    }

    .success-light.show {
        opacity: 1;
    }
</style>