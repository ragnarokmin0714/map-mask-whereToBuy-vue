import Vue from 'vue'; // vue-axios, axios 引入
import axios from 'axios'; // vue-axios, axios引入
import VueAxios from 'vue-axios'; // vue-axios, axios 引入
import App from './App.vue';
// import App from './AppMap.vue';
// import App from './AppMaskMap.vue';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios); // vue-axios, axios 引入

new Vue({
  render: (h) => h(App),
}).$mount('#app');
