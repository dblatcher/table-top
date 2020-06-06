<template>
  <section>

      <PlayersDisplay 
      v-bind:players="this.gameState.players" 
      v-bind:playerId="playerId" 
      v-bind:gameMasterId="config.gameMasterId"
      v-bind="{diceRolls, characterSheets}"
      @update-character-sheet = "reportCharacterSheetUpdate"
      />

      <virtual-dice-control 
      @virtual-dice-roll="reportVirtualRoll" 
      @secret-dice-roll="reportSecretRoll"
      v-bind="{amGamemaster: config.amGamemaster}"/>

      <MessageBox v-bind:messages="messages" @write-message="sendMessage" />

  </section>
</template>

<script>

import PlayersDisplay from './play-area/PlayersDisplay.vue'
import MessageBox from './play-area/MessageBox.vue'
import VirtualDiceControl from './play-area/VirtualDiceControl.vue'

import {VirtualDie} from '../modules/virtualDie';
import { CharacterSheet, SheetDatum, DataGroup } from "../modules/characterSheets";
import * as makeTemplateSheet from "../modules/templateCharacterSheets.js"

export default {
    components: {PlayersDisplay, MessageBox, VirtualDiceControl},
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
            this.$set(this.diceRolls, this.playerId ? this.playerId : 'none', diceList.map(virtualDie => virtualDie.clone()))
            this.messages.push("I rolled " + diceList.length+(" dice."))
            this.socket.emit('game-event', this.playerId, 'VIRTUAL_ROLL', diceList)
        },

        reportSecretRoll(diceList) {
            this.$set(this.diceRolls, this.playerId ? this.playerId : 'none', [])
            this.messages.push("I rolled " + diceList.length+(" dice behind the screen."))
            this.socket.emit('game-event', this.playerId, 'SECRET_ROLL', {number: diceList.length})
        },

        reportCharacterSheetUpdate(characterSheet) {
            this.myCharacterSheet = characterSheet
            this.socket.emit('game-event', this.playerId, 'CHARACTER_SHEET', this.myCharacterSheet)
        },

        handleGameEvent (report) {
            console.log('game event:', report)
            if (report.type === 'VIRTUAL_ROLL') {
                this.messages.push  (`${report.player.playerName} rolled ${report.data.length} dice.`)
                this.$set(this.diceRolls, report.player.playerId, report.data.map(serialisedDie => new VirtualDie(serialisedDie)))
            }
            if (report.type === 'SECRET_ROLL') {
                this.messages.push  (`${report.player.playerName} rolled ${report.data.number} dice behind the GM screen.`)
                this.$set(this.diceRolls, report.player.playerId, [])
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

</style>