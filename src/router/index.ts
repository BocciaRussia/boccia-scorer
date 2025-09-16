import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Warmup from '../views/Warmup.vue'
import Ends from '../views/Ends.vue'
import Finish from '../views/Finish.vue'
import Settings from '../views/Settings.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Настройка Матча',
    component: Home
  },
  {
    path: '/warmup',
    name: 'Разминка',
    component: Warmup
  },
  {
    path: '/ends',
    name: 'Энды',
    component: Ends
  },
  {
    path: '/finish',
    name: 'Финиш',
    component: Finish
  },
  {
    path: '/settings',
    name: 'Настройки программы',
    component: Settings
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
