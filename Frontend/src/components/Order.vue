<template>
    <div class="pb-5">
        <v-alert text color="teal" >
            <v-row v-if="getBasketState(this.$route.params.id)" no-gutters >
                <v-col cols="10"><h3 class="text-h5"> Összesítő </h3></v-col>
                <v-col  cols="2" class="my-auto py-auto red--text font-weight-bold">HUF {{ totalSum }}</v-col>
            </v-row>
                <!-- <h3 class="text-h5"> Összesítő </h3> -->
            <div v-for="order in this.getBasketState(this.$route.params.id)" :key="order.id">

                <v-divider class="my-4 red" style="opacity: 0.22" ></v-divider>

                <v-row align="center" no-gutters >
                    <v-col cols="7" v-text="order.orderTitle"></v-col>
                    <v-col cols="3" class="">x {{ order.counter }}</v-col>
                    <v-col cols="2" class=""> HUF {{ order.counter * order.orderPrice }}</v-col>
                </v-row>
            </div>
        </v-alert>
        <div class="d-flex justify-center">
        <v-btn v-if="this.getBasketState(this.$route.params.id).length > 0" rounded dark color="teal" @click="orderAndReset">Rendelés leadás</v-btn>

        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations} from 'vuex';
export default {
    name: 'Order',
    data (){
        return {

        }
    },
    methods: {
        ...mapMutations({
            openMenu: 'changeMenuState'
        }),
        ...mapActions({
            placeOrder: 'placeOrderApi',
        }),
        orderAndReset(){
            this.placeOrder(this.$route.params.id)
            this.openMenu()
        }
    },
    computed: {
        ...mapGetters({
            getBasketState: 'basketState'
        }),
        totalSum(){
            let total = 0;
            let tempArray = [];
            this.getBasketState(this.$route.params.id).forEach(order => {
                tempArray.push(order.orderPrice * order.counter);
            });
            total = tempArray.reduce(
                (prev, curr) => prev + curr, total
            );
            return total
        }
    }
}
</script>