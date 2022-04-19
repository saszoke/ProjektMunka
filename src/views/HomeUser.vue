<template>
    <v-app v-if="isLoggedIn && !isAdmin">
        <v-main>
            <Tables />
            <CustomAlert />
        </v-main>
    </v-app>
    <div class="d-flex justify-center mt-10" v-else>
            <v-btn dark rounded color="teal" @click="$router.replace({ path: `/`})">401</v-btn>
    </div>
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
