<template>
  <div v-if="isLoggedIn && isAdmin">
    <Tables />
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
