<template>
  <div id="app">
    <header>
      <h2>{{config.gameName}}</h2>
      <E3dDice v-bind="{virtualDie: headerDie}" ref="headerDie"/>
    </header>

    <form v-if="!hasEnteredGame && !config.amGamemaster" 
    @submit="requestEntry" 
    class="enter-game-form">
      <input type="submit" value="go"/>
      <p v-if="waitingForRequestEntryResponse" >waiting for answer...</p>
    </form>

    <admin-panel v-if="hasEnteredGame && config.amGamemaster" 
    v-bind="{config, socket, playerId}"/>

    <play-area v-if="hasEnteredGame"
    v-bind="{displayName, socket, playerId, gameState, config}"/>



    <div v-bind:class='{"modal":true, "modal--open":gameHasClosed}'>
      <div class="modal-content">
        <p>GAME CLOSED</p>
        <p><a href="/">return to homepage</a></p>
      </div>
    </div>

  </div>
</template> 

<script>
import {VirtualDie} from './modules/virtualDie'

import E3dDice from './components/E3dDice.vue'
import AdminPanel from "./components/AdminPanel.vue";
import PlayArea from "./components/PlayArea.vue";

export default {
  components: {E3dDice, AdminPanel, PlayArea},

  props: ['config', 'socket'],

  data() {
    return {
      playerId : false,
      playerName : '',
      gameState: {
        players: []
      },
      gameHasClosed:false,
      headerDie: new VirtualDie({sides:20, color: 'black', content:'numeral'}),
      waitingForRequestEntryResponse: false,
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

    requestEntry(event) {
      event.preventDefault();

      if (this.playerId) {
        alert (`You are already logged in as ${this.displayName}`)
        return false
      }
      const form = event.target
      this.socket.emit('request-entry', {gameId:this.config.gameId}, this.handleRequestEntryResponse)
      this.waitingForRequestEntryResponse = true
    },

    handleRequestEntryResponse (response) {
        this.waitingForRequestEntryResponse = false
        console.log('request-entry response', response)
        if (response.type === 'REFUSAL') {
          alert(response.message)
          return false
        }
        this.playerName = response.playerName;
        this.playerId = response.playerId;

        this.requestStateUpdate();
    },


    handleGameClosing (data) {
      console.log('game closing:', data)
      this.gameHasClosed = true;
    },

  },

  mounted() {
    this.socket.on('state-update', this.handleStateUpdate );
    this.socket.on('game-closed', this.handleGameClosing );

    const headerDieControl = this.$refs.headerDie.shape.constant
    headerDieControl.turnVector.x = -1;
    headerDieControl.turnVector.y = 3;
    headerDieControl.turnVector.z = 0;
    headerDieControl.go();

    if (this.config.amGamemaster) {
      this.socket.emit('gm-enter-game', {
        gameMasterId: this.config.gameMasterId,
        gameId:this.config.gameId
      }, this.handleRequestEntryResponse)
    }
  }

};
</script>

<style>

  #app>header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: -1em;
    padding-right: 2em;
  }

  #app>header>h2 {
    margin: 0;
  }

</style>