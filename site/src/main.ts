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
import Art from './anim/Art.vue'
import CodeSteps from './anim/CodeSteps.vue'
import DrinkShop from './anim/DrinkShop.vue'
import LifeIoc from './anim/LifeIoc.vue'
import Pairs from './anim/Pairs.vue'
import PickPrinter from './anim/PickPrinter.vue'
import StoreOpening from './anim/StoreOpening.vue'
import NoticeBoard from './anim/NoticeBoard.vue'
import Counter from './anim/Counter.vue'
import ShopLayout from './anim/ShopLayout.vue'
import UrlParts from './anim/UrlParts.vue'
import Dispatch from './anim/Dispatch.vue'
import CupLabel from './anim/CupLabel.vue'
import FileRoom from './anim/FileRoom.vue'
import SqlSlip from './anim/SqlSlip.vue'
import AskOrOrder from './anim/AskOrOrder.vue'
import AspectTimeline from './anim/AspectTimeline.vue'
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
  .component('Art', Art)
  .component('LifeIoc', LifeIoc)
  .component('Pairs', Pairs)
  .component('DrinkShop', DrinkShop)
  .component('PickPrinter', PickPrinter)
  .component('StoreOpening', StoreOpening)
  .component('NoticeBoard', NoticeBoard)
  .component('Counter', Counter)
  .component('ShopLayout', ShopLayout)
  .component('UrlParts', UrlParts)
  .component('Dispatch', Dispatch)
  .component('CupLabel', CupLabel)
  .component('FileRoom', FileRoom)
  .component('SqlSlip', SqlSlip)
  .component('AskOrOrder', AskOrOrder)
  .component('AspectTimeline', AspectTimeline)
  .mount('#app')
