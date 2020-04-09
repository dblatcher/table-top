import Vue from 'vue';
import App from './App.vue';

let app = new Vue({
  el: '#app',
  render: h => h(App),
});

window.app = app
window.vm = app.$children[0]