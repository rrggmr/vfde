import auth from './auth'

export default function log( to, from, next ) {
    auth(to, next)
    addTrailingSlash(to, next)
    homePage(to, next)
}

function addTrailingSlash(to, next) {
    const slash = to.path.substr(to.path.length - 1);
    if (slash !== '/') {
        const newPath = to.path + '/'
        return next({path: newPath})
    }
}

function homePage(to, next) {
    if(to.path === '/') {
        return next({path: '/data/alerts/grouped/'})
    }
}
