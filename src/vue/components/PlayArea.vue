<template>
  <section>
      <p>USER NAME:{{ displayName }}</p>

      <div class="roll-button-holder">
        <DiceButton @dice-result="reportRoll" dice="20" label="d20"/>
        <DiceButton @dice-result="reportRoll" dice="6,6" label="2d6"/>
        <DiceButton @dice-result="reportRoll" dice="4,4,4" label="3d4"/>
      </div>

      <PlayersDisplay 
      v-bind:players="this.gameState.players" 
      v-bind:playerId="playerId" 
      v-bind:gameMasterId="config.gameMasterId"
      v-bind="{diceRolls, characterSheets}"
      @update-character-sheet = "reportCharacterSheetUpdate"
      />

      <MessageBox v-bind:messages="messages" @write-message="sendMessage" />

  </section>
</template>

<script>
import DiceButton from './play-area/DiceButton.vue'
import PlayersDisplay from './play-area/PlayersDisplay.vue'
import MessageBox from './play-area/MessageBox.vue'

export default {
    components: {DiceButton, PlayersDisplay, MessageBox},
    props: ['displayName', 'socket', 'playerId', 'gameState', 'config'],

    data() {
        return {
            diceRolls: {},
            characterSheets: {},
            messages: [],
        }
    },

    computed : {

    },

    methods : {
        reportRoll(rollData) {
            const {diceList, results, total, message} = rollData
            this.$set(this.diceRolls, this.playerId ? this.playerId : 'none', rollData)
            this.messages.push("I " + rollData.message)
            this.socket.emit('game-event', this.playerId, 'ROLL', rollData)
        },

        reportCharacterSheetUpdate(characterSheet) {
            this.socket.emit('game-event', this.playerId, 'CHARACTER_SHEET', characterSheet)
        },

        handleGameEvent (report) {
            console.log('game event:', report)
            if (report.type === 'ROLL') {
                this.messages.push  (report.player.playerName + " " + report.data.message)
                this.$set(this.diceRolls, report.player.playerId, report.data)
            }
            if (report.type === 'CHARACTER_SHEET') {
                this.$set(this.characterSheets, report.player.playerId, report.data)
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

        const testCharacterSheet = {
            "hp": {value:Math.floor(Math.random() * 10), max:10, type:'count'},
            "status": {value: "normal", type:'condition'},
        }

        this.$set(this.characterSheets, this.playerId, testCharacterSheet)

    },

}
</script>

<style>
  .roll-button-holder {
    display: flex;
    flex-wrap: wrap;
  }
</style>