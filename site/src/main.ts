import { createApp } from 'vue'
import { createRouter, createWebHashHistory, type RouteLocation } from 'vue-router'
import '@unocss/reset/tailwind.css'
import '@fontsource-variable/nunito'
import './styles/theme.css'
import './styles/slide.css'
import 'virtual:uno.css'
import App from './App.vue'
import './lib/classroom'
import { restoreRoom } from './lib/room'
import { currentCourseId } from './lib/course'
import { courseById, legacyCourse } from './lib/deck'
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
import RowCards from './anim/RowCards.vue'
import PaperTrail from './anim/PaperTrail.vue'
import FormCheck from './anim/FormCheck.vue'
import SessionTag from './anim/SessionTag.vue'
import RateDelay from './anim/RateDelay.vue'
import StickyNote from './anim/StickyNote.vue'
import GateGuard from './anim/GateGuard.vue'
import PassCard from './anim/PassCard.vue'
import Campus from './anim/Campus.vue'
import Breaker from './anim/Breaker.vue'
import LinkTables from './anim/LinkTables.vue'
import Conveyor from './anim/Conveyor.vue'
import TwoBooks from './anim/TwoBooks.vue'
import SeatRace from './anim/SeatRace.vue'
import AskOrOrder from './anim/AskOrOrder.vue'
import AspectTimeline from './anim/AspectTimeline.vue'
import Flow from './anim/Flow.vue'
import HttpExchange from './anim/HttpExchange.vue'
import IocDemo from './anim/IocDemo.vue'
import Poll from './anim/Poll.vue'
import StepCode from './anim/StepCode.vue'
import VClick from './anim/VClick.vue'
import VClicks from './anim/VClicks.vue'

const CH = ':ch(ch\\d+)'
const N = ':n(\\d+)?'
/** old single-course URLs (#/ch04/3) belong to the legacy course */
const legacy = (to: string) => (r: RouteLocation) => legacyCourse
  ? to.replace(':course', legacyCourse.id).replace(':ch', String(r.params.ch)).replace(':n', String(r.params.n || 1))
  : '/'
/** unknown course ids go back to the course picker */
const needCourse = (r: RouteLocation) => (courseById(String(r.params.course)) ? true : '/')

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: () => import('./pages/Courses.vue') },
    { path: '/join/:code/:key?', component: () => import('./pages/Join.vue') },
    // before there were several courses
    { path: `/${CH}/${N}`, redirect: legacy('/:course/:ch/:n') },
    { path: `/presenter/${CH}/${N}`, redirect: legacy('/presenter/:course/:ch/:n') },
    { path: `/print/${CH}`, redirect: legacy('/print/:course/:ch') },
    { path: `/presenter/:course/${CH}/${N}`, component: () => import('./pages/Presenter.vue'), beforeEnter: needCourse },
    { path: `/print/:course/${CH}`, component: () => import('./pages/Print.vue'), beforeEnter: needCourse },
    { path: '/:course', component: () => import('./pages/Home.vue'), beforeEnter: needCourse },
    { path: `/:course/${CH}/${N}`, component: () => import('./pages/Deck.vue'), beforeEnter: needCourse },
    { path: '/:rest(.*)*', redirect: '/' },
  ],
})
router.beforeResolve((to) => {
  const c = to.params.course
  currentCourseId.value = typeof c === 'string' && courseById(c) ? c : ''
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
  .component('RowCards', RowCards)
  .component('PaperTrail', PaperTrail)
  .component('FormCheck', FormCheck)
  .component('SessionTag', SessionTag)
  .component('RateDelay', RateDelay)
  .component('StickyNote', StickyNote)
  .component('GateGuard', GateGuard)
  .component('PassCard', PassCard)
  .component('Campus', Campus)
  .component('Breaker', Breaker)
  .component('LinkTables', LinkTables)
  .component('Conveyor', Conveyor)
  .component('TwoBooks', TwoBooks)
  .component('SeatRace', SeatRace)
  .component('AskOrOrder', AskOrOrder)
  .component('AspectTimeline', AspectTimeline)
  .mount('#app')
