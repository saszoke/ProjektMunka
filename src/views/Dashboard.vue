<template>
  <div class="stat d-flex justify-center mt-10">
    <v-btn dark rounded color="teal" @click="$router.replace({ path: `/`})">404</v-btn>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex';
export default {
  name: 'Dashboard',
  components: {
  },
  computed: {
    ...mapGetters({
      isAdmin: 'adminLoggedIn',
      isLoggedIn: 'authenticated',
      userSession: 'userState'
    })
  }
}
</script>
