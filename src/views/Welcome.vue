<template>
    <v-app>
        <v-main>
            <div class="d-flex justify-center mt-15 pt-md-15">
                <h3 class="d-inline">dine</h3><h1 class="d-inline red--text" >R</h1>
            </div>
            <div class="d-flex flex-column flex-md-row justify-center my-15 mx-auto mx-md-15">
                <div v-for="role in roles" :key="role.name" >
                    <v-card class="mx-auto mx-md-15 mb-5 mb-md-0" max-width="344">
                        <v-img
                        :src="role.src"
                        height="200px"
                        ></v-img>

                        <v-card-title v-text="role.name == 'admin' ? 'Adminisztrátor' : 'Felhasználó' "> To the {{  }} login page</v-card-title>
                        <v-card-actions class="d-flex justify-end">
                            <v-btn color="red lighten-2" text @click="$router.replace({ name: `Login`, params: { claim: `${role.name}`}} )">

                                <!-- <router-link :claim="role.name" :to="{ name: 'Login', params: { claim: `${role.name}` }}">Go</router-link> -->
                                Bejelentkezés
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </div>

            </div>
        </v-main>
    </v-app>
</template>


<script>

export default {
    name: 'Welcome',
    components: {
    },
    data(){
        return {
            roles: [{name: 'admin', src: './managerWelcome.jpg'}, {name: 'user', src: './waiterWelcome.jpg'}]
        }
    }
}
</script>

<style scoped>
.customBorder{
    border: 1px solid rgb(218, 147, 147);
}
</style>