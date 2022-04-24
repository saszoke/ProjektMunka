<template>
    <v-row justify="center">
        <v-dialog v-model="getAlertStatus.open" persistent max-width="290">
            <v-card>
                <v-card-title class="text-h5">Figyelmeztetés</v-card-title>
                <v-card-text>{{getAlertStatus.alertText[getAlertStatus.type]}}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="openAlert">Rendben</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex';
    export default {
        name: 'CustomAlert',
        data () {
            return {}
        },
        computed: {
            ...mapGetters({
                getAlertStatus: 'alertState'
            })
        },
        methods: {
            ...mapMutations({
                openAlert: 'alertToggle'
            })
        }
    }
</script>