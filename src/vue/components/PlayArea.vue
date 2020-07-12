<template>
  <section>


    <div class="frame main">

        <local-player-card v-if="localPlayer"
        @update-character-sheet="reportCharacterSheetUpdate"
        v-bind="{
            player: localPlayer,
            rollData: this.diceRolls[localPlayer.playerId] || null,  
            characterSheet: this.characterSheets[localPlayer.playerId] || {},  
            color:'green', 
            gm: localPlayer.playerId === config.gameMasterId
        }">
            <template v-slot:dice-control>
                <virtual-dice-control 
                @virtual-dice-roll="reportVirtualRoll" 
                @secret-dice-roll="reportSecretRoll"
                v-bind="{amGamemaster: localPlayer.playerId === config.gameMasterId}"/>
            </template>
        </local-player-card>

        <PlayerCard v-for="(player, index) in otherPlayers" v-bind:key="index"
        v-bind="{
            player, messages,
            rollData: diceRolls[player.playerId] || null,  
            characterSheet: characterSheets[player.playerId] || {},  
            color: player.playerId === config.gameMasterId ? 'blue' : 'red', 
            gm:    player.playerId === config.gameMasterId, 
        }" />

    </div>

    <div class="frame sidebar">
        <MessageBox v-bind="{messages}" @write-message="sendMessage" />
    </div>

  </section>
</template>

<script>

import PlayerCard from "./play-area/PlayerCard.vue";
import LocalPlayerCard from "./play-area/LocalPlayerCard.vue";
import MessageBox from './play-area/MessageBox.vue'
import VirtualDiceControl from './play-area/VirtualDiceControl.vue'

import {VirtualDie} from '../modules/virtualDie';
import { CharacterSheet, SheetDatum, DataGroup } from "../modules/characterSheets";
import * as makeTemplateSheet from "../modules/templateCharacterSheets.js"

export default {
    components: { MessageBox, VirtualDiceControl, PlayerCard, LocalPlayerCard},
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

        localPlayer: function() {
            return this.gameState.players.filter(player => player.playerId === this.playerId)[0]
        },

        otherPlayers: function() {
            return this.gameState.players.filter(
                player => player.playerId !== this.playerId
            )
        }

    },

    methods : {
        reportVirtualRoll(diceList) {
            this.$set(this.diceRolls, this.playerId ? this.playerId : 'none', diceList.map(virtualDie => virtualDie.clone()))
            this.messages.push({
                text:`rolled ${diceList.length} dice and got ${VirtualDie.describeCombinedValues(diceList)}.`,
                player: this.localPlayer,
                isFromSelf: true,
            })
            this.socket.emit('game-event', this.playerId, 'VIRTUAL_ROLL', diceList)
        },

        reportSecretRoll(diceList) {
            this.$set(this.diceRolls, this.playerId ? this.playerId : 'none', [])
            this.messages.push({
                text: `rolled ${diceList.length} dice behind the screen and got ${VirtualDie.describeCombinedValues(diceList)}.`,
                player: this.localPlayer,
                isFromSelf: true,
            })
            this.socket.emit('game-event', this.playerId, 'SECRET_ROLL', {number: diceList.length})
        },

        reportCharacterSheetUpdate(characterSheet) {
            this.myCharacterSheet = characterSheet
            this.socket.emit('game-event', this.playerId, 'CHARACTER_SHEET', this.myCharacterSheet)
        },

        handleGameEvent (report) {
            console.log('game event:', report)
            if (report.type === 'VIRTUAL_ROLL') {
                const deserialisedDice = report.data.map(serialisedDie => new VirtualDie(serialisedDie))
                this.messages.push  ({
                    text: `rolled ${report.data.length} dice and got ${VirtualDie.describeCombinedValues(deserialisedDice).toString()}.`,
                    player: report.player,
                })
                this.$set(this.diceRolls, report.player.playerId, deserialisedDice)
            }
            if (report.type === 'SECRET_ROLL') {
                this.messages.push  ({
                    text: `Behind the GM screen, $playerName$ rolls ${report.data.number} dice.`,
                    player: report.player
                })
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
            this.messages.push({
                text: messageText,
                player: this.localPlayer,
                isFromSelf: true,
                isTextMessage: true,
            },)
            this.socket.send(this.playerId, messageText)
        },

        handleMessage (messageData) {
            let player = this.gameState.players.filter(player => player.playerId === messageData.playerId)[0]
            this.messages.push({
                text: messageData.messageText,
                player,
                isTextMessage: true,
            })
        },
    },

    mounted() {
        this.socket.on('game-event', this.handleGameEvent );
        this.socket.on('player-message', this.handleMessage );

        const testCharacterSheet = makeTemplateSheet.blank()
        window.testCharacterSheet = testCharacterSheet
        this.$set(this.characterSheets, this.playerId, testCharacterSheet)
        this.socket.emit('game-event', this.playerId, 'PLAYER_STATUS_REQUEST', {})
    },

}
</script>

<style scoped>

    section {
        display:flex; 
        max-width:100%; 
        flex-wrap:wrap;
    }

    .main {
        display: flex;
        flex-wrap: wrap; 
        flex-basis: 40rem;
        flex-grow: 1;
    }

    .sidebar {  
        flex-basis: 10rem;
    }

</style>