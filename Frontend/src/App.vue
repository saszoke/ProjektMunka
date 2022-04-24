<template>
  <v-app>
    <UserBanner />
    <AdminBanner />


    <v-main>
      <router-view/>
      <CustomAlert />
    </v-main>
  </v-app>
  <!-- <Welcome /> -->
</template>

<script>
import {mapActions} from 'vuex'
import CustomAlert from '@/components/CustomAlert.vue'
import UserBanner from '@/components/UserBanner.vue'
import AdminBanner from '@/components/AdminBanner.vue'
export default {
  components: {
    UserBanner,
    AdminBanner,
    CustomAlert
  },
    methods: {
      ...mapActions({
          foodApi: 'foodApi',
          employeesApi: 'employeesApi',
          tablesApi: 'tablesApi'
      }),
  },

  created(){
    this.foodApi()
    this.employeesApi()
    this.tablesApi()
  }
};
</script>
