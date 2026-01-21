import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import Home from '@/pages/Home.vue'
import AuthLayout from '@/pages/AuthLayout.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Profile from '@/pages/Profile.vue'
import CreateTrip from '@/pages/CreateTrip.vue'
import TripDetails from '@/pages/TripDetails.vue'
import EditTrip from '@/pages/EditTrip.vue'
import AllTrips from '@/pages/AllTrips.vue'
import TripsLayout from '@/pages/TripsLayout.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login,
        meta: { guestOnly: true }
      },
      {
        path: 'register',
        name: 'Register',
        component: Register,
        meta: { guestOnly: true }
      }
    ]
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/trips',
    name: 'Trips',
    component: TripsLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'all-trips',
        name: 'AllTrips',
        component: AllTrips
      },
      {
        path: 'create',
        name: 'CreateTrip',
        component: CreateTrip
      },
      {
        path: ':id',
        name: 'TripDetails',
        component: TripDetails
      },
      {
        path: ':id/edit',
        name: 'EditTrip',
        component: EditTrip
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const guestOnly = to.matched.some(record => record.meta.guestOnly)
  
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
    return
  }
  
  if (guestOnly && authStore.isAuthenticated) {
    next({ name: 'Home' })
    return
  }
  
  if (authStore.accessToken && !authStore.user && requiresAuth) {
    try {
      await authStore.fetchCurrentUser()
      next()
    } catch (error) {
      console.error('Failed to fetch user:', error)
      authStore.clearAuthData()
      next({ name: 'Login' })
    }
    return
  }
  
  next()
})

router.onError((error) => {
  console.error('Router error:', error)
})

export default router
