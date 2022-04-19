<template>
    <v-container>
    <div v-if="isLoggedIn && isAdmin">
        <h2 class="text-center my-10">
            Admin Kezdőoldal
        </h2>
        <v-row>
            <v-col cols="12" md="4"  v-for="route in routesList" :key="route.name">
                
                <v-card class="mx-auto" max-width="300">
                    <v-img :src="route.imgSrc"  height="100" ></v-img>

                    <v-card-title>{{ route.name }}</v-card-title>
                    <v-card-actions class="d-flex justify-end">
                        <v-btn type="submit" rounded color="teal" text dark @click="goTo(route.componentName)" class="mr-5">
                            Tovább
                        </v-btn>

                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </div>
    <div class="d-flex justify-center mt-10" v-else>
        <v-btn dark rounded color="teal" @click="$router.replace({ path: `/`})">401</v-btn>
    </div>
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
                {name: 'Étlap', route: '/home/admin/foodlist', imgSrc: './food4x4.png', componentName: 'FoodList'},
                {name: 'Itallap', route: '/itallap', imgSrc: './drink4x4.webp', componentName: 'DrinkList'},
                {name: 'Személyzet', route: '/szemelyzet', imgSrc: './employees4x4.webp', componentName: 'EmployeeList'},
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