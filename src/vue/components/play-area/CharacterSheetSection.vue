<template>
  <section>

  <folding-panel v-bind="{title: section.group ? section.group.name : false, startFolded:true}" >
    <article v-bind:class="groupClass">
    <slot>

      <div class="display-cs-group__datum-wrapper" v-for="datum in section.values" v-bind:key="datum.keyName">
          <p class="display-cs-group__datum" v-if="!datum.isListType">
              <span class="display-cs-group__key">{{datum.name}}:</span> 
              <span class="display-cs-group__value" v-bind:style="getAnimationState(datum)">{{getDisplayValue(datum)}}</span>
          </p>

          <div class="display-cs-group__list-datum" v-if="datum.isListType">
              <p class="display-cs-group__key">{{datum.name}}:</p> 
              <ul class="display-cs-group__list">
                  <li class="display-cs-group__value display-cs-group__value--list"
                  v-for="(item, index) in datum.value" v-bind:key="index">
                      <span v-if="datum.quantity">{{datum.quantity[index]}}&nbsp;</span>
                      {{item}}
                  </li>
              </ul>
          </div>
      </div>

    </slot>
    </article>
  </folding-panel>


  </section>
</template>

<script>
import { SheetDatum, CharacterSheet } from "../../modules/characterSheets";
import FoldingPanel from "../FoldingPanel.vue";

class ChangedValueAnimation {
  constructor (keyName) {
    this.keyName = keyName,
    this.frame = 10
    this.timer = undefined
  }

  start() {
    const animation = this
    animation.timer = setInterval( function(){
      animation.frame -= 1
      if (animation.frame <= 0) { clearInterval(animation.timer) }
    }, 20)
    return this
  }
}

export default {
    components: {FoldingPanel},
    props: ['section'],

    data() {
        return {
            changedValueAnimations: {},
        }
    },

    methods : {
        getDisplayValue(datum) {
            return datum.value+SheetDatum.getDisplaySuffix(datum)
        },
        getAnimationState(datum) {
            let animationState = this.changedValueAnimations[datum.keyName]
            if (!animationState || animationState.frame < 1) { return {}}
            return {transform: `scale(${animationState.frame})`}
        }
    },

    computed: {
        keyPrefix() {return this.section.group ? this.section.group.name : '_general_'},
        groupClass() {
            const {group} = this.section
            if (!group) { return 'display-cs-group display-cs-group--general' }
            if (group.layout === '2-col') { return 'display-cs-group display-cs-group--two-col' }
            if (group.layout === 'full-width') { return 'display-cs-group display-cs-group--full-width' }
            return 'display-cs-group'
        }
    },

    watch : {
      section: function(newSheet, oldSheet) {
        if (!oldSheet.values ) {return}
        let newSheetValuesObject = {}
        newSheet.values.forEach(datum => {newSheetValuesObject[datum.keyName] = datum})

        let oldSheetValuesObject = {}
        oldSheet.values.forEach(datum => {oldSheetValuesObject[datum.keyName] = datum})

        const valueKeys = Object.keys(newSheetValuesObject)

        valueKeys.forEach(key => {
          if (!oldSheetValuesObject[key] ) {
            // TO DO - other animation for new keys ?
            this.$set(this.changedValueAnimations, key, new ChangedValueAnimation(key).start())
            return
          }

          if ( !newSheetValuesObject[key].isListType ) {
            if (newSheetValuesObject[key].value != oldSheetValuesObject[key].value) {
              this.$set(this.changedValueAnimations, key, new ChangedValueAnimation(key).start())
            }
          }

        })
      }
    }

}
</script>
