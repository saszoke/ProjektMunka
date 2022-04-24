<template>
  <div class="zoom" v-if="isLoggedIn && !isAdmin">

    <div class="d-flex justify-center mt-1 my-md-15">
      <Table class="pa-0 ma-0" :id="this.$route.params.id" :state="tableStates[this.$route.params]" />
    </div>
    <Menu :tableId="this.$route.params.id" />
    <div class="d-flex justify-center">

    <v-btn class="mt-15 mt-md-5 mx-md-5" width="150" color="teal" rounded dark v-if="getTable(this.$route.params.id).orderState == 'ordered'"  @click="deliverOrder($route.params.id)">Kivittem</v-btn>
    <v-btn class="mt-15 mt-md-5 mx-md-5" width="150" color="red lighten-1" rounded dark v-if="getTable(this.$route.params.id).orderState == 'ordered'"  @click="handleBill">Rendelesek</v-btn>
    <v-btn class="mt-15 mt-md-5" width="150" color="teal" rounded dark v-if="getTable(this.$route.params.id).orderState == 'delivered'"  @click="handleBill">Számla</v-btn>
    <Bill :id="this.$route.params.id" />
    <v-btn class="mt-15 mt-md-5" width="150" color="teal" rounded dark v-if="getTable(this.$route.params.id).orderState == 'paid'"  @click="cleanTable($route.params.id)">Tisztítva</v-btn>
    </div>

    <div class="d-flex justify-center mt-10">
      <v-btn class="d-none d-md-flex" width="150" dark rounded color="teal" @click="$router.replace({ name: 'HomeUser' })">Asztalok</v-btn>
    </div>
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
  import Table from '@/components/Table.vue'
  import Menu from '@/components/Menu.vue'
  import Bill from '@/components/Bill.vue'
  import { mapMutations, mapGetters, mapActions } from 'vuex'

  export default {
    name: 'Zoom',
    components: {
      Table,
      Menu,
      Bill
    },

    data: () => ({
      id: this.$route.params.id
    }),
    methods: {
      ...mapMutations({
        openBill: 'changeInvoiceState',
        openMenu: 'changeMenuState',
        resetBasketState: 'emptyBasket',
        cleanTable: 'cleanTable',
        
      }),
      ...mapActions({
        foodApi: 'foodApi',
        deliverOrder: 'deliverOrderApi',
        getBillApi: 'getBillApi'
      }),
      tableState(id){
        return this.$store.getters.tableState(id)
      },
      handleBill(){
        this.getBillApi({id: this.$route.params.id})
        this.openBill()

      }
    },

    computed: {
      ...mapGetters({
            getBill: 'billState',
            getTable: 'tableState',
            isAdmin: 'adminLoggedIn',
            isLoggedIn: 'authenticated',
            userSession: 'userState'
        }),
      tableStates(){
        return this.$store.getters.tableStates
      },
      
    },
    mounted(){
      this.foodApi()
      this.resetBasketState()
    }
  }
</script>
