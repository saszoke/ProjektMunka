<template>
    <div>
        <h3 class="d-flex justify-center my-5 teal--text">{{ $route.params.claim == "admin" ? 'Adminisztrátori ':'Felhasználói '}} Bejelentkezes</h3>
            <v-form ref="loginForm" v-model="valid" lazy-validation class="mx-auto pa-5 widthLimit">
                    <v-text-field v-model="name" :rules="nameRules" label="Felhasznalonev" required placeholder="Irja be a felhasznalonevet"
                        filled
                        rounded
                        dense
                        color="teal"
                    ></v-text-field>

                    <v-text-field
                        v-model="password"
                        :rules="[rules.required, rules.min]"
                        hint="Legalább 4 karakter"
                        label="Jelszó"    
                        placeholder="Irja be a jelszavat"
                        filled
                        rounded
                        dense
                        type="password"
                        color="teal"
                        
                    ></v-text-field>

                    <div :style="$vuetify.breakpoint.xs ? 'height:85px':'height:60px'">
                        <v-alert
                        :value="dialogState.state"
                        color="red lighten-1"
                        dark
                        style="border-radius: 26px"
                        transition="scale-transition"
                        >
                            {{dialogState.text}}
                        </v-alert>
                    </div>

                <div class="text-center">
                    <v-btn @click="validate($route.params.claim)" rounded color="teal" dark class="mr-5">
                    Bejelentkezes
                    </v-btn>
                    <v-btn rounded plain color="red lighten-2" dark @click="$router.replace({ path: `/`})"> Vissza </v-btn>
                </div>
            </v-form>
        <div class="d-flex justify-center mt-1">
            <h3 class="d-inline">dine</h3><h1 class="d-inline red--text" >R</h1>
        </div>

        <v-img contain max-width="600" class="mx-auto" :src="$route.params.claim == 'admin' ? srcManager:srcUser"></v-img>
    </div>
</template>
    


<script>

import {mapActions, mapGetters, mapMutations} from 'vuex';
import axios from 'axios'

export default {
    props: ['claim'],
    data: () => ({
        valid: true,
        price: 0,
        name: '',
        password: '',
        alert: false,
        nameRules: [
            v => !!v || 'Kotelezo mezo',
        ],
        rules: {
            required: value => !!value || 'Kotelezo mezo',
            min: v => v.length >= 4 || 'Legalabb 4 karakter'
        },
        allergen: '',
        
        select: null,
        items: [],
        srcManager: './managementLogo.png',
        srcUser: './waiterLogo3.png',
    }),

    methods: {
        ...mapMutations({
            login: 'changeLoginState',
            dialogChange: 'dialogChange'
        }),
        ...mapActions({
            foodApi: 'foodApi',
            employeesApi: 'employeesApi',
            tablesApi: 'tablesApi',
        }),
        validate(identity) {
                if(this.$refs.loginForm.validate()){
                    axios.post('http://localhost:3000/login',{felhasznalonev: this.name, jelszo: this.password, jogosultsag: this.$route.path.includes('admin') ? 0 : 1}).then((response)=>{
                        if (response.data.success == true){
                            this.login({identity: identity})
                            this.$router.replace({ path: `/home/${identity}`, params: { identity: identity } })
                        } else {
                            this.dialogChange({text:'Helytelen felhasznalonev vagy jelszo'})
                        }
                    })
                }
            },
    },
    computed: {
        ...mapGetters({
            dialogState:'dialogState'
        })
    },
    mounted(){
        
    }
}
</script>

<style>
.widthLimit{
    max-width: 500px;
}
</style>>
