import Vue from 'vue'
import App from './App.vue'
//导入路由
import router from './router'
//导入状态管理
import store from './store'
//导入插件
import './plugin'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.config.productionTip = false
//将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor )


import axios from 'axios'
axios.defaults.baseURL='http://127.0.0.1:3000/'
Vue.prototype.$http = axios




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
