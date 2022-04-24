<template>
    <v-app v-if="isLoggedIn && !isAdmin">
        <v-main>
            <Tables />
            <CustomAlert />
        </v-main>
    </v-app>
    <v-alert
    v-else
    prominent
    type="error"
    >
    <v-row align="center">
        <v-col class="grow">
        Ön jelenleg nincs bejelentkezve, mégis a dineR belső nézeteit próbálja elérni. A folytatáshoz jelentkezzen be.
        </v-col>
        <v-col class="shrink">
        <v-btn dark rounded color="teal" @click="$router.replace({ path: `/`})">Bejelentkezés</v-btn>
        </v-col>
    </v-row>
    </v-alert>
</template>

<script>
import {mapGetters} from 'vuex';
import CustomAlert from '@/components/CustomAlert.vue'
import Tables from '@/components/Tables.vue'
export default {
    name: 'HomeUser',
    components: {
        CustomAlert,
        Tables
    },
    data: () => ({
        items: [
            { title: 'Dashboard' },
            { title: 'Tables' },
            { title: 'Food' },
            { title: 'Drink' },
            { title: 'Map' },
            { title: 'Logout' },
        ]
    }),
    methods: {},

    computed: {
        ...mapGetters({
        dynamicButtonState: 'dynamicButtonTextState',
        dynamicButtonRoute: 'dynamicButtonRouteState',
        isAdmin: 'adminLoggedIn',
        isLoggedIn: 'authenticated',
        userSession: 'userState'

        })
    }
};
</script>
