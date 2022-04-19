<template>
    <div>
        <h3 class="d-flex justify-center my-15">{{ $route.params.claim == "admin" ? 'Adminisztrátori ':'Felhasználói '}} Bejelentkezés</h3>
            <v-form ref="loginForm" v-model="valid" lazy-validation class="mx-auto pa-5 widthLimit">
                    <v-text-field v-model="name" :rules="nameRules" label="Felhasználónév" required placeholder="Írja be a felhasználónevét"
                        filled
                        rounded
                        dense
                    ></v-text-field>

                    <v-text-field
                        v-model="password"
                        :rules="[rules.required, rules.min]"
                        hint="Legalább 4 karakter"
                        label="Jelszó"    
                        placeholder="Írja be a jelszavát"
                        filled
                        rounded
                        dense
                        type="password"
                        
                    ></v-text-field>

                <div class="text-center">
                    <v-btn @click="validate($route.params.claim)" rounded color="teal" dark class="mr-5">
                    Bejelentkezés
                    </v-btn>
                    <v-btn rounded plain color="red lighten-2" dark @click="$router.replace({ path: `/`})"> Vissza </v-btn>
                </div>
            </v-form>
        <div class="d-flex justify-center mt-5">
            <h3 class="d-inline">dine</h3><h1 class="d-inline red--text" >R</h1>
        </div>
        <v-img contain max-width="600" class="mx-auto" :src="$route.params.claim == 'admin' ? srcManager:srcUser"></v-img>
    </div>
</template>
    


<script>

import {mapActions, mapMutations} from 'vuex';
import axios from 'axios'

export default {
    props: ['claim'],
    data: () => ({
        valid: true,
        price: 0,
        name: '',
        password: '',
        nameRules: [
            v => !!v || 'Kötelező mező',
        ],
        rules: {
            required: value => !!value || 'Kötelező mező',
            min: v => v.length >= 4 || 'Legalább 4 karakter'
        },
        allergen: '',
        
        select: null,
        items: [],
        srcManager: './managementLogo.png',
        srcUser: './waiterLogo3.png',
    }),

    methods: {
        ...mapMutations({
            login: 'changeLoginState'
        }),
        ...mapActions({
            foodApi: 'foodApi',
            employeesApi: 'employeesApi',
            tablesApi: 'tablesApi'
        }),
        validate(identity) {
                if(this.$refs.loginForm.validate()){
                    axios.post('http://localhost:3000/login',{felhasznalonev: this.name, jelszo: this.password, jogosultsag: this.$route.path.includes('admin') ? 0 : 1}).then((response)=>{
                        if (response.data.success == true){
                            this.login({identity: identity})
                            this.$router.replace({ path: `/home/${identity}`, params: { identity: identity } })
                        }
                    })
                }
            },
    },
    mounted(){
        
    }
}
</script>

<style scoped>
.widthLimit{
    max-width: 500px;

}
</style>>
