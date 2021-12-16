import LoginForm from "@/components/login/LoginForm";

export default [{
    path: '/login',
    name: 'Login',
    component: LoginForm,
    meta: {
        requiresAuth: false
    }
}]