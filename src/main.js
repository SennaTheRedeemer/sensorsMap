import Vue from 'vue'
import 'leaflet/dist/leaflet.css';
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueAlertify from 'vue-alertify';
 
Vue.use(VueAlertify);
Vue.config.productionTip = false

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
   iconUrl: require('leaflet/dist/images/marker-icon.png'),
   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

new Vue({
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
