import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

function isBlogger(){
  const bloggerid = localStorage.getItem('bloggerId')
  const bloggername = localStorage.getItem('bloggetName')
  if(bloggerid && bloggername)return true
  else return false
}

const routes = [
  {
    path: '/',
    redirect: {
      name: 'Index'
    },
    meta:{
      hide: true,
      name: '',
    },
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: {
      name: 'Index'
    },
    meta:{
      hide: false,
      name: '首页',
    },
    children:[
      {
        path: '/index',
        name: 'Index',
        component: ()=> import('../views/index.vue')
      }
    ]
  },
  {
    path: '/map',
    name: 'Map',
    meta:{
      hide: false,
      name: '地图',
    },
    component: ()=> import('../components/sitmap.vue'),
  },
  {
    path: '/about',
    name: 'About',
    meta:{
      hide: false,
      name: '关于',
    },
    component: ()=> import('../components/about.vue'),
  },
  {
    path: '/guestbook',
    name: 'Guestbook',
    meta:{
      hide: false,
      name: '留言',
    },
    component: ()=> import('../components/guestbook.vue'),
  },
  {
    path: '/detail',
    name: 'Detail',
    meta:{
      hide: true,
      name: '阅读正文',
    },
    component: ()=> import('../components/contentDetail.vue'),
  },
  {
    path: '/editor',
    name: 'Editor',
    meta:{
      hide: !isBlogger(),
      name: '编辑',
    },
    component: ()=> import('../components/editor.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
