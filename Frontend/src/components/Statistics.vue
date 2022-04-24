<template>
    <v-container fluid v-if="isLoggedIn & userSession.isAdmin">

        <v-sparkline
        :fill="fill"
        color="teal"
        :line-width="width"
        :padding="padding"
        :smooth="radius || false"
        :value="value"
        auto-draw
        :labels="$vuetify.breakpoint.width > 1200 ? value : []"
        label-size="2"
        :show-labels="$vuetify.breakpoint.width > 1200 ? true : false"
        ></v-sparkline>

        <v-divider></v-divider>

        <v-row>
            <v-col cols="12" md="6" class="pa-md-15">
                    <v-alert text outlined color="teal" icon="mdi-cash">
                        <v-row>
                                <v-col cols="8" class="text-md-justify">Havi Teljes Forgalom: </v-col>
                                <v-col cols="4" class="text-center font-weight-bold">HUF {{adminData.totalSum}}</v-col>
                        </v-row>
                    </v-alert>
                    <v-alert text outlined color="deep-orange" icon="mdi-fire">
                        <v-row>
                                <v-col cols="8" class="text-justify">Legnépszerűbb termék:  </v-col>
                                <v-col cols="4" class="text-center font-weight-bold">{{adminData.mostPopular}}</v-col>
                        </v-row>
                    </v-alert>
                    <v-alert text outlined color="deep-orange" icon="mdi-fire">
                        <v-row>
                            <v-col cols="8" class="text-justify">Legnépszerűbb Étel:  </v-col>
                            <v-col cols="4" class="text-center font-weight-bold">{{adminData.mostPopularFood}}</v-col>
                        </v-row>
                    </v-alert>
                    <v-alert text outlined color="deep-orange" icon="mdi-fire">
                        <v-row>
                            <v-col cols="8" class="text-justify">Legnépszerűbb Ital:  </v-col>
                            <v-col cols="4" class="text-center font-weight-bold">{{adminData.mostPopularDrink}}</v-col>
                        </v-row>
                    </v-alert>
            </v-col>
            <v-col cols="12" md="6" class="pa-md-15">
                <v-list>
                    <v-list-group
                        :value="true"
                        prepend-icon="mdi-cash"
                        color="teal"
                    >
                        <template v-slot:activator>
                        <v-list-item-title>Forgalom napi lebontás</v-list-item-title>
                        </template>
                        <v-alert class="mt-5" text outlined color="teal" v-for="sumDay in adminData.sumData" :key="sumDay.letrehozva">
                            <v-row>
                                <v-col cols="8" class="text-justify">{{sumDay.letrehozva}}</v-col>
                                <v-col cols="4" class="text-center font-weight-bold">HUF {{sumDay.sum}}</v-col>
                            </v-row>
                        </v-alert>
                    </v-list-group>
                </v-list>

            </v-col>
        </v-row>
        
    </v-container>



    <v-container fluid v-else>
        <div style="max-width: 800px" class="mx-auto">
            <v-alert outlined color="green" text>
                <v-row>
                    <v-col cols="12" sm="8" class="text-subtitle-2 text-center text-sm-justify">
                        Szabad asztalok: 

                    </v-col>
                    <v-col cols="12" sm="4" class="text-h5 font-weight-bold text-center text-center">
                        {{this.freeTableCounter}}
                    </v-col>
                </v-row>
            </v-alert>
            <v-alert outlined color="red lighten-1" text>
                <v-row>
                    <v-col cols="12" sm="8" class="text-subtitle-2 text-center text-sm-justify">
                        Rendelésre váró asztalok: 

                    </v-col>
                    <v-col cols="12" sm="4" class="text-h5 font-weight-bold text-center text-center">
                        {{orderedTableCounter}}
                    </v-col>
                </v-row>
            </v-alert>
            <v-alert outlined type="danger" text>
                <v-row>
                    <v-col cols="12" sm="8" class="text-subtitle-2 text-center text-sm-justify">
                        Tisztításra váró asztalok:

                    </v-col>
                    <v-col cols="12" sm="4" class="text-h5 font-weight-bold text-center text-center">
                        {{paidTableCounter}}
                    </v-col>
                </v-row>
            </v-alert>
            <v-alert outlined color="blue" text>
                <v-row>
                    <v-col cols="12" sm="8" class="text-subtitle-2 text-center text-sm-justify">
                        Nem fizetett asztalok:

                    </v-col>
                    <v-col cols="12" sm="4" class="text-h5 font-weight-bold text-center text-center">
                        {{deliveredTableCounter}}
                    </v-col>
                </v-row>
            </v-alert>
            <v-alert text outlined color="deep-orange" icon="mdi-fire">
                <v-row>
                    <v-col cols="12" sm="8" class="text-subtitle-2 text-center text-sm-justify">Legnépszerűbb:</v-col>
                    <v-col cols="12" sm="4" class="text-h5 font-weight-bold text-center text-center">{{mostPopular}}</v-col>
                </v-row>
            </v-alert>
            <v-alert text outlined color="green" icon="mdi-cash">
                <v-row>
                    <v-col cols="12" sm="8" class="text-subtitle-2 text-center text-sm-justify">
                        Napi forgalom:

                    </v-col>
                    <v-col cols="12" sm="4" class="text-h5 font-weight-bold text-center text-center">
                        HUF {{daily}}
                    </v-col>
                </v-row>
            </v-alert>
        </div>

    </v-container>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    export default {
    name: 'Statistics',
    data: () => ({
        mostPopular: '',
        daily: 0,
        fill: true,
        padding: 8,
        radius: 10,
        value: [],
        dates: [],
        width: 2,
        adminData: {
            totalSum: 0,
            mostPopular: '',
            mostPopularFood: '',
            mostPopularDrink: '',
            sumData: []
        },
        }),
    computed: {
        ...mapGetters({
        isAdmin: 'adminLoggedIn',
        isLoggedIn: 'authenticated',
        userSession: 'userState',
        tableStates: 'tableStates',
        freeTableCounter: 'freeTableCounter',
        orderedTableCounter: 'orderedTableCounter',
        paidTableCounter: 'paidTableCounter',
        deliveredTableCounter: 'deliveredTableCounter'
        })
    },
    methods: {
        ...mapActions({
            getStatisticsData: 'getStatisticsData'
        })
    },
    created(){
        this.getStatisticsData({role: this.userSession.isAdmin ? 'admin':'user'})
        .then((data)=>{
            if (!this.userSession.isAdmin){
                this.mostPopular = data.data.star.name
                this.daily = data.data.sum
            } else {
                this.adminData.mostPopular = data.data.star.name
                this.adminData.totalSum = data.data.sum
                this.adminData.mostPopularFood = data.data.starFood.name
                this.adminData.mostPopularDrink = data.data.starDrink.name
                data.data.sumPerDay.forEach(sum => {
                    this.adminData.sumData.push(sum)
                    this.value.push(sum.sum)
                    this.dates.push(sum.letrehozva)
                });
            }
        })
    }
    }
</script>