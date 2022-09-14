<template>
    <div>
        <div class="activity-header">
            <div class="d-flex align-items-center">
                <router-link to="/" data-cy="todo-back-button">
                    <b-icon-chevron-left></b-icon-chevron-left>
                </router-link>
                <h4 data-cy="todo-title">
                    {{ activity.title }} 
                </h4>
                <h6 data-cy="todo-title-edit-button"><b-icon-pencil></b-icon-pencil></h6>       
            </div>
            <b-button class="btn btn-primary ms-2" data-cy="todo-add-button" type="button" v-b-modal="'modal-add'">
                <b-icon-plus></b-icon-plus>
                Tambah
            </b-button>
        </div>
        <div data-cy="todo-empty-state" v-if="isEmpty" type="button" v-b-modal="'modal-add'">
            <img data-cy="todo-empty-state" src="../assets/todo-empty-state.png" />
        </div>

        <div v-else>
            
        </div>

        <!-- The delete activity modal -->
        <b-modal data-cy="modal-add" id="modal-add"
            hide-footer  
            @show="resetModal"
            @hidden="resetModal"
        >
            <template #modal-title>
                <h5 data-cy="modal-add-title">Tambah List Item</h5> 
            </template>
           <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group
                    label="Nama list item"
                    label-for="title-input"
                    data-cy="modal-add-name-title"
                >
                <b-form-input
                    id="title"
                    v-model="form.title"
                    data-cy="modal-add-name-input"
                ></b-form-input>
                </b-form-group>

                <div data-cy="modal-add-priority-dropdown">
                    <select>
                        <option data-cy="modal-add-priority-very-high" value="very-high" selected> Very High</option>
                        <option data-cy="modal-add-priority-high" value="high">High</option>
                        <option data-cy="modal-add-priority-medium" value="Medium">Medium</option>
                        <option data-cy="modal-add-priority-low" value="low">Low</option>
                        <option data-cy="modal-add-priority-very-low" value="very-low">Very Low</option>
                    </select>
                </div>
            </form>
        </b-modal>
    
    </div>
</template>

<script>

import axios from 'axios'

export default {
    data() {
        return {
            activity: {},
            todoItems: [],
            form: {
                "title": null,
                "priority": "very-high"
            },
            isEmpty: undefined,
        }
    },
    mounted() {
        this.getActivityDetail();
        this.getTodoItems();
    },
    methods: {
        async getActivityDetail() {
            const response = await axios.get('https://todo.api.devcode.gethired.id/activity-groups/' + this.$route.params.id);
            this.activity = response.data;
        },
        
        async getTodoItems() {

            const response = await axios.get('https://todo.api.devcode.gethired.id/todo-items?activity_group_id=' + this.$route.params.id);
            this.todoItems = response.data.data;

            console.log(this.todoItems);

            if(this.todoItems.length < 1) {
                this.isEmpty = true;
            } else {
                this.isEmpty = false;
            }
        },

        async createNewTodoItem() {
            
        },

        resetModal() {
            this.form.title = null;
            this.form.priority = "very-high"
        }

    }
}
</script>

<style scoped>

[data-cy="todo-title"] {
    color: #111111;
    font-weight: 700;
    font-size: 36px;
    line-height: 54px;
}

[data-cy="todo-back-button"] {
    color: #111111;
    font-size: 150%;
    margin-top: -5px;
    margin-right: 36.33px;
}

[data-cy="todo-title-edit-button"] {
    color: #A4A4A4;
    font-size: 120%;
    margin-left: 36.5px;
}

[data-cy="todo-add-button"] {
    background-color: #16ABF8; 
    color: #FFFFFF;
}
[data-cy="todo-add-button"]:hover {
    background-color: #16ABF8; 
    color: #FFFFFF;
}

[data-cy="todo-empty-state"] img {
    cursor: pointer;
    display: block;
    margin: 0 auto;
    max-width: 541px;
    width: 100%;
}

</style>