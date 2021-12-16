import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes/routes';
import middleware from './middleware/middleware';
Vue.use(Router);

export const router = new Router({
        mode: 'history',
        routes: routes
    }
);

router.beforeEach((to, from, next) => {
    middleware(to, from, next);
})