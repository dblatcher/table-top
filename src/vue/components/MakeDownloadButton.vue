<template>

    <article>

    <span v-if="worksInPresentBrowser">
        <a v-bind:href="myObjectUrl" v-bind:download="fileName || ''">
            <slot><button class="button">{{buttonText || 'download data file'}}</button></slot>
        </a>
        <slot name="after-content"></slot>
    </span>

    <span v-if="worksInPresentBrowser === false">
        <slot name="fallback-content"></slot>
    </span>
    </article>

</template>

<script>
export default {
    props: ["fileContents", "fileName", "buttonText"],

    data() {
        return {
            worksInPresentBrowser: undefined,
            myObjectUrl: null
        }
    },

    methods: {

        setUrl() {
            try {
                if (this.myObjectUrl) {
                    URL.revokeObjectURL(this.myObjectUrl)
                }
                var file = new File([this.fileContents], "file", {
                    type: "text/JSON",
                });
                this.myObjectUrl = URL.createObjectURL(file)
                this.worksInPresentBrowser = true
            } catch(err) {
                this.worksInPresentBrowser = false
                this.$emit('not-compatible')
                console.warn('MakeDownloadButton not compatible',err)
            }
        },

    },

    mounted() {
        this.setUrl()
    },

    watch: {
        fileContents(){
            if (this.worksInPresentBrowser !== false) {
                this.setUrl()
            }
        }
    },
}
</script>

<style scoped>

    article {
        display: inline;
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


</style>