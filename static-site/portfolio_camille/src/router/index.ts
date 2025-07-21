import { createRouter, createWebHistory } from 'vue-router'
import Portfolio from '../components/portfolio/Portfolio.vue'
import AboutMe from '../components/portfolio/AboutMe.vue'
import ProjectDetail from '../components/ProjectDetail.vue'
import ContactForm from '../components/ContactForm.vue'
import NotFound from '../components/portfolio/NotFound.vue'

// Only import admin component in development
const AdminPanel = import.meta.env.DEV 
  ? () => import('../components/admin/AdminPanel.vue')
  : null

const routes = [
    {
        path: '/',
        name: 'portfolio',
        component: Portfolio
    },
    {
        path: '/about',
        name: 'about',
        component: AboutMe
    },
    {
        path: '/contact',
        name: 'contact',
        component: ContactForm
    },
    {
        path: '/projects/:id',
        name: 'project-detail',
        component: ProjectDetail
    },
    // Development-only admin route
    ...(import.meta.env.DEV && AdminPanel ? [{
        path: '/dev-admin',
        name: 'dev-admin',
        component: AdminPanel,
        beforeEnter: (to, from, next) => {
            // Double-check we're in development
            if (import.meta.env.DEV) {
                next()
            } else {
                next('/404')
            }
        }
    }] : []),
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound
    }
]

const base = '/'

const router = createRouter({
    history: createWebHistory(base),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

// Debug des routes
router.beforeEach((to, from, next) => {
    console.log('Navigation vers:', to.path, 'avec params:', to.params)
    next()
})

export default router 