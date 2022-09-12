<template>
    <div>
        <div class="activity-header">
            <h4 data-cy="activity-title">
                Activity
            </h4>
            <b-button class="btn btn-primary" data-cy="activity-add-button">
                <b-icon-plus></b-icon-plus>
                Tambah
            </b-button>
        </div>

        <div data-cy="activity-empty-state" v-if="activities.length < 1">
            <img src="../assets/activity-empty-state.png" />
        </div>
        
        <b-row v-else>
            <b-col cols="3" v-for="(activity,index) in activities" :key="index" :data-cy="'activity-item-' +index" >
                <div class="card">
                    <router-link :to="'/detail/'+ activity.id">
                        <div class="card-body">
                            <h5 data-cy="activity-item-title">
                                {{ activity.title }}
                            </h5>
                        </div>
                    </router-link>
                    <div class="card-footer">
                        <h6 data-cy="activity-item-date"> {{ formatDate(activity.created_at) }} </h6>
                        <b-button data-cy="activity-item-delete" type="button" v-b-modal="'my-modal-' + activity.id"> <b-icon-trash></b-icon-trash> </b-button>
                    </div>
                </div>

                 <!-- The modal -->
                <b-modal data-cy="modal-delete" :id="'my-modal-' + activity.id" hide-header hide-footer>
                    <img data-cy="modal-delete-icon" src="../assets/warning.png" />
                    <h5 data-cy="modal-delete-title">Apakah anda yakin menghapus activity <strong>"{{ activity.title }}"</strong> ? </h5>
                    <div class="modal-buttons">
                        <b-button data-cy="modal-delete-cancel-button" @click="$bvModal.hide('my-modal-' + activity.id)"> Batal </b-button>
                        <b-button data-cy="modal-delete-confirm-button" @click="deleteActivity(activity.id)"> Hapus </b-button>
                    </div>          
                </b-modal>

            </b-col>
        </b-row>

        <b-modal :show="showAlert" data-cy="modal-information" id="modal-information" hide-header hide-footer>
            <img data-cy="modal-information-icon" src="../assets/warning.png" width="24" height="24" />
            <span data-cy="modal-information-title"> Activity berhasil dihapus</span>
        </b-modal>

    </div>
</template>

<script>

import axios from 'axios'

export default {
    name: "DashboardActivity",
    data() {
        return {
            activities: [],
            showAlert: true,
        }
    },
    mounted() {
        this.getActivities();
    },
    methods: {
        async getActivities() {
            const response = await axios.get('https://todo.api.devcode.gethired.id/activity-groups');
            this.activities = response.data.data;
        },
        formatDate(datetime) {
            const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            let date = new Date(datetime);
            return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        },
        async deleteActivity(id) {
            const response = await axios.delete('https://todo.api.devcode.gethired.id/activity-groups/' + id);

            if(response.status == 200 ) {
                this.$bvModal.hide('my-modal-' + id);
    
                this.getActivities();

                this.$bvModal.show('modal-information');
            }

        }
    }
}
</script>

<style>
.activity-header {
    display: flex;
    justify-content: space-between;
    margin: 43px 0 55px;
}

[data-cy="activity-title"] {
    color: #111111;
    font-weight: 700;
    font-size: 36px;
    line-height: 54px;
}

[data-cy="activity-add-button"] {
    background-color: #16ABF8; 
    color: #FFFFFF;
}

[data-cy="activity-add-button"]:hover {
    background-color: #16ABF8 !important;
}

.btn .b-icon.bi {
    font-size: 150%;
    padding: 0;
}

[data-cy="activity-empty-state"] img {
    display: block;
    margin: 0 auto;
    max-width: 767px;
    width: 100%;
}

.card {
    border-radius: 12px;
    box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
    margin-bottom: 26px;
    max-width: 235px;
    padding: 22px 26px 25px 27px;
    width: 100;
}

.card-body {
    height: 158px;
    padding: 0;
}

.card-footer {
    background: unset;
    border: unset;
    display: flex;
    justify-content: space-between;
    padding: 0;
}

[data-cy="activity-item-title"] {
    color: #111111;
    font-weight: 700;
    font-size: 18px;
    line-height: 27px;
}

[data-cy="activity-item-date"] {
    color: #888888;
    font-weight: 500;
    font-size: 14px;
    line-height: 21px;
}

[data-cy="activity-item-delete"] {
    color: #888888;
}

[data-cy="activity-item-delete"] {
    background: unset;
    border: unset;
    font-size: 14px;
    padding: 0;
}

[data-cy="activity-item-delete"]:hover {
    background: unset;
    color: #888888;
}

[data-cy="modal-delete"] {
    text-align: center;
}

[data-cy="modal-delete"] .modal-body {
    padding: 50.39px 62px 43px 63px !important;
}

[data-cy="modal-delete-title"] {
    margin: 51.5px 0 46px !important;
}

[data-cy="modal-delete-cancel-button"],
[data-cy="modal-delete-confirm-button"] {
    margin: 0 5px;
}

[data-cy="modal-delete-cancel-button"],
[data-cy="modal-delete-cancel-button"]:hover {
   background: #F4F4F4;
   color: #4A4A4A;
}

[data-cy="modal-delete-confirm-button"],
[data-cy="modal-delete-confirm-button"]:hover  {
    background: #ED4C5C;
    color: #FFFFFF;
}

[data-cy="modal-information-title"]  {
    color: #111111;
    font-weight: 500;
    font-size: 14px;
    line-height: 150%;
    margin-left: 24px;
}


</style>