import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/places',
      name: 'places',
      component: () => import('../views/PlacesView.vue')
    },
    {
      path: '/places/add',
      name: 'add-place',
      component: () => import('../views/AddPlaceView.vue')
    },
    {
      path: '/places/:id',
      name: 'place-detail',
      component: () => import('../views/PlaceDetailView.vue')
    },
    {
      path: '/logs',
      name: 'logs',
      component: () => import('../views/LogsView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    }
  ]
})

export default router
