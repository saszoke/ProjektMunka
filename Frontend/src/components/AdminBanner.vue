<template>
    <v-banner app color="teal accent-4" dark v-if="isLoggedIn & userSession.isAdmin">
        <div class="d-flex flex-wrap justify-center justify-md-space-around">
            <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
                <v-btn dark icon v-bind="attrs" v-on="on" class="my-2">
                <v-icon color="blue-grey darken-1">mdi-dots-vertical</v-icon>
                </v-btn>
                
            </template>

            <v-list>
                <v-list-item v-for="(item, i) in items" :key="i" class="colored">
                <v-list-item-title class="colored" style="color: rgb(48, 163, 129);">
                    <router-link class="text-decoration-none colored" style="color: rgb(48, 163, 129);" :to="{ name: `${item.componentName}`}">{{ item.title }}</router-link>
                </v-list-item-title>
                </v-list-item>
            </v-list>
            </v-menu>
            <v-btn class="ma-2" color="blue-grey darken-1" @click="home" width="50%" max-width="200" dark> Kezdooldal
            </v-btn>
            <v-btn class="ma-2" icon dark color="blue-grey darken-1">
            <v-icon dark @click="logoutAndSlide"> mdi-logout </v-icon>
            </v-btn>
        </div>
    </v-banner>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
export default {
    name: 'AdminBanner',
    components: {
    },
    data: () => ({
        items: [
            {title: 'Statisztika', route: '/dashboard', imgSrc: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg', componentName: 'Dashboard'},
            {title: 'Étlap', route: '/home/admin/foodlist', imgSrc: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg', componentName: 'FoodList'},
            {title: 'Itallap', route: '/itallap', imgSrc: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg', componentName: 'DrinkList'},
            {title: 'Szemelyzet', route: '/szemelyzet', imgSrc: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg', componentName: 'EmployeeList'},
            {title: 'Kijelentkezes', route: '/kijelentkezes', imgSrc: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg', componentName: 'Logout'},
        ],
        initialConfigurationDone: false
    }),
    methods: {
        ...mapMutations({ 
            dynamicButtonChange: 'changeDynamicButtonText',
            logout: 'logout'
        }),
        ...mapActions({chairStateChecker: 'chairsApi'}),
        logoutAndSlide(){
            this.logout()
            this.$router.replace({ path: `/`})
        },
        home(){
            this.$router.replace({ path: `/home/admin`})
        }
    },

    computed: {
        ...mapGetters({
        dynamicButtonState: 'dynamicButtonTextState',
        dynamicButtonRoute: 'dynamicButtonRouteState',
        isAdmin: 'adminLoggedIn',
        isLoggedIn: 'authenticated',
        userSession: 'userState'

        })
    },
    created(){
        if (!this.initialConfigurationDone){
        this.chairStateChecker()
        this.initialConfigurationDone = true;
        }
    }
};
</script>

<style>
.colored{
    color: rgb(48, 163, 129);
}
</style>