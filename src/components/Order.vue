<template>
    <div class="pb-5">
        <v-alert text color="info" >
            <v-row v-if="getBasketState(this.$route.params.id)" no-gutters >
                <v-col cols="8"><h3 class="text-h5"> Összesítő </h3></v-col>
                <v-col class="my-auto py-auto red--text">HUF {{ totalSum }}</v-col>
            </v-row>
                <!-- <h3 class="text-h5"> Összesítő </h3> -->
            <div v-for="order in this.getBasketState(this.$route.params.id)" :key="order.id">

                <v-divider class="my-4 info" style="opacity: 0.22" ></v-divider>

                <v-row align="center" no-gutters >
                    <v-col cols="5" v-text="order.orderTitle"></v-col>
                    <v-col cols="2" class="text-center">x {{ order.counter }}</v-col>
                    <v-col cols="5" class="text-center"> HUF {{ order.counter * order.orderPrice }}</v-col>
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
        log(payload){
            console.log(payload)
        },
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
            // console.log(this.$route.params.id)
            let total = 0;
            let tempArray = [];
            this.getBasketState(this.$route.params.id).forEach(order => {
                console.log(order)
                tempArray.push(order.orderPrice * order.counter);
            });
            console.log(tempArray);
            total = tempArray.reduce(
                (prev, curr) => prev + curr, total
            );
            return total
        }
    }
}
</script>