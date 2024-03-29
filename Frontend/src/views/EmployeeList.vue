<template>
    <div v-if="isLoggedIn">
            <div class="d-flex justify-space-between">
                <h2 class="d-flex justify-md-center my-5 mx-5 mx-md-auto teal--text">Személyek Lista</h2>
                <v-btn class="my-5 mx-5 mx-md-auto teal--text" rounded outlined @click="createAndSlide('employee')">
                    Új  személy
                </v-btn>
            </div>
            <v-data-iterator
                :items="items"
                :items-per-page.sync="itemsPerPage"
                :page.sync="page"
                :search="search"
                :sort-by="sortBy.toLowerCase()"
                :sort-desc="sortDesc"
                hide-default-footer
            >
                <template v-slot:header>
                    <v-toolbar dark color="blue-grey darken-1" class="mb-1 mx-0" >
                        <v-text-field
                            v-model="search"
                            clearable
                            flat
                            solo-inverted
                            hide-details
                            prepend-inner-icon="mdi-magnify"
                            label="Kereses"
                            color="teal"
                        ></v-text-field>
                        <template v-if="$vuetify.breakpoint.mdAndUp">
                            <v-spacer></v-spacer>
                            <v-select
                            v-model="sortBy"
                            flat
                            solo-inverted
                            hide-details
                            :items="forditott"
                            prepend-inner-icon="mdi-magnify"
                            label="Rendezes"
                            color="teal"
                            ></v-select>
                            <v-spacer></v-spacer>
                            <v-btn-toggle
                            v-model="sortDesc"
                            mandatory
                            >
                            <v-btn large depressed color="teal accent-2" :value="false">
                                <v-icon>mdi-arrow-up</v-icon>
                            </v-btn>
                            <v-btn large depressed color="teal accent-2" :value="true">
                                <v-icon>mdi-arrow-down</v-icon>
                            </v-btn>
                            </v-btn-toggle>
                        </template>

                    </v-toolbar>
                </template>

                    <template v-slot:default="props">
                        <v-row class="mx-5 my-5">
                            <v-col v-for="item in props.items" :key="item.name"
                                cols="12"
                                sm="6"
                                md="4"
                                lg="3"
                            >
                                <v-card>
                                    <v-card-actions>
                                        <v-card-title class="subheading font-weight-bold teal--text"> {{ item.name }} </v-card-title>
                                        <v-spacer></v-spacer>

                                        <v-btn icon @click="editAndSlide(item.id)" v-if="isAdmin">
                                            <v-icon>mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon v-if="isAdmin" @click="deleteAndRefresh(item.id)">
                                            <v-icon>mdi-delete</v-icon>
                                        </v-btn>
                                    </v-card-actions>
                                    <v-divider></v-divider>

                                    <v-list dense>
                                        <v-list-item v-for="(key, index) in filteredKeys" :key="index">
                                            <v-list-item-content class="grey--text" :class="{ 'blue--text': sortBy === key }">
                                                {{ translated[key] }}:
                                            </v-list-item-content>
                                            <v-list-item-content
                                                class="align-end align-end grey--text text--darken-3 font-weight-bold"
                                                :class="{ 'blue--text': sortBy === key }"
                                            >
                                                {{ item[key.toLowerCase()] }}
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list>
                                </v-card>
                            </v-col>
                        </v-row>
                    </template>

                    <template v-slot:footer>
                        <v-row class="mt-2 mx-5" align="center" justify="center">
                            <span class="grey--text mx-5">Elemek oldalankent</span>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on, attrs }">
                                <v-btn dark text color="teal" class="ml-2" v-bind="attrs" v-on="on">
                                    {{ itemsPerPage }}
                                    <v-icon>mdi-chevron-down</v-icon>
                                </v-btn>
                                </template>
                                <v-list>
                                <v-list-item v-for="(number, index) in itemsPerPageArray" :key="index" @click="updateItemsPerPage(number)">
                                    <v-list-item-title>{{ number }}</v-list-item-title>
                                </v-list-item>
                                </v-list>
                            </v-menu>

                            <v-spacer></v-spacer>

                            <span class="mr-4 grey--text">
                                {{ page }}. oldal (osszesen: {{ numberOfPages }})
                            </span>
                            <v-btn fab dark color="blue-grey darken-1" class="mr-1" @click="formerPage">
                                <v-icon>mdi-chevron-left</v-icon>
                            </v-btn>
                            <v-btn fab dark color="blue-grey darken-1" class="ml-1" @click="nextPage">
                                <v-icon>mdi-chevron-right</v-icon>
                            </v-btn>
                        </v-row>
                    </template>
            </v-data-iterator>
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
</template>


<script>
    import { mapGetters, mapActions } from 'vuex';
    export default {
        name: 'EmployeeList',
        data () {
            return {
            itemsPerPageArray: [4, 8, 12],
            search: '',
            filter: {},
            sortDesc: false,
            page: 1,
            itemsPerPage: 12,
            sortBy: 'name',
            keys: ['Name','Category'],

            forditott: [{
                    text: 'Nev',
                    value: 'Name',
                    disabled: false,
                },
                {
                    text: 'Jogosultsag',
                    value: 'Category',
                    disabled: false,
                }],
            items: [],
            translated: { Name: 'Felhasznalonev', Category: 'Jogosultsag'}
            }
        },
        computed: {
            ...mapGetters({
                employeeLista: 'employeeListState',
                isAdmin: 'adminLoggedIn',
                isLoggedIn: 'authenticated',
                userSession: 'userState',
            }),
            numberOfPages () {
            return Math.ceil(this.items.length / this.itemsPerPage)
            },
            filteredKeys () {
            return this.keys.filter(key => key !== 'Name')
            }

        },
        methods: {
            ...mapActions({
                deleteApi: 'deleteApi',
            }),
            nextPage () {
            if (this.page + 1 <= this.numberOfPages) this.page += 1
            },
            formerPage () {
            if (this.page - 1 >= 1) this.page -= 1
            },
            updateItemsPerPage (number) {
            this.itemsPerPage = number
            },
            editAndSlide(id){
                let type = "food"
                if (this.$route.path.includes("drink")){
                    type = "drink"
                }
                else if(this.$route.path.includes("employee")){
                    type = "employee"
                }
                // this.$router.replace({ path: `/home/admin/foodlist/edit/${id}`})
                this.$router.replace({ path: `/home/admin/items/${type}/edit/${id}`})
            },
            createAndSlide(what){
                this.$router.replace({ path: `/home/admin/items/${what}/new`})
            },
            deleteAndRefresh(id){
                this.deleteApi({
                    item: {id: id},
                    type: 'employee'
                })
                this.items = []
                this.employeeLista.forEach(employee => {
                this.items.push(employee)
            });
            },
        },
        created(){
            this.items = []
            this.employeeLista.forEach(employee => {
                this.items.push(employee)
            });
        }
    }
</script>