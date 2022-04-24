<template>
    <v-container fluid v-if="isLoggedIn && isAdmin">
        <h2 class="text-center teal--text pb-5 pt-md-5">{{ title }}</h2>
        <v-form
        class="pa-5 ma-5 widthLimit mx-auto"
            ref="form"
            v-model="valid"
            lazy-validation
        >
            <v-text-field
            v-model="name"
            :rules="nameRules"
            :label="dynamicName"
            required
            color="teal"
            ></v-text-field>

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
            label="Allergének"
            color="teal"
            ></v-text-field>

            <v-text-field
            v-if="!$route.path.includes('employee')"
            v-model="price"
            :rules="[numRules.nonNegative, numRules.nonFloat]"
            label="Ár"
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
            v-if="!$route.path.includes('drink')"
            v-model="select"
            :items="items"
            :rules="[v => !!v || 'Item is required']"
            :label="$route.path.includes('employee')? 'Jogosultsag':'Kategória'"
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
        props: ['idProp'],
        name: 'EditSomething',
        data: () => ({
            valid: true,
            price: 0,
            name: '',
            password: '',
            firstName: '',
            lastName: '',
            alert: false,
            nameRules: [
                v => !!v || 'Name is required',
            ],
            rules: {
                required: value => !!value || 'Kötelező mező',
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
                getCategories: 'getCategories',
                getFoodData: 'foodState',
                getDrinkData: 'drinkState',
                getEmployeeData: 'employeeState',
                isAdmin: 'adminLoggedIn',
                isLoggedIn: 'authenticated',
                userSession: 'userState'
            }),
            ...mapMutations({
                updateItemAlreadyInList: 'updateItemAlreadyInList'
            }),
            ...mapActions({
                edit: 'editItem',
                foodApi: 'foodApi'
            }),
            validate () {
                if(this.$refs.form.validate()){
                    let item = {
                        name: this.name,
                        id: this.$route.params.id
                    }
                    let type = "employee"
                    if (this.$route.path.includes("food")){
                        type = "food"
                        item.allergens = this.allergen
                        item.category = this.select,
                        item.price = this.price
                    } else if (this.$route.path.includes("drink")){
                        type = "drink"
                        item.allergens = this.allergen
                        item.category = 'Ital'
                        item.price = this.price
                    } else if (this.$route.path.includes("employee")){
                        item.felhasznalonev = this.name
                        item.jelszo = this.password
                        item.admin = this.select == 'Admin' ? 0 : 1
                        item.vezeteknev = this.firstName
                        item.keresztnev = this.lastName
                    }

                    this.edit({item:item, type: type}).then(response => {
                        if (response.data.response == 'Failed to create user'){
                            this.alert = true
                            setTimeout(() => {
                                this.alert = false
                            }, 2000);
                        } else {
                            this.updateItemAlreadyInList({type: type, item: response.data[0]})
                            this.back2List()
                        }
                    }, error => {
                        console.error("Got nothing from server.",error)
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
                if (this.$route.path.includes('food')) return 'Étel szerkesztése'
                else if(this.$route.path.includes('drink')) return 'Ital szerkesztése'
                else if(this.$route.path.includes('employee')) return 'Személy szerkesztése'
                else return ''
            },
            dynamicName(){
                if (this.$route.path.includes("employee")) return 'Felhasznalonev'
                else return 'Megnevezes'
                
            }
        },
        created(){
            if(this.$route.path.includes("food")){
                this.name = this.getFoodData()(this.$route.params.id).name
                this.select = this.getFoodData()(this.$route.params.id).category
                this.allergen = this.getFoodData()(this.$route.params.id).allergens
                this.price = this.getFoodData()(this.$route.params.id).price

                this.getCategories()("food").forEach(category => {
                    this.items.push(category)
                });

            } else if (this.$route.path.includes("drink")){
                this.name = this.getDrinkData()(this.$route.params.id).name
                this.select = this.getDrinkData()(this.$route.params.id).category
                this.allergen = this.getDrinkData()(this.$route.params.id).allergens
                this.price = this.getDrinkData()(this.$route.params.id).price


                this.getCategories()("drink").forEach(category => {
                    this.items.push(category)
                });

            } else if (this.$route.path.includes("employee")){
                this.name = this.getEmployeeData()(this.$route.params.id).name
                this.select = this.getEmployeeData()(this.$route.params.id).category
                this.firstName = this.getEmployeeData()(this.$route.params.id).firstName
                this.lastName = this.getEmployeeData()(this.$route.params.id).lastName
                this.password = this.getEmployeeData()(this.$route.params.id).password

                this.getCategories()("employee").forEach(category => {
                    this.items.push(category)
                });
            }
            
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