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

start({
  sandbox: {
    // 当配置为 { strictStyleIsolation: true } 时表示开启严格的样式隔离模式。这种模式下 qiankun 会为每个微应用的容器包裹上一个 shadow dom 节点，从而确保微应用的样式不会对全局造成影响
    strictStyleIsolation: true,
    // qiankun 还提供了一个实验性的样式隔离特性，当 experimentalStyleIsolation 被设置为 true 时，qiankun 会改写子应用所添加的样式为所有样式规则增加一个特殊的选择器规则来限定其影响范围，因此改写后的代码会表达类似为如下结构：
    experimentalStyleIsolation: true, //
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')



/*
import { importEntry } from 'import-html-entry';

const loadEntry = async function () {
  let {
    template,
    assetPublicPath,
    execScripts,
    getExternalScripts,
    getExternalStyleSheets
  } = await importEntry('//localhost:20000')

  console.log('===template===', template);
  console.log('===assetPublicPath===', execScripts);
  console.log('===execScripts===', execScripts);
  console.log('===getExternalScripts===', getExternalScripts);
  console.log('===getExternalStyleSheets===', getExternalStyleSheets);

  execScripts(window, false).then(res => {
    console.log('execScripts===', res);
  });
}

loadEntry()
*/
