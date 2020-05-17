import Vue from 'vue';
import App from './Sheets.vue';

function launchSheetApp(selector, config) {

  let app = new Vue({
      el: selector,
      data() {
          return {config}
      },
      render(h) { 
          return h(App, {props: {config:this.config}})
      },
  });
}

export default launchSheetApp