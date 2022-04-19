<template>
    <v-row justify="center">
        <v-dialog v-model="getConfirmState.open" persistent max-width="290">
            <v-card>
                <v-card-title class="text-h5">Figyelmeztetés</v-card-title>
                <v-card-text>{{getConfirmState.alertText[getConfirmState.type]}}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="acceptConfirm">Yes</v-btn>
                    <v-btn color="green darken-1" text @click="declineConfirm">No</v-btn>
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
                getConfirmState: 'alertState'
            })
        },
        methods: {
            ...mapMutations({
                openConfirm: 'confirmToggle'
            }),
            acceptConfirm(){
                console.log('Confirmation accepted')
            },
            acceptConfirm(){
                console.log('Confirmation declined')
            },
        }
    }
</script>