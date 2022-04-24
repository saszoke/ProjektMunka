<template>
    <v-container>
        <div class="table mx-auto">
            <div class="chair top d-flex justify-center" :class="this.tableState(id).chairTop.chairState ? 'openTop' : ''" @click="toggle('top', $event)">
                    <v-btn
                        v-if="this.$route.name != 'HomeUser' && this.tableState(id).chairTop.chairState && this.tableState(id).orderState != 'paid'"
                        class="my-auto"
                        fab
                        small
                        color="white"
                        @click="openMenu({'chair':'top', 'id':id})"
                    ><v-icon>mdi-plus</v-icon></v-btn>
            </div>
            <v-icon id="0" color="white" size="96px" class="plate reverse">$custom</v-icon>
            <v-icon id="1" color="white" size="96px" class="plate straight">$custom</v-icon>
            <div class="id font-weight-bold" :class="status">
                <v-row v-if="this.$route.name == 'HomeUser'" align="center" justify="space-around" class="my-0">
                    <v-btn color="white" @click="$router.replace({ name: 'Zoom', params: { id: `${id}`}})">
                            <div>
                                <div class="">
                                <v-icon left>
                                    mdi-magnify
                                </v-icon>
                                    {{ id }}. Asztal
                                </div>
                            </div>
                    </v-btn>
                </v-row>
                <v-row align="center" justify="space-around" class="my-0" v-else>
                            <div>
                                {{ id }}. Asztal
                            </div>
                </v-row>
            </div>
            <div class="chair bot d-flex justify-center" :class="this.tableState(id).chairBot.chairState ? 'openBot' : ''" @click="toggle('bot', $event)">
                <v-btn
                    v-if="this.$route.name != 'HomeUser' && this.tableState(id).chairBot.chairState && this.tableState(id).orderState != 'paid'"
                    class="my-auto"
                    fab
                    small
                    color="white"
                    @click="openMenu({'chair':'bot', 'id':id})"
                ><v-icon>mdi-plus</v-icon></v-btn>
            </div>
        </div>
    </v-container>
</template>

<script>
import plate from '@/components/PlateIcon.vue';
import {mapGetters, mapMutations} from 'vuex';


    export default {
        name: 'Table',
        components: [plate],

        data: () => ({
        }),

        props: ['id', 'state'],

        methods: {
            ...mapMutations({
                openMenu: 'changeMenuState',
                handleChairMove: 'changeChairState',
                alertToggle: 'alertToggle'
            }),
            toggle(pos, $event){

                if ($event.target.classList[1] == 'top' || $event.target.classList[1] == 'bot'){
                    if (pos == 'top'){
                        let permission = this.mayIUpdate({table: { id: this.id },chair: {id: 0, state: $event.target.classList.contains('openTop') ? false : true }})
                        if (permission){
                            this.handleChairMove({chairId: 0, tableId: this.id, state: $event.target.classList.contains('openTop') ? false : true })
                        } else {
                            this.alertToggle()
                        }
                    } else {
                        let permission = this.mayIUpdate({table: { id: this.id },chair: {id: 1, state: $event.target.classList.contains('openBot') ? false : true }})
                        if (permission){
                            this.handleChairMove({chairId: 1, tableId: this.id, state: $event.target.classList.contains('openBot') ? false : true })
                        } else {
                            this.alertToggle()
                        }
                    }
                }
            }
        },
        computed: {
            ...mapGetters({
            // map `this.doneCount` to `this.$store.getters.doneTodosCount`
            dynamicButtonState: 'dynamicButtonTextState',
            dynamicButtonRoute: 'dynamicButtonRouteState',
            tableState: 'tableState',
            mayIUpdate: 'mayIUpdate'
            }),
            menuState(){
                return this.$store.getters.menuState
            },
            status(){
                return  this.tableState(this.id).orderState
            }
        },
    }
</script>

<style scoped>
    .table{
        margin-top: 75px;
        margin-bottom: 75px;
        width: 250px;
        background-color: rgb(165, 42, 42);
        height: 250px;
        border-radius: 15px;
        position: relative;
        border: 2px solid black;
    }

    .chair{
        width: 150px;
        height: 50px;
        background-color: rgb(165, 42, 42);
        margin-right: 20%;
        margin-left: 20%;
        position: absolute;
        border: 2px solid black;
    }

    .plate{
        position: absolute;
        left: 31.5%;
    }
    .reverse{
        transform: rotate(180deg);
        top: 0;
    }

    .straight{
        bottom: 0;
    }
    .top{
        top: -20%;
        border-top-left-radius: 35px;
        border-top-right-radius: 35px;
        transition: all .25s linear;

    }

    .bot{
        bottom: -20%;
        border-bottom-left-radius: 35px;
        border-bottom-right-radius: 35px;
        transition: all .25s linear;

    }

    .openTop{
        top: -30%;
        transition: all .25s linear;
    }

    .openBot{
        bottom: -30%;
        transition: all .25s linear;
    }

    .id{
        color: rgb(138, 61, 61);
        position: absolute;
        top: 40%;
        padding: 2.5%;
        text-align: center;
        width: 100%;
    }
    .idle{
        background-color: rgb(189, 235, 189);
    }
    .ordered{
        background-color: rgb(255, 107, 107);;
    }
    .delivered{
        background-color: rgb(163, 229, 255);
    }
    .paid{
        background-color: rgb(190, 190, 190);
    }
</style>
