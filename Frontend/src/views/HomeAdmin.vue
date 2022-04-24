<template>
    <v-container>
        <div v-if="isLoggedIn && isAdmin">
            <h2 class="text-center my-10 teal--text">
                Admin Kezdooldal
            </h2>
            <v-row>
                <v-col cols="12" md="4"  v-for="route in routesList" :key="route.name">
                    
                    <v-card class="mx-auto" max-width="300">
                        <v-img :src="route.imgSrc"  height="100" ></v-img>

                        <v-card-title class="teal--text">{{ route.name }}</v-card-title>
                        <v-card-actions class="d-flex justify-end">
                            <v-btn type="submit" rounded color="teal" text dark @click="goTo(route.componentName)" class="mr-5">
                                Tovabb
                            </v-btn>

                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </div>
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
    </v-container>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
    name: 'HomeAdmin',
    data(){
        return {
            routesList: [
                {name: 'Statisztika', route: '/dashboard', imgSrc: './statistics4x4.webp', componentName: 'Dashboard'},
                {name: 'Etlap', route: '/home/admin/foodlist', imgSrc: './food4x4.png', componentName: 'FoodList'},
                {name: 'Itallap', route: '/itallap', imgSrc: './drink4x4.webp', componentName: 'DrinkList'},
                {name: 'Szemelyzet', route: '/szemelyzet', imgSrc: './employees4x4.webp', componentName: 'EmployeeList'},
            ]
        }
    },
    methods:{
        goTo(view){
            this.$router.replace({ name: view})
        }
    },
    computed: {
        ...mapGetters({
            isAdmin: 'adminLoggedIn',
            isLoggedIn: 'authenticated',
            userSession: 'userState'
        })
    },

}
</script>