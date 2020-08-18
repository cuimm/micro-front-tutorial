import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {registerMicroApps, start} from 'qiankun'
import CheckboxGroup from './components/checkboxGroup'
import ElCheckbox from 'element-ui/lib/checkbox'
import ElCheckboxGroup from 'element-ui/lib/checkbox-group'

Vue.config.productionTip = false

Vue.use(ElementUI);

registerMicroApps([
  {
    name: 'student',
    entry: '//test.weibo.com:10000',
    container: '#student',
    activeRule: '/student',
    props: {
      // 主应用需要传递给微应用的数据
      studentName: 'cuimm',
      components: {
        CheckboxGroup,
        ElCheckbox,
        ElCheckboxGroup,
      },
    }
  },{
    name: 'course',
    entry: '//test.weibo.com:20000',
    container: '#course',
    activeRule: '/course',
    props: {
      courseName: 'math',
    },
  }
])

start();

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
