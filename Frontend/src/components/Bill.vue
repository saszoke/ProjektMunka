<template>
    <div>
        <v-dialog
        v-model="invoiceOpen"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        >
            <v-card
                class="mx-auto"
                max-width="500"
            >
                <v-alert text color="teal" >
                    <v-row v-if="getBill(id)" no-gutters>
                        <v-col cols="9"><h3 class="text-h5 mx-5"> {{ id }}. Asztal Összesítő</h3></v-col>
                        <v-col cols="3" class="my-auto py-auto red--text font-weight-bold">HUF {{ totalSum }}</v-col>
                    </v-row>
                    
                    <div v-for="order in this.getBill(id)" :key="order.id">

                        <v-divider class="my-4 red" style="opacity: 0.22" ></v-divider>

                        <v-row align="center" no-gutters>
                            <v-col cols="7" v-text="order.orderTitle"></v-col>
                            <v-col cols="2">x {{ order.counter }}</v-col>
                            <v-col cols="3"> HUF {{ order.counter * order.orderPrice }}</v-col>
                        </v-row>
                    </div>
                </v-alert>
                <div class="d-flex justify-center">
                <v-btn v-if="this.getBill(id).length > 0 && getTable(this.$route.params.id).orderState == 'delivered'" rounded dark color="teal" @click="closeBillnPay">Számla Rendezve</v-btn>
                </div>
                <div class="d-flex justify-center py-10">
                    <v-btn rounded dark color="red lighten-1" @click="resetLocalBill">Vissza</v-btn>
                </div>

            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations} from 'vuex';
export default {
    name: 'Bill',
    props: ['id'],
    data (){
        return {

        }
    },
    methods: {
        ...mapMutations({
            openBill: 'changeInvoiceState',
            resetOrders: 'resetOrders'
        }),
        ...mapActions({
            placeOrder: 'placeOrderApi',
            payBill: 'payOrderApi'
        }),
        orderAndReset(){
            this.$emit('resetBasket')
            this.openMenu()
        },
        closeBillnPay(){
            this.openBill()
            this.payBill(this.id)
        },
        resetLocalBill(){
            this.openBill()
            this.resetOrders(this.id)
        }
    },
    computed: {
        ...mapGetters({
            getTable: 'tableState',
            invoiceOpen: 'invoiceState',
            getBill: 'orderState'
        }),
        totalSum(){
            let total = 0;
            let tempArray = [];
            this.getBill(this.id).forEach(order => {
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