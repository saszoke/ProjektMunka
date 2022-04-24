<template>
    <v-banner app color="teal accent-4" dark v-if="isLoggedIn & !userSession.isAdmin">
        <div class="d-flex flex-wrap justify-center justify-md-space-around">
            <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
                <v-btn dark icon v-bind="attrs" v-on="on" class="my-2">
                <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
                
            </template>
            <v-list>
                <v-list-item v-for="(item, i) in items" :key="i">
                <v-list-item-title class="colored">
                    <router-link class="text-decoration-none colored" :to="{ name: `${item.componentName}`}">{{ item.title }}</router-link>
                </v-list-item-title>
                </v-list-item>
            </v-list>
            
            </v-menu>
            <v-btn class="ma-2" @click="home" color="blue-grey darken-1" width="50%" dark  max-width="200"> Kezdooldal
            </v-btn>
            <v-btn class="ma-2" icon dark color="white">
            <v-icon dark @click="logoutAndSlide"> mdi-logout </v-icon>
            </v-btn>
        </div>
    </v-banner>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
export default {
    name: 'UserBanner',
    components: {
    },
    data: () => ({
        items: [
            {title: 'Statisztika', route: '/dashboard', imgSrc: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg', componentName: 'Dashboard'},
            {title: 'Étlap', route: '/home/admin/foodlist', imgSrc: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg', componentName: 'FoodList'},
            {title: 'Itallap', route: '/itallap', imgSrc: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg', componentName: 'DrinkList'},
            {title: 'Asztalok', route: '/home/user', imgSrc: '', componentName: 'HomeUser'},
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
            this.$router.replace({ path: `/home/user`})
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
<style scoped>
.colored{
    color: rgb(48, 163, 129);
}

</style>