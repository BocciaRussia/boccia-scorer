import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Warmup from '../views/Warmup.vue'
import Ends from '../views/Ends.vue'
import Finish from '../views/Finish.vue'

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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
