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
      <p class="warning" v-show="entryResponseRefusalMessage">{{entryResponseRefusalMessage}}</p>
    </form>

    <admin-panel v-if="hasEnteredGame && config.amGamemaster" 
    v-bind="{config, socket, playerId}"/>

    <play-area v-if="hasEnteredGame"
    v-bind="{displayName, socket, playerId, gameState, config}"/>


    <div v-bind:class='{"modal":true, "modal--open":reconnectRefusalMessage}'>
      <div class="modal-content">
        <p>Failed to reconnect:</p>
        <p class="warning">{{reconnectRefusalMessage}}</p>
        <p @click="reconnect" class="button">Try again</p>
      </div>
    </div>

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
      headerDie: new VirtualDie({sides:12, color: 'black', content:'numeral'}),
      waitingForRequestEntryResponse: false,
      entryResponseRefusalMessage: false,
      reconnectRefusalMessage: false,
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
          if (!this.gameHasClosed) {
            this.reconnectRefusalMessage = response.message
          }
          return false
      }
      this.$set(this.gameState, 'players', response.players)

      if (this.hasEnteredGame) {
        if (response.players.map(player=>player.playerId).indexOf(this.playerId) === -1) {
          this.reconnect()
        }
      }

    },

    requestStateUpdate() {
      this.socket.emit('request-state',this.config.gameId)
    },

    requestEntry(event) {
      event.preventDefault();
      this.entryResponseRefusalMessage = false;
      this.reconnectRefusalMessage = false;

      const form = event.target
      this.socket.emit('request-entry', {gameId:this.config.gameId}, this.handleRequestEntryResponse)
      this.waitingForRequestEntryResponse = true
    },

    handleRequestEntryResponse (response) {
        this.waitingForRequestEntryResponse = false
        console.log('request-entry response', response)
        if (response.type === 'REFUSAL') {
          if (!this.hasEnteredGame) {
            this.entryResponseRefusalMessage = response.message
          } else {
            this.reconnectRefusalMessage = response.message
          }
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

    reconnect () {
      const {amGamemaster, gameMasterId, gameId} = this.config
      this.reconnectRefusalMessage = false;
      if (amGamemaster) {
        this.socket.emit('gm-enter-game', {gameMasterId,gameId}, this.handleRequestEntryResponse)
        return
      }
      this.socket.emit('request-entry', {gameId}, this.handleRequestEntryResponse)
    }

  },

  mounted() {

    window.addEventListener('focus',event => {
      if(this.hasEnteredGame) {
        // if the users machine hibernates etc this is treated as a disconnect event by the server
        // when the user returns to an active game window, need to check the player still has an
        // active session for the game.
        // handleStateUpdate triggers reconnect if user hasEnteredGame but they are not listed as
        // a player in the response from requestStateUpdate
        this.requestStateUpdate();
      }
    })

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