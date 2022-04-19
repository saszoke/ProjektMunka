<template>
    <v-container fluid v-if="isLoggedIn && isAdmin">
        <v-form
        class="pa-5 ma-5"
            ref="form"
            v-model="valid"
            lazy-validation
        >
            <v-text-field
            v-model="name"
            :rules="nameRules"
            :label="dynamicName"
            required
            ></v-text-field>

            <v-text-field
            v-if="$route.path.includes('employee')"
            v-model="firstName"
            label="Vezeteknev"
            :rules="[rules.required]"
            ></v-text-field>

            <v-text-field
            v-if="$route.path.includes('employee')"
            v-model="lastName"
            label="Keresztnev"
            :rules="[rules.required]"
            ></v-text-field>

            <v-text-field
            v-if="!$route.path.includes('employee')"
            v-model="allergen"
            label="Allergének"
            ></v-text-field>

            <v-text-field
            v-if="!$route.path.includes('employee')"
            v-model="price"
            label="Ár"
            ></v-text-field>

            <v-text-field
            v-if="$route.path.includes('employee')"
            v-model="password"
            label="Jelszo"
            type="password"
            :rules="[rules.required, rules.min]"
            hint="Legalabb 4 karakter"
            placeholder="Hozzon letre egy jelszot"
            counter
            ></v-text-field>

            <v-select
            v-model="select"
            :items="items"
            :rules="[v => !!v || 'Item is required']"
            :label="$route.path.includes('employee')? 'Jogosultsag':'Kategória'"
            required
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
    </v-container>
    <div class="d-flex justify-center mt-10" v-else>
        <v-btn dark rounded color="teal" @click="$router.replace({ path: `/`})">401</v-btn>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
            nameRules: [
                v => !!v || 'Name is required',
            ],
            rules: {
                required: value => !!value || 'Kötelező mező',
                min: v => v.length >= 4 || 'Legalább 4 karakter'
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
            ...mapActions({
                edit: 'editItem',
                foodApi: 'foodApi'
            }),
            validate () {
                if(this.$refs.form.validate()){
                    let item = {
                        name: this.name,
                        category: this.select,
                        id: this.$route.params.id
                    }
                    let type = "employee"
                    if (this.$route.path.includes("food")){
                        type = "food"
                        item.allergens = this.allergen
                        item.price = this.price
                    } else if (this.$route.path.includes("drink")){
                        type = "drink"
                        item.allergens = this.allergen
                        item.price = this.price
                    } else if (this.$route.path.includes("employee")){
                        item = {
                            felhasznalonev: this.name,
                            jelszo: this.password,
                            admin: this.select == 'Admin' ? 0 : 1,
                            vezeteknev: this.firstName,
                            keresztnev: this.lastName,
                            id: this.$route.params.id
                        }
                    }
                    
                    this.edit({item:item, type: type})
                    this.back2List()
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