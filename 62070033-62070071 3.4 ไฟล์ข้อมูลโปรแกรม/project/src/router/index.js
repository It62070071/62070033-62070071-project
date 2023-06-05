import Vue from 'vue'
import VueRouter from 'vue-router'
import SignInView from '../views/Signin.vue'
import SignUpView from '../views/Signup.vue'
import MainView from '../views/Main.vue'
import HomeView from '../views/Home.vue'
import ForgotView from '../views/Forgot.vue'
import ResetView from '../views/Reset.vue'
import ProfileView from '../views/Profile.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/main/:id',
    name: 'main',
    meta: {login: true},
    component: MainView
  },
  {
    path: '/profile/:id',
    name: 'profile',
    meta: {login: true},
    component: ProfileView
  },
  {
    path: '/signin',
    name: 'signin',
    meta: {guess: true},
    component: SignInView
  },
  {
    path: '/signup',
    name: 'signup',
    meta: {guess: true},
    component: SignUpView
  },
  {
    path: '/forgotpassword',
    name: 'forgot',
    component: ForgotView
  },
  {
    path: '/reset/:token',
    name: 'reset',
    component: ResetView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
    const isLoggedIn = !!localStorage.getItem('token')

    if (to.meta.login && !isLoggedIn) {
      alert('Please login first!')
      next({ path: '/signin' })
    }

    if (to.meta.guess && isLoggedIn) {
      alert("You've already logged in")
      next({ path: '/'})
    }
  next()
})

export default router