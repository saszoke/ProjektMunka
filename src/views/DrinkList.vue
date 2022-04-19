<template>
    <div v-if="isLoggedIn">
            <div class="d-flex justify-space-between">
                <h2 class="d-flex justify-md-center my-5 mx-5 mx-md-auto">Ital Lista</h2>
                <v-btn class="my-5 mx-5 mx-md-auto" rounded outlined @click="createAndSlide('drink')" v-if="isAdmin">
                    Új  ital
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
                            label="Search"
                        ></v-text-field>
                        <template v-if="$vuetify.breakpoint.mdAndUp">
                            <v-spacer></v-spacer>
                            <v-select
                            v-model="sortBy"
                            flat
                            solo-inverted
                            hide-details
                            :items="keys"
                            prepend-inner-icon="mdi-magnify"
                            label="Sort by"
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
                <!-- <v-container fluid > -->

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
                                        <v-card-title class="subheading font-weight-bold"> {{ item.name }} </v-card-title>
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
                                            <v-list-item-content :class="{ 'blue--text': sortBy === key }">
                                                {{ key }}:
                                            </v-list-item-content>
                                            <v-list-item-content
                                                class="align-end"
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
                            <span class="grey--text mx-5">Items per page</span>
                            <v-menu offset-y>
                                <template v-slot:activator="{ on, attrs }">
                                <v-btn dark text color="primary" class="ml-2" v-bind="attrs" v-on="on">
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
                                Page {{ page }} of {{ numberOfPages }}
                            </span>
                            <v-btn fab dark color="blue-grey darken-1" class="mr-1" @click="formerPage">
                                <v-icon>mdi-chevron-left</v-icon>
                            </v-btn>
                            <v-btn fab dark color="blue-grey darken-1" class="ml-1" @click="nextPage">
                                <v-icon>mdi-chevron-right</v-icon>
                            </v-btn>
                        </v-row>
                    </template>
                <!-- </v-container> -->
            </v-data-iterator>
    </div>
    <div class="d-flex justify-center mt-10" v-else>
        <v-btn dark rounded color="teal" @click="$router.replace({ path: `/`})">401</v-btn>
    </div>
</template>


<script>
    import { mapGetters, mapActions } from 'vuex';
    export default {
        name: 'DrinkList',
        data () {
            return {
            itemsPerPageArray: [4, 8, 12],
            search: '',
            filter: {},
            sortDesc: false,
            page: 1,
            itemsPerPage: 4,
            sortBy: 'name',
            keys: [
                'Name',
                'Category',
                'Allergens',
                'Price',
            ],
            items: [],
            }
        },
        computed: {
            ...mapGetters({
                italLista: 'drinkListState',
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
                deleteApi: 'deleteApi'
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
                this.$router.replace({ path: `/home/admin/items/${type}/edit/${id}`})
            },
            createAndSlide(what){
                this.$router.replace({ path: `/home/admin/items/${what}/new`})
            },
            deleteAndRefresh(id){
                this.deleteApi({
                    item: {id: id},
                    type: 'drink'
                })
                this.items = []
                this.italLista.forEach(ital => {
                    this.items.push(ital)
                });
            },
        },
        created(){
            this.italLista.forEach(ital => {
                this.items.push(ital)
            });
        }
    }
</script>