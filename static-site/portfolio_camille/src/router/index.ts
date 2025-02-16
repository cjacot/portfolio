import { createRouter, createWebHistory } from 'vue-router'
import Portfolio from '../components/portfolio/Portfolio.vue'
import AboutMe from '../components/portfolio/AboutMe.vue'
import ProjectDetail from '../components/ProjectDetail.vue'
import ContactForm from '../components/ContactForm.vue'
import NotFound from '../components/portfolio/NotFound.vue'

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
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound
    }
]

// Get the base URL from Vite environment variables or default to '/'
const base = import.meta.env.BASE_URL || '/'

const router = createRouter({
    // Use the base URL in history
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