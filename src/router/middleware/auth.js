import store from "@/store/store";
import {router} from "@/router/router";

export default ( to, next ) => {


    let requiresAuth = to.meta.requiresAuth;
    if (typeof requiresAuth === 'undefined') {
        requiresAuth = true
    }

    if (requiresAuth && !store.state.auth) {
        router.push('login');
    }

    return next();
}