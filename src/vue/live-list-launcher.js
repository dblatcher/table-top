import Vue from 'vue';
import App from './LiveList.vue';

function launchLiveListApp(selector,socket) {
    let app = new Vue({
        el: selector,
        data() {
            return {socket}
        },
        render(h) { 
            return h(App, {props: {socket: this.socket}})
        },
    });
    window.vm = app.$children[0]
}

export default launchLiveListApp