<template>
    <nav class="navbar navbar-dark bg-success navbar-expand-sm">
        <div class="container">
            <router-link to="/" class="navbar-brand"><i class="fa fa-mobile"></i><span class="ms-2">Ant
                    Notify</span></router-link>
            <button v-if="isLoggedIn" class="btn btn-light" @click="submitLogout">Logout</button>
        </div>
    </nav>
</template>

<script>

import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

export default {
    name: 'NavBar',

    data() {
        return {
            whichUserAbbr: ''
        }
    },

    mounted() {
        this.loadStateFromLocalStorage();
    },

    methods: {
        ...mapActions(["loadStateFromLocalStorage"]),

        submitLogout() {
            this.logout({ router: this.$router })
        },

        ...mapActions(['logout'])
    },

    computed: {
        ...mapGetters([
            'isLoggedIn',
            'whichUser'
        ]),

        formattedWhichUser() {
            let userAbbr = this.whichUser.substring(0, this.whichUser.indexOf('@'));
            return userAbbr.charAt(0);
        }
    }
}
</script>

<style scoped></style>