<template>
  <div id="app">
    
    <h2>{{config.gameName}}</h2>

    <form v-if="!hasEnteredGame && !config.amGamemaster" 
    @submit="requestEntry" 
    class="enter-game-form">
      <input type="submit" value="go"/>
    </form>

    <div v-bind:class='{"modal":true, "modal--open":gameHasClosed}'>
      <div class="modal-content">
        <p>GAME CLOSED</p>
        <p><a href="/">return to homepage</a></p>
      </div>
    </div>

    <CloseGameButton v-if="hasEnteredGame && config.amGamemaster"  @close-game="requestGameClose"/>

    <div v-if="hasEnteredGame">

      <p>USER NAME:{{ displayName }}</p>

      <div class="roll-button-holder">
        <DiceButton @dice-result="reportRoll" dice="20" label="d20"/>
        <DiceButton @dice-result="reportRoll" dice="12,12" label="2d12"/>
        <DiceButton @dice-result="reportRoll" dice="6,6,6,6" label="4d6"/>
        <DiceButton @dice-result="reportRoll" dice="10,10,10,10,10,10,10,10" label="8d10"/>
      </div>

      <E3dDice v-bind="{sides:20, result:20, faceClass:'preset-e3d-blue'}"/> 

      <PlayersDisplay 
      v-bind:players="this.gameState.players" 
      v-bind:playerId="playerId" 
      v-bind:gameMasterId="config.gameMasterId"
      v-bind="{diceRolls: diceRolls}"
      />

      <MessageBox v-bind:messages="messages" @write-message="sendMessage" />
    </div>

  </div>
</template> 

<script>
import DiceButton from './components/DiceButton.vue'
import MessageBox from './components/MessageBox.vue'
import PlayersDisplay from './components/PlayersDisplay.vue'
import CloseGameButton from './components/CloseGameButton.vue'
import E3dDice from './components/E3dDice.vue'
import RollZone from './components/RollZone.vue'

export default {
  components: {DiceButton, MessageBox, PlayersDisplay, CloseGameButton, E3dDice, RollZone},

  props: ['config', 'socket'],

  data() {
    return {
      playerId : false,
      playerName : '',
      messages: [],
      gameState: {
        players: []
      },
      diceRolls: {},
      gameHasClosed:false,
    };
  },

  computed : {

    hasEnteredGame() {
      return !!this.playerId
    },

    displayName() {
      return this.playerName || 'NONE'
    },
  },

  methods : {

    log (input) {
      console.log('LOG:',input)
    },

    handleRollReport (report) {
      console.log('roll report:', report)
      this.messages.push  (report.player.playerName + " " + report.rollData.message)
      this.$set(this.diceRolls, report.player.playerId, report.rollData)
    },

    handleStateUpdate (response) {
      console.log('state update:', response)
      if (response.type === 'REFUSAL') {
          alert (response.message)
          return false
      }
      this.$set(this.gameState, 'players', response.players)
    },

    requestStateUpdate() {
      this.socket.emit('request-state',this.config.gameId)
    },

    reportRoll(rollData) {
      const {diceList, results, total, message} = rollData
      this.$set(this.diceRolls, this.playerId ? this.playerId : 'none', rollData)
      this.messages.push("I " + rollData.message)
      this.socket.emit('roll', this.playerId, rollData)
    },

    requestEntry(event) {

      event.preventDefault();

      if (this.playerId) {
        alert (`You are already logged in as ${this.displayName}`)
        return false
      }
      const form = event.target
      this.socket.emit('request-entry', {gameId:this.config.gameId}, this.handleRequestEntryResponse)

    },

    handleRequestEntryResponse (response) {
        console.log('request-entry response', response)
        if (response.type === 'REFUSAL') {
          alert(response.message)
          return false
        }
        this.playerName = response.playerName;
        this.playerId = response.playerId;

        this.requestStateUpdate();
    },

    sendMessage (messageText) {
      this.messages.push(`${'me'}: ${messageText}`,)
      this.socket.send(this.playerId, messageText)
    },

    handleMessage (messageData) {
      let sendingPlayer
      this.messages.push(`${messageData.playerName}: ${messageData.messageText}`,)
    },

    requestGameClose() {
      const {playerId} = this
      const {gameId} = this.config

      console.log('requesting game close...')
      this.socket.emit('gm-closing-game',{gameId, playerId})
    },

    handleGameClosing (data) {
      console.log('game closing:', data)
      this.gameHasClosed = true;
    },

  },

  mounted() {
    this.socket.on('roll', this.handleRollReport );
    this.socket.on('state-update', this.handleStateUpdate );
    this.socket.on('player-message', this.handleMessage );
    this.socket.on('game-closed', this.handleGameClosing );

    if (this.config.amGamemaster) {
      console.log('I AM THE GM')
      this.socket.emit('gm-enter-game', {
        gameMasterId: this.config.gameMasterId,
        gameId:this.config.gameId
      }, this.handleRequestEntryResponse)
    }

  }

};
</script>

<style>

  .roll-button-holder {
    display: flex;
    flex-wrap: wrap;
  }

</style>