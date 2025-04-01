import { createRouter, createWebHistory } from 'vue-router';
import HomePg from "./components/homePg.vue";
import ContactManager from "./views/ContactManager.vue";
import ContactSearch from "./views/ContactSearch.vue";
import AddContact from "./views/AddContact.vue";
import EditContact from "./views/EditContact.vue";
import ViewContact from "./views/ViewContact.vue";
import PageNotFound from "./views/PageNotFound.vue";
import LoginView from "./views/LoginView.vue";
import SignupView from "./views/SignupView.vue";
import ResetView from "./views/ResetView.vue";
import ResetView01 from "./views/ResetView01.vue";

import { supabase } from '@/clients/supabase';

let localUser;

// Create a router instance
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: LoginView
        },
        {
            path: '/signup',
            name: 'Signup',
            component: SignupView
        },
        {
            path: '/resetpassword',
            name: 'Resetpassword',
            component: ResetView
        },
        {
            path: '/resetpassword01',
            name: 'Resetpassword01',
            component: ResetView01
        },
        {
            path: '/',
            name: 'homePage',
            redirect: '/contacts',
            component: HomePg,
            meta: { requiresAuth: true }
        },
        {
            path: '/contacts',
            name: 'ContactManager',
            component: ContactManager,
            meta: { requiresAuth: true }
        },
        {
            path: '/search',
            name: 'ContactSearch',
            component: ContactSearch,
            meta: { requiresAuth: true }
        },
        {
            path: '/contacts/add',
            name: 'AddContact',
            component: AddContact,
            meta: { requiresAuth: true }
        },
        {
            path: '/contacts/edit/:contactId',
            name: 'EditContact',
            component: EditContact,
            meta: { requiresAuth: true }
        },
        {
            path: '/contacts/view/:contactId',
            name: 'ViewContact',
            component: ViewContact,
            meta: { requiresAuth: true }
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'PageNotFound',
            component: PageNotFound
        }
    ]
});

async function currentUser(next) {
    try {
        localUser = await supabase.auth.getSession();
        if (localUser.data.session) {
            // console.log('signin-OK');
            next();
        } else {
            console.log('not signin');
            next("/login");
        }
    } catch (error) {
        console.error(error);
        next("/login"); // Redirect to login on error as well
    }
}

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        currentUser(next);
    } else {
        next();
    }
});

export default router;