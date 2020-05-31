<template>
  <section>

      <PlayersDisplay 
      v-bind:players="this.gameState.players" 
      v-bind:playerId="playerId" 
      v-bind:gameMasterId="config.gameMasterId"
      v-bind="{diceRolls, characterSheets}"
      @update-character-sheet = "reportCharacterSheetUpdate"
      />

      <div class="roll-button-holder">
        <DiceButton @dice-result="reportRoll" dice="20" label="d20"/>
        <DiceButton @dice-result="reportRoll" dice="6,6" label="2d6"/>
        <DiceButton @dice-result="reportRoll" dice="6,6,6,6" label="4d6"/>
        <DiceButton @dice-result="reportRoll" dice="12,4,8" label="d4 + d8 + d12"/>
      </div>

        <virtual-dice-control @virtual-dice-roll="reportVirtualRoll"/>

      <MessageBox v-bind:messages="messages" @write-message="sendMessage" />

  </section>
</template>

<script>
import DiceButton from './play-area/DiceButton.vue'
import PlayersDisplay from './play-area/PlayersDisplay.vue'
import MessageBox from './play-area/MessageBox.vue'
import VirtualDiceControl from './play-area/VirtualDiceControl.vue'

import { CharacterSheet, SheetDatum, DataGroup } from "../modules/characterSheets";
import * as makeTemplateSheet from "../modules/templateCharacterSheets.js"

export default {
    components: {DiceButton, PlayersDisplay, MessageBox, VirtualDiceControl},
    props: ['displayName', 'socket', 'playerId', 'gameState', 'config'],

    data() {
        return {
            diceRolls: {},
            characterSheets: {},
            messages: [],
            myCharacterSheet: null,
        }
    },

    computed : {

    },

    methods : {
        reportVirtualRoll(diceList) {
            console.log(diceList)
        },

        reportRoll(rollData) {
            const {diceList, results, total, message} = rollData
            this.$set(this.diceRolls, this.playerId ? this.playerId : 'none', rollData)
            this.messages.push("I " + rollData.message)
            this.socket.emit('game-event', this.playerId, 'ROLL', rollData)
        },

        reportCharacterSheetUpdate(characterSheet) {
            this.myCharacterSheet = characterSheet
            this.socket.emit('game-event', this.playerId, 'CHARACTER_SHEET', this.myCharacterSheet)
        },

        handleGameEvent (report) {
            console.log('game event:', report)
            if (report.type === 'ROLL') {
                this.messages.push  (report.player.playerName + " " + report.data.message)
                this.$set(this.diceRolls, report.player.playerId, report.data)
            }
            if (report.type === 'CHARACTER_SHEET' && report.data) {
                this.$set(this.characterSheets, report.player.playerId, CharacterSheet.deserialise(report.data))
            }
            if (report.type === 'PLAYER_STATUS_REQUEST') {
                if (!this.config.amGameMaster) {
                    this.socket.emit('game-event', this.playerId, 'CHARACTER_SHEET', this.myCharacterSheet)
                }
            }
        },

        sendMessage (messageText) {
            this.messages.push(`${'me'}: ${messageText}`,)
            this.socket.send(this.playerId, messageText)
        },

        handleMessage (messageData) {
            this.messages.push(`${messageData.playerName}: ${messageData.messageText}`,)
        },
    },

    mounted() {
        this.socket.on('game-event', this.handleGameEvent );
        this.socket.on('player-message', this.handleMessage );

        const testCharacterSheet = makeTemplateSheet.wrathAndGlory()
        window.testCharacterSheet = testCharacterSheet
        this.$set(this.characterSheets, this.playerId, testCharacterSheet)
        this.socket.emit('game-event', this.playerId, 'PLAYER_STATUS_REQUEST', {})
    },

}
</script>

<style>
  .roll-button-holder {
    display: flex;
    flex-wrap: wrap;
  }
</style>