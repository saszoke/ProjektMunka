<template>
    <v-container fluid v-if="isLoggedIn && isAdmin">
        <h2 class="text-center teal--text pb-5 pt-md-5">{{ title }}</h2>
        <v-form class="mx-auto pa-5 mt-0 mt-md-5 widthLimit" ref="form" v-model="valid" lazy-validation>
            <v-text-field v-model="name" :rules="nameRules" :label="dynamic" required color="teal"></v-text-field>

            <v-text-field
            v-if="$route.path.includes('employee')"
            v-model="firstName"
            label="Vezeteknev"
            :rules="[rules.required]"
            color="teal"
            ></v-text-field>

            <v-text-field
            v-if="$route.path.includes('employee')"
            v-model="lastName"
            label="Keresztnev"
            :rules="[rules.required]"
            color="teal"
            ></v-text-field>
            
            <v-text-field
            v-if="!$route.path.includes('employee')"
            v-model="allergen"
            label="Allergenek"
            color="teal"
            ></v-text-field>

            <v-text-field
            v-if="!$route.path.includes('employee')"
            :rules="[numRules.nonNegative, numRules.nonFloat]"
            v-model="price"
            label="Ar"
            color="teal"
            ></v-text-field>

            <v-text-field
            v-if="$route.path.includes('employee')"
            v-model="password"
            label="Jelszo"
            type="password"
            :rules="[rules.required, rules.min, rules.max]"
            hint="Legalabb 4 karakter"
            placeholder="Hozzon letre egy jelszot"
            color="teal"
            ></v-text-field>


            <v-select
            v-model="select"
            v-if="!$route.path.includes('drink')"
            :items="items"
            :rules="[v => !!v || 'Kotelezo mezo']"
            :label="$route.path.includes('employee')?'Jogosultsag':'Kategoria'"
            required
            color="teal"
            ></v-select>

            <v-btn
            dark
            color="teal"
            class="mr-4"
            @click="validate"
            >
            Mentés
            </v-btn>
            <v-btn
            plain
            color="red"
            class="ml-4"
            @click="back2List"
            >
            Vissza
            </v-btn>
        </v-form>
        <div class="mx-auto mt-5" style="max-width: 500px;">
            <v-alert :value="alert" transition="scale-transition" type="red lighten-1" style="border-radius: 10px">
                Felhasználónév már létezik
            </v-alert>
        </div>
    </v-container>
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
import { mapGetters, mapActions, mapMutations } from 'vuex'
    export default {
        name: 'AddSomething',
        data: () => ({
            valid: true,
            price: 0,
            alert: false,
            name: '',
            password: '',
            firstName: '',
            lastName: '',
            nameRules: [
                v => !!v || 'Kötelező mező',
            ],
            rules: {
                required: value => !!value || 'Kotelezo mezo',
                min: v => v.length >= 4 || 'Legalább 4 karakter',
                max: v => v.length <= 20 || 'Maximum 20 karakter',
            },
            numRules: {
                nonNegative: v => v > 0 || '0-nál nagyobb szám',
                nonFloat: v => v % 1 == 0 || 'Egész szám',
            },
            allergen: '',
            
            select: null,
            items: [],
        }),

        methods: {
            ...mapGetters({
                getFoodData: 'foodState',
                getCategories: 'getCategories',
                isAdmin: 'adminLoggedIn',
                isLoggedIn: 'authenticated',
                userSession: 'userState'
            }),
            ...mapActions({
                create: 'createItem'
            }),
            ...mapMutations({
                addCreatedItemToList: 'addCreatedItemToList'
            }),
            validate () {
                if(this.$refs.form.validate()){
                    let type = "food"
                    let item = {
                        name: this.name,
                        category: this.select,
                        allergens: this.allergen,
                        price: this.price,
                    }
                    if (this.$route.path.includes("drink")){
                        type = "drink"
                        item.category = 'Ital'
                    } else if (this.$route.path.includes("employee")){
                        type = "employee"
                        item = {
                            felhasznalonev: this.name,
                            jelszo: this.password,
                            admin: this.select == 'Admin' ? 0 : 1,
                            vezeteknev: this.firstName,
                            keresztnev: this.lastName
                        }
                    }

                    this.create({item:item, type: type}).then(response => {
                        if (response.data.response == 'Failed to create user'){
                            this.alert = true
                            setTimeout(() => {
                                this.alert = false
                            }, 2000);
                        } else {
                            this.addCreatedItemToList({type: type, item: response.data[0]})
                            this.back2List()
                        }
                    }, error => {
                        console.error("Got nothing from server.", error)
                    })
                }
            },
            reset () {
                this.$refs.form.reset()
            },
            resetValidation () {
                this.$refs.form.resetValidation()
            },
            back2List(){
                if(this.$route.path.includes("food")){
                    this.$router.replace({ path: `/home/foodlist`})
                } else if (this.$route.path.includes("drink")){
                    this.$router.replace({ path: `/home/drinklist`})
                } else if (this.$route.path.includes("employee")){
                    this.$router.replace({ path: `/home/admin/employeelist`})
                }
            }
        },
        computed: {
            title(){
                if (this.$route.path.includes('food')) return 'Új étel felvétele'
                else if(this.$route.path.includes('drink')) return 'Új ital felvétele'
                else if(this.$route.path.includes('employee')) return 'Új személy felvétele'
                else return ''
            },
            dynamic(){
                if (this.$route.path.includes("employee")) return 'Felhasznalonev'
                else return 'Megnevezes'
            }
        },
        created(){
            let type = "food"
            if (this.$route.path.includes("drink")){
                type = "drink"
            }
            else if(this.$route.path.includes("employee")){
                type = "employee"
            }
            
            this.getCategories()(type).forEach(category => {
                this.items.push(category)
            });
            
        }
    }
</script>

<style scoped>
.widthLimit{
    max-width: 500px;
    border: 2px solid rgba(0, 128, 128, 0.726);
    border-radius: 10px;
}
</style>