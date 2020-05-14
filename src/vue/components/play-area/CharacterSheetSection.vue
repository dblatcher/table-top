<template>
  <section>
        <h4 v-if="section.group && section.group.label"
        @click="()=>{toggleFolded()}">
            {{section.group.label}}
            <span>{{isFolded ? '  &#710;' : '  &#711;'}}</span>
        </h4>

        <transition name="fold">
        <article v-bind:class="groupClass"
        v-show="!isFolded">
          <slot>

            <div class="display-cs-group__datum-wrapper" v-for="datum in section.values" v-bind:key="datum.keyName">
                <p class="display-cs-group__datum" v-if="datum.type !=='list'">
                    <span class="display-cs-group__key">{{datum.name}}:</span> 
                    <span class="display-cs-group__value" v-bind:style="getAnimationState(datum)">{{getDisplayValue(datum)}}</span>
                </p>

                <div class="display-cs-group__list-datum" v-if="datum.type ==='list'">
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
        </transition>

  </section>
</template>

<script>
import { SheetDatum, CharacterSheet } from "../../modules/characterSheets";

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
    props: ['section'],

    data() {
        return {
            isFolded: false,
            changedValueAnimations: {},
        }
    },

    methods : {
        getDisplayValue(datum) {
            return datum.value+SheetDatum.getDisplaySuffix(datum)
        },
        toggleFolded() {
            this.isFolded = !this.isFolded
        },
        getAnimationState(datum) {
            let animationState = this.changedValueAnimations[datum.keyName]
            if (!animationState || animationState.frame < 1) { return {}}
            return {transform: `scale(${animationState.frame})`}
        }
    },

    computed: {
        keyPrefix() {return this.section.group ? this.section.group.name : '__'},
        groupClass() {
            const {group} = this.section
            if (!group) { return 'display-cs-group display-cs-group--general' }
            if (group.layout === '2-col') { return 'display-cs-group display-cs-group--two-col' }
            return 'display-cs-group'
        }
    },

    watch : {
      section: function(newSheet, oldSheet) {
        if (!oldSheet.values) {return}

        const changedValues = []
        const newKeys = []
        const valueKeys = Object.keys(newSheet.values)

        valueKeys.forEach(key => {
          if (!oldSheet.values[key] ) {
            newKeys.push(newSheet.values[key].keyName)
            return
          }

          if (newSheet.values[key].type !== 'list') {
            if (newSheet.values[key].value != oldSheet.values[key].value) {
              changedValues.push(newSheet.values[key].keyName)
              this.$set(this.changedValueAnimations, newSheet.values[key].keyName, new ChangedValueAnimation(key).start())
            }
          }

        })
      }
    }

}
</script>

<style scoped>

.fold-enter-active, .fold-leave-active {
  transition: transform .5s;
  transform-origin: top;
}
.fold-enter, .fold-leave-to {
  transform: scaleY(0);
}

</style>