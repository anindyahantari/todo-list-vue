import Vue from 'vue'
import VueRouter from 'vue-router'
import DashboardActivity from '../views/DashboardActivity.vue'
import ItemList from '../views/ItemList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: DashboardActivity
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: ItemList
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
