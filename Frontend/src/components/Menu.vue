<template>
    <v-row justify="center">
        <v-dialog
        v-model="menuState.open"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        >
            <v-card
                class="mx-auto"
                max-width="500"
            >
                <v-toolbar
                color="teal"
                dark
                >
                <v-btn icon @click="openMenu">
                    <v-icon>mdi-arrow-left-thick</v-icon>
                </v-btn>
                <v-toolbar-title>Menu</v-toolbar-title>
                <v-spacer></v-spacer>

                </v-toolbar>

                <v-list>
                <v-list-group
                    v-for="item in getMenuItems"
                    :key="item.title"
                    v-model="item.active"
                    :prepend-icon="item.action"
                    no-action
                    color="teal"
                >
                    <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.title"></v-list-item-title>
                    </v-list-item-content>
                    </template>

                    <v-list-item
                    v-for="child in item.items"
                    :key="child.title"
                    >
                    <v-list-item-content>
                        <v-list-item-title v-text="child.title"></v-list-item-title>
                        <div>
                            <v-btn small text @click="updateBasket({parent: item.title, orderId: child.id, orderTitle: child.title, orderPrice: child.price, action: '+'})">
                                <v-icon>
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                            <v-btn disabled small fab>{{ getCounter(child.id) }}</v-btn>
                            <v-btn small text @click="updateBasket({parent: item.title, orderId: child.id, orderPrice: child.price, action: '-'})">
                                <v-icon>
                                    mdi-minus
                                </v-icon>
                            </v-btn>
                        </div>
                    </v-list-item-content>
                    </v-list-item>
                </v-list-group>
                </v-list>
                <Order />
            </v-card>
        </v-dialog>
    </v-row>
</template>


<script>
import {mapGetters, mapMutations} from 'vuex';
import Order from '@/components/Order.vue';
    export default {
        name: 'Menu',
        components: {
            Order
        },
        props: ['tableId'],

        data () {
            return {
                basket: []

            }
        },
        computed: {
            ...mapGetters({
                getBasketState: 'basketState',
                getMenuItems: 'getMenuItems',
            }),
            menuState(){
                return this.$store.getters.menuState
            },

        },
        methods: {
            ...mapMutations({
                openMenu: 'changeMenuState',
                dynamicButtonChange: 'changeDynamicButtonText',
                updateBasketState: 'updateBasket',
                resetBasketState: 'emptyBasket'
            }),

            updateBasket(payload){
                this.updateBasketState({
                    tableId: this.tableId,
                    orderId: payload.orderId,
                    orderTitle: payload.orderTitle,
                    orderPrice: payload.orderPrice,
                    action: payload.action
                })
            },

            getCounter(id){
                let toReturn = 0
                this.getBasketState(this.$route.params.id).forEach(order => {
                    if (order.orderId == id){
                        toReturn = order.counter
                    }
                })
                return toReturn
            }
        },
    }
</script>