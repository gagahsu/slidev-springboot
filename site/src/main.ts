import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import '@unocss/reset/tailwind.css'
import '@fontsource-variable/nunito'
import './styles/theme.css'
import './styles/slide.css'
import 'virtual:uno.css'
import App from './App.vue'
import Link from './components/Link.vue'
import Mermaid from './components/Mermaid.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: () => import('./pages/Home.vue') },
    { path: '/:ch(ch\\d+)/:n(\\d+)?', component: () => import('./pages/Deck.vue') },
    { path: '/:rest(.*)*', redirect: '/' },
  ],
})

createApp(App)
  .use(router)
  .component('Link', Link)
  .component('Mermaid', Mermaid)
  .mount('#app')
