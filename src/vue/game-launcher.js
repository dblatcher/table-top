import Vue from 'vue';
import App from './GameApp.vue';

function launchGameApp(selector, config, socket) {

  let app = new Vue({
      el: selector,
      data() {
          return {socket, config}
      },
      render(h) { 
          return h(App, {props: {socket: this.socket, config:this.config}})
      },
  });
  window.vm = app.$children[0]
}

export default launchGameApp