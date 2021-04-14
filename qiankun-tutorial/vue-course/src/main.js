import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false


let vm
function render(props = {}) {

  console.log('===props===', props);

  // props是主应用传递给子应用的参数，也包括为 子应用 创建的节点信息：
  // { container: document-fragment, courseName: "math", name: "course", }
  const { container } = props;

  vm = new Vue({
    router,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app')
  // 此处，mount的挂载节点要注意：当主应用开启strictStyleIsolation时，会讲子应用包裹到shadowDom中
  // 此时，渲染模式由 render 模式 改为 container，子应用挂载节点为container.querySelector('#app')
  // container为document-fragment
}

if (!window.__POWERED_BY_QIANKUN__) {
  render()
} else {
  /*
  修改webpack publicPath，否则加载图片时404
  使用 webpack 运行时 publicPath 配置
  qiankun 将会在微应用 bootstrap 之前注入一个运行时的 publicPath 变量，你需要做的是在微应用的 entry js 的顶部添加如下代码：
  */
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

/**
 * 微应用需要在自己的入口 js (通常就是你配置的 webpack 的 entry js) 导出 bootstrap、mount、unmount 三个生命周期钩子，以供主应用在适当的时机调用
 *
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log('course app bootstrap');
}

// 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
export async function mount(props) {
  console.log('course app mount');
  render(props)
}

// 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
export async function unmount() {
  console.log('course app unmount');
  vm.$destroy()
  vm.$el.innerHTML = null
  vm = null
}

// 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
export async function update(props) {
  console.log('course app update', props);
}
