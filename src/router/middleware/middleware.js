import auth from './auth'

export default function log( to, from, next ) {
    auth(to, next)
}