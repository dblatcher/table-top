<template>
  <form class="storage-control__load-form" @submit.prevent="handleSubmit">
      <input @change="handleFileListChange" type="file" name="file"/>

      <p v-show="errorMessage" class="warning">{{errorMessage}}</p>
      <div class="preview"><span>{{loadedContent || '[empty]'}}</span></div>
      <button class="button" v-bind:class="{'button--disabled': !loadedContent}">load</button>
  </form>
</template>

<script>
export default {

    props: ['maxFileSize', 'importValidateFunction', 'convertToJson'],

    data() {

        const fileReader = new FileReader

        return {
            fileReader,
            loadedContent: '',
            errorMessage: '',
        }
    },

    methods: {

        handleSubmit(event) {

            if (!this.loadedContent) {
                this.errorMessage = 'no contents'
                return false
            }

            let data

            if (this.convertToJson) {
                try {
                    data = JSON.parse(this.loadedContent)
                } catch (error) {
                    this.errorMessage = "Data is not in JSON format."
                    return false
                }
            } else {
                data = this.loadedContent
            }

            if (typeof this.importValidateFunction === 'function' && !this.importValidateFunction(data)) {
                this.errorMessage = "Incorrect data"
                return false
            }

            this.$emit('submit',data)
        },

        handleFileListChange(event) {
            const fileInput = event.target
            this.errorMessage = ""

            if (fileInput.files.length === 0) {
                return false
            }
            const targetFile = fileInput.files[0]

            console.log(targetFile)

            if (this.maxFileSize && targetFile.size > Number(this.maxFileSize) ){
                this.errorMessage = 'file is too big!'
                return false
            }

            this.fileReader.readAsText(targetFile)
            this.loadedContent = ''
        },

        handleLoadEnd(event) {
            console.log('loadend', event)
            if (this.fileReader.error) {
                this.errorMessage = 'file read failed!'
                console.warn(this.fileReader.error)
                return
            }
            this.loadedContent = this.fileReader.result
        },

    },

    mounted() {
        this.fileReader.onloadend = this.handleLoadEnd
    }

}
</script>

<style scoped>


    input[type=file] {
        color: white;
    }

    .preview {
        overflow: auto;
        background-color: black;
        max-height: 5rem;
        min-height: 5rem;
    }

    .preview>span {
        color: gray;
        font-size: smaller;
        white-space: pre-line;
        font-family: monospace;
    }

</style>