<template>
    <v-container fluid v-if="isLoggedIn && isAdmin">
        <h2 class="text-center">{{ title }}</h2>
        <v-form class="pa-5 mt-0 mt-md-5" ref="form" v-model="valid" lazy-validation>
            <v-text-field v-model="name" :rules="nameRules" :label="dynamic" required ></v-text-field>

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
            label="Allergenek"
            ></v-text-field>

            <v-text-field
            v-if="!$route.path.includes('employee')"
            v-model="price"
            label="Ar"
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
            :rules="[v => !!v || 'Kotelezo mezo']"
            :label="$route.path.includes('employee')?'Jogosultság':'Kategória'"
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
        name: 'AddSomething',
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
                getFoodData: 'foodState',
                getCategories: 'getCategories',
                isAdmin: 'adminLoggedIn',
                isLoggedIn: 'authenticated',
                userSession: 'userState'
            }),
            ...mapActions({
                create: 'createItem'
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
                    this.create({item:item, type: type})
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
            title(){
                if (this.$route.path.includes('food')) return 'Új étel felvétele'
                else if(this.$route.path.includes('drink')) return 'Új ital felvétele'
                else if(this.$route.path.includes('employee')) return 'Új személy felvétele'
                else return ''
            },
            dynamic(){
                if (this.$route.path.includes("employee")) return 'Felhasználónév'
                else return 'Név'
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