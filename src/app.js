import './plugins/flexible';
import Vue from 'vue';
import axios from 'axios';
import App from '@/app.vue';
import router from '@/router/index';
import ElementUI from 'element-ui';
import '@/directives/filters';
import './components';
import 'normalize.css';
import 'babel-polyfill';

require('es6-promise').polyfill();

axios.defaults.headers.put['Content-Type'] = 'application/json';

Vue.use(ElementUI);
// 阻止启动生成生产提示
Vue.config.productionTip = false;
const vm = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
});

Vue.use(vm);
