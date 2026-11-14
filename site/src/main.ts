import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import '@unocss/reset/tailwind.css'
import '@fontsource-variable/nunito'
import './styles/theme.css'
import './styles/slide.css'
import 'virtual:uno.css'
import App from './App.vue'
import './lib/classroom'
import { restoreRoom } from './lib/room'
import Link from './components/Link.vue'
import Mermaid from './components/Mermaid.vue'
import CodeSteps from './anim/CodeSteps.vue'
import Flow from './anim/Flow.vue'
import HttpExchange from './anim/HttpExchange.vue'
import IocDemo from './anim/IocDemo.vue'
import Poll from './anim/Poll.vue'
import StepCode from './anim/StepCode.vue'
import VClick from './anim/VClick.vue'
import VClicks from './anim/VClicks.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: () => import('./pages/Home.vue') },
    { path: '/:ch(ch\\d+)/:n(\\d+)?', component: () => import('./pages/Deck.vue') },
    { path: '/presenter/:ch(ch\\d+)/:n(\\d+)?', component: () => import('./pages/Presenter.vue') },
    { path: '/print/:ch(ch\\d+)', component: () => import('./pages/Print.vue') },
    { path: '/join/:code/:key?', component: () => import('./pages/Join.vue') },
    { path: '/:rest(.*)*', redirect: '/' },
  ],
})

restoreRoom()

createApp(App)
  .use(router)
  .component('Link', Link)
  .component('Mermaid', Mermaid)
  // animation components usable inside chapter markdown
  .component('VClicks', VClicks)
  .component('VClick', VClick)
  .component('StepCode', StepCode)
  .component('CodeSteps', CodeSteps)
  .component('Flow', Flow)
  .component('IocDemo', IocDemo)
  .component('HttpExchange', HttpExchange)
  .component('Poll', Poll)
  .mount('#app')
