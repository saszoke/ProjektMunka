<template>
    <div>
        <h3>Kijelentkezés...</h3>
    </div>
</template>
    


<script>
import {mapMutations} from 'vuex';

export default {
    name: 'Logout',
    data: () => ({}),

    methods: {
        ...mapMutations({
            logout: 'logout'
        }),
        logoutAndSlide(){
            this.logout()
            this.$router.replace({ path: `/`})
        },
    },
    created(){
        this.logoutAndSlide()
    }
}
</script>

<style scoped>

</style>>
