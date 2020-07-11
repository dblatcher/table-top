<template>
    <make-download-button v-bind="{ fileContents, fileName, buttonText: downloadButtonText}">

        <template v-slot:after-content>
            <tool-tip-holder v-if="downloadToolTip" v-bind="{content: downloadToolTip}"/>
        </template>

        <template v-slot:fallback-content>
            <clipboard-button v-bind="{stringToCopy: fileContents, buttonText: clipboardButtonText}"/>
            <tool-tip-holder v-if="clipboardTooltip" v-bind="{content: clipboardTooltip}"/>
        </template>

    </make-download-button>
</template>

<script>

import ToolTipHolder from "./ToolTipHolder.vue"
import ClipboardButton from "./ClipboardButton.vue"
import MakeDownloadButton from "./MakeDownloadButton.vue"

export default {
    components: {ToolTipHolder,ClipboardButton,MakeDownloadButton},
    props: ['fileContents','fileName','downloadButtonText', 'downloadToolTip','clipboardButtonText','clipboardTooltip'],
}
</script>

<style>

</style>