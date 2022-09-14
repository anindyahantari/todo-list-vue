<template>
    <div>
        <div class="activity-header">
            <h4 data-cy="activity-title">
                Activity
            </h4>
            <b-button class="btn btn-primary" data-cy="activity-add-button" @click="createNewActivity()">
                <b-icon-plus></b-icon-plus>
                Tambah
            </b-button>
        </div>

        <div data-cy="activity-empty-state" v-if="isEmpty" @click="createNewActivity()">
            <img data-cy="activity-empty-state" src="../assets/activity-empty-state.png" />
        </div>
        
        <b-row>
            <b-col cols="6" md="3"  v-for="(activity,index) in activities" :key="index" data-cy="activity-item" >
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
                        <b-button data-cy="activity-item-delete-button" type="button" v-b-modal="'modal-delete-' + activity.id"> <b-icon-trash></b-icon-trash> </b-button>
                    </div>
                </div>

                 <!-- The delete activity modal -->
                <b-modal data-cy="modal-delete" :id="'modal-delete-' + activity.id" hide-header hide-footer centered>
                    <img data-cy="modal-delete-icon" src="../assets/warning.png" />
                    <h5 data-cy="modal-delete-title">Apakah anda yakin menghapus activity <strong>"{{ activity.title }}"</strong> ? </h5>
                    <div class="modal-buttons">
                        <b-button data-cy="modal-delete-cancel-button" @click="$bvModal.hide('modal-delete-' + activity.id)"> Batal </b-button>
                        <b-button data-cy="modal-delete-confirm-button" @click="deleteActivity(activity.id)"> Hapus </b-button>
                    </div>          
                </b-modal>
            </b-col>
        </b-row>

        <InformationModal />

    </div>
</template>

<script>

import axios from 'axios'
import InformationModal from "../components/InformationModal.vue"

export default {
    name: "DashboardActivity",
    components: {
        InformationModal
    },
    data() {
        return {
            activities: [],
            form: {
                "title": "New Activity",
                "email": "ini@email.com"
            },
            isEmpty: undefined,
        }
    },
    async mounted() {
        this.getActivities();
    },
    methods: {
        async getActivities() {
            const response = await axios.get('https://todo.api.devcode.gethired.id/activity-groups?email=ini@email.com');
            this.activities = response.data.data;

            if(this.activities.length < 1) {
                this.isEmpty = true;
            } else {
                this.isEmpty = false;
            }
        },

        async createNewActivity() {
            try {
                await axios.post('https://todo.api.devcode.gethired.id/activity-groups?email=ini@email.com', this.form);
                this.getActivities();

            } catch (error) {
                console.log(error)
            }
        },

        async deleteActivity(id) {
            const response = await axios.delete('https://todo.api.devcode.gethired.id/activity-groups/' + id);

            if(response.status == 200 ) {
                this.$bvModal.hide('modal-delete-' + id);
    
                this.getActivities();

                this.$bvModal.show('modal-information');
            }

        },

        formatDate(datetime) {
            const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            let date = new Date(datetime);
            return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
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
    cursor: pointer;
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

</style>