import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home/home'
import Login from '@/pages/Login/login'
import Class from '@/pages/Fraction/fraction'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Home,
      name: 'index',
      redirect: '/home',
    },
    {path: '/home', component: Home, name: 'home'},
    {path: '/banner', component: Home, name: 'banner'},
    {path: '/fraction', component: Home, name: 'fraction'},
    {path: '/classroom', component: Home, name: 'classroom'},
    {path: '/record', component: Home, name: 'record'},
    {path: '/login', component: Login, name: 'login'},
    {path: '/class', component: Class, name: 'class'}
  ]
})
