<template>
  <v-container>
      <v-row>
        <v-col cols-md cols="12" md="6" lg="4" v-for="counter in tables" :key="counter">
          <Table :id="counter" :state="tableStates[counter]" />
        </v-col>
      </v-row>
  </v-container>
</template>

<script>
  import Table from '@/components/Table.vue'
  import {mapGetters, mapMutations} from 'vuex';


  export default {
    name: 'Tables',
    components: {
      Table
    },

    data: () => ({
      tables: 5
    }),
    methods: {
      ...mapMutations({
                openMenu: 'changeMenuState',
                dynamicButtonChange: 'changeDynamicButtonText'
            }),
      tableState(id){
        return this.$store.getters.tableState(id)
      }
    },

    computed: {
      ...mapGetters({
      dynamicButtonState: 'dynamicButtonTextState',
      dynamicButtonRoute: 'dynamicButtonRouteState'
      }),
      tableStates(){
        return this.$store.getters.tableStates
      },
      
    }
  }
</script>
