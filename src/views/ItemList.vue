<template>
    <div>
        <div class="activity-header">
            <div class="d-flex">
                <router-link to="/" data-cy="todo-back-button" class="me-4">
                    <b-icon-chevron-bar-left></b-icon-chevron-bar-left>
                </router-link>
                <h4 data-cy="todo-title">
                    {{ activity.title }} 
                </h4>
                <h6 data-cy="todo-title-edit-button" class="ms-2"><b-icon-pencil></b-icon-pencil></h6>       
            </div>
            <b-button class="btn btn-primary" data-cy="todo-add-button">
                <b-icon-plus></b-icon-plus>
                Tambah
            </b-button>
        </div>
    </div>
</template>

<script>

import axios from 'axios'

export default {
    data() {
        return {
            activity: {},
        }
    },
    mounted() {
        this.getActivityDetail();
    },
    methods: {
        async getActivityDetail() {
            const response = await axios.get('https://todo.api.devcode.gethired.id/activity-groups/' + this.$route.params.id);
            this.activity = response.data;
        }
    }
}
</script>

<style>

[data-cy="todo-title"] {
    color: #111111;
    font-weight: 700;
    font-size: 36px;
    line-height: 54px;
}

[data-cy="todo-add-button"] {
    background-color: #16ABF8; 
    color: #FFFFFF;
}

</style>