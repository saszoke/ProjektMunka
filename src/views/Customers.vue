<template>
  <div v-if="isLoggedIn && isAdmin">
    <Tables />
  </div>
  <div class="d-flex justify-center mt-10" v-else>
        <v-btn dark rounded color="teal" @click="$router.replace({ path: `/`})">401</v-btn>
  </div>
</template>

<script>
import Tables from '@/components/Tables.vue'
import { mapGetters } from 'vuex';

export default {
  name: 'Customers',
  components: {
    Tables
  },
  computed: {
    ...mapGetters({
        employeeLista: 'employeeListState',
        isAdmin: 'adminLoggedIn',
        isLoggedIn: 'authenticated',
        userSession: 'userState'
    })
  },
}
</script>
