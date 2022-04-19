<template>
    <div class="pb-5">
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
                <v-alert text color="info" >
                    <v-row v-if="getBill(id)" no-gutters >
                        <v-col cols="8"><h3 class="text-h5"> {{ id }}. Asztal Összesítő</h3></v-col>
                        <v-col class="my-auto py-auto red--text">HUF {{ totalSum }}</v-col>
                    </v-row>
                    <div v-for="order in this.getBill(id)" :key="order.id">

                        <v-divider class="my-4 info" style="opacity: 0.22" ></v-divider>

                        <v-row align="center" no-gutters >
                            <v-col cols="5" v-text="order.orderTitle"></v-col>
                            <v-col cols="2" class="text-center">x {{ order.counter }}</v-col>
                            <v-col cols="5" class="text-center"> HUF {{ order.counter * order.orderPrice }}</v-col>
                        </v-row>
                    </div>
                </v-alert>
                <div class="d-flex justify-center">
                <v-btn v-if="this.getBill(id).length > 0" rounded dark color="teal" @click="closeBillnPay">Számla Rendezve</v-btn>
                </div>
                <div class="d-flex justify-center my-10">
                <v-btn rounded dark color="red" @click="resetLocalBill">Vissza</v-btn>
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
        log(payload){
            console.log(payload)
        },
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
            invoiceOpen: 'invoiceState',
            getBill: 'orderState'
        }),
        totalSum(){
            let total = 0;
            let tempArray = [];
            console.log(this.getBill(this.id))
            this.getBill(this.id).forEach(order => {
                tempArray.push(order.orderPrice * order.counter);
                console.log(this.getBill(this.id))
            });
            total = tempArray.reduce(
                (prev, curr) => prev + curr, total
            );
            return total
        }
    }
}
</script>