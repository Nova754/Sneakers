import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Register from '@/views/Register.vue';
import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';
import Wishlist from '@/views/Wishlist.vue';
import Collection from '@/views/Collection.vue';
 
const routes = [
  { path: '/', component: Home },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.role === 'admin') {
        next();
      } else {
        alert('Accès refusé : vous n\'êtes pas autorisé à consulter cette page.');
        next('/');
      }
    },
  },
  {
    path: '/wishlist',
    component: Wishlist,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        next();
      } else {
        alert('Veuillez vous connecter pour accéder à votre liste de souhaits.');
        next('/login');
      }
    },
  }, 
  {
    path: '/collection',
    component: Collection,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        next();
      } else {
        alert('Veuillez vous connecter pour accéder à votre collection.');
        next('/login');
      }
    },
  },
];
 
const router = createRouter({
  history: createWebHistory(),
  routes,
});
 
export default router;