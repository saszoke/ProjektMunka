<template>
  <div class="stat d-flex justify-center mt-10" v-if="isLoggedIn">
    <Statistics />
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
// @ is an alias to /src
import { mapGetters } from 'vuex';
import Statistics from '@/components/Statistics.vue'
export default {
  name: 'Dashboard',
  components: {
    Statistics,
  },
  computed: {
    ...mapGetters({
      isAdmin: 'adminLoggedIn',
      isLoggedIn: 'authenticated',
      userSession: 'userState'
    })
  },
}
</script>
