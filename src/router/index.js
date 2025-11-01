import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import HealthCheck from '@/pages/HealthCheck.vue'
import AuthLayout from '@/pages/AuthLayout.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Profile from '@/pages/Profile.vue'
import TripsLayout from '@/pages/TripsLayout.vue'
import TripsList from '@/pages/TripsList.vue'
import CreateTrip from '@/pages/CreateTrip.vue'
import TripDetails from '@/pages/TripDetails.vue'
import EditTrip from '@/pages/EditTrip.vue'
import Applications from '@/pages/Applications.vue'
import Calendar from '@/pages/Calendar.vue'
import Chat from '@/pages/Chat.vue'
import AllTrips from '@/pages/AllTrips.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/AllTrips',
    name: 'AllTrips',
    component: 'AllTrips'
  },
  {
    path: '/health',
    name: 'Health',
    component: HealthCheck
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: Login
      },
      {
        path: 'register',
        name: 'Register',
        component: Register
      }
    ]
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/trips',
    name: 'Trips',
    component: TripsLayout,
    children: [
      {
        path: '',
        name: 'TripsList',
        component: TripsList
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
  },
  {
    path: '/applications',
    name: 'Applications',
    component: Applications
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar
  },
  {
    path: '/chat/:tripId',
    name: 'Chat',
    component: Chat
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
