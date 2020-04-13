import Vue from 'vue';
import App from './GameApp.vue';

let app = new Vue({
  el: '#app',
  render: h => h(App),
});

window.vm = app.$children[0]