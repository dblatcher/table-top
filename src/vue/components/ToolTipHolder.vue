<template>
<span class="tool-tip-holder">
      <span class="tool-tip-trigger">
            <slot>
                <span class="tool-tip-default">?</span>
            </slot>
      </span>

    <figure class="tool-tip" v-bind:style="tipStyleObject">
        <figcaption>
            <slot name="tip-content">{{content}}</slot>
        </figcaption>
        <span v-bind:style="tailStyleObject" class="tool-tip-tail"></span>
    </figure>
</span>

</template>

<script>
export default {
    props: ['content', 'color'],

    computed: {
        tipStyleObject() {
            let output = {}
            if (this.color) {output.backgroundColor = this.color}
            return output
        },
        tailStyleObject() {
            let output = {}
            if (this.color) {output.borderColor = `${this.color} transparent transparent transparent`}
            return output
        },
    },
}
</script>

<style>

  .tool-tip-holder {
    position: relative;
    margin: 0;
    display: inline;
    cursor: help;
  }

  .tool-tip-default {
    display: inline-block;
    color: black;
    border-radius: 50%;
    height: 1.2em;
    width: 1.2em;
    box-sizing: border-box;
    border: 1px solid;
    text-align: center;
    font-size: smaller;
  }

  .tool-tip {
    display: none;
    position: absolute;
    background-color: #3C7218;
    font-size: small;
    min-width: 15em;
    padding: .25em;
    border-radius: .25em;
    top: 0;
    left: 50%;
    transform: translate(-50%, -100%) translateY(-10px);
    margin: 0;
    filter: drop-shadow(1px 2px 1px black);
  }

    .tool-tip-tail {
        content: " ";
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #3C7218 transparent transparent transparent;
    }

  .tool-tip-trigger:hover+.tool-tip {
    display: unset;
  }
</style>