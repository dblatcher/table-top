<template>
  <div id="app">
    
    <p v-if="this.userName">USER NAME:{{ displayName }}</p>

    <form v-if="!this.userName" @submit="signIn" class="sign-in-form">
      <label for="userName">User name:</label>
      <input type="text" name="userName" />
      <input type="submit" value="go"/>
    </form>

    <p class="new-message">{{ message }}</p>

    <div class="roll-button-holder">
      <p @click="function(){roll(6)}">ROLL d6</p>
      <p @click="function(){roll(10)}">ROLL d10</p>
      <p @click="function(){roll(20)}">ROLL d20</p>
    </div>

  </div>
</template>

<script>

var io = require('../../node_modules/socket.io-client/dist/socket.io')


export default {
  data() {
    return {
      message: 'Hello World - this is a test Vue app injected into index.ejs by app.js',
      socket: io(),
      userName : undefined,
      userId : undefined
    };
  },

  computed : {
    displayName() {
      return this.userName || 'NONE'
    },

    localPlayer() {
      return {userName: this.userName, userId:this.userId}
    }
  },

  methods : {
    onRoll (input) {
      this.message = input
    },

    roll(number) {
      let result = Math.floor((Math.random() * number)+1)
      this.message = 'I ROLLED:' + result;
      this.socket.emit('roll', {number, localPlayer:this.localPlayer, result})
    },

    signIn(event) {

      event.preventDefault();

      if (this.userId) {
        alert (`You are already logged in as ${this.displayName}`)
        return false
      }

      // TO DO - SANITISE INPUT!!
      const form = event.target
      const userName = form.elements.userName.value
      this.socket.emit('sign-in', {userName}, this.handleSignInResponse)

    },

    handleSignInResponse (response) {
      console.log(response)
        if (response.type === 'REFUSAL') {
          alert (response.message)
          return false
        }
        this.userName = response.userName;
        this.userId = response.userId;
    }

  },

  mounted() {
    this.socket.on('roll', this.onRoll );
  }

};
</script>

<style>
  .new-message {
    font-size: 18px;
    font-family: 'Roboto', sans-serif;
    color: blue;
  }

  .roll-button-holder {
    display: flex;
  }

  .roll-button-holder  p {
      border: 1px solid black;
      margin: 0 1rem;
    }

</style>