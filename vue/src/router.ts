import Vue from 'vue'
import Router from 'vue-router'
import Kanban from '@/views/Kanban/Kanban'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        { path: '/', component: Kanban },
    ],
})
