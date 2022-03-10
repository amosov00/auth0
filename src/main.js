import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import {Auth0Plugin} from "./authWrapper";
import { domain, clientId, audience } from "../auth_config.json";
import './main.scss'

Vue.config.productionTip = false


Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
});

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
