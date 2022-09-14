<template>
    <div>
        <div class="activity-header">
            <div class="d-flex align-items-center">
                <router-link to="/" data-cy="todo-back-button">
                    <b-icon-chevron-left></b-icon-chevron-left>
                </router-link>
                <b-form-input
                    id="title"
                    v-model="activity.title"
                    v-if="isEditable"
                    data-cy="todo-title-edit-input" 
                    @keydown.enter="editActivityTitle" 
                ></b-form-input>
                <h4 v-else data-cy="todo-title" @click.prevent="editActivityTitle()">
                    {{ activity.title }} 
                </h4>
             
                <h6 data-cy="todo-title-edit-button" @click.prevent="editActivityTitle()"><b-icon-pencil></b-icon-pencil></h6>       
            </div>

            <!-- ADD LIST BUTTON -->
            <b-button class="btn btn-primary ms-2" data-cy="todo-add-button" type="button" v-b-modal="'modal-add'">
                <b-icon-plus></b-icon-plus>
                Tambah
            </b-button>
        </div>
        
        <div data-cy="todo-empty-state" v-if="isEmpty" type="button" v-b-modal="'modal-add'">
            <img data-cy="todo-empty-state" src="../assets/todo-empty-state.png" />
        </div>

        <div v-else>
            <b-row>
                <b-col cols="12" v-for="(todoItem,index) in todoItems" :key="index" data-cy="todo-item">
                    <div class="card">
                        <p data-cy="todo-item-title">{{ todoItem.title }}</p> 
                    </div>
                </b-col>
            </b-row>
           
        </div>

        <!-- THE ADD ITEM MODAL -->
        <b-modal data-cy="modal-add" id="modal-add" centered>
            <template #modal-header>
                <h5 class="modal-title" data-cy="modal-add-title">Tambah List Item</h5>
                <div data-cy="modal-add-close-button" @click="$bvModal.hide('modal-add')"><b-icon-x-lg></b-icon-x-lg></div> 
            </template>
           <form ref="form">
                <b-form-group
                    label="Nama list item"
                    label-for="title-input"
                    data-cy="modal-add-name-title"
                >
                <b-form-input
                    id="title"
                    v-model="form.title"
                    data-cy="modal-add-name-input"
                    required
                ></b-form-input>
                </b-form-group>

                <label for="priority-input" data-cy="modal-add-priority-title">Priority</label>
                <b-dropdown id="dropdown" :text="priority.text" data-cy="modal-add-priority-dropdown" class="m-md-2">
                    <b-dropdown-item data-cy="modal-add-priority-very-high" @click="getPriorityValue('very-high', 'Very High')">Very High</b-dropdown-item>
                    <b-dropdown-item data-cy="modal-add-priority-high" @click="getPriorityValue('high', 'High')">High</b-dropdown-item>
                    <b-dropdown-item data-cy="modal-add-priority-medium" @click="getPriorityValue('medium', 'Medium')">Medium</b-dropdown-item>
                    <b-dropdown-item data-cy="modal-add-priority-low" @click="getPriorityValue('low', 'Low')">Low</b-dropdown-item>
                    <b-dropdown-item data-cy="modal-add-priority-very-low" @click="getPriorityValue('low', 'Low')">Very Low</b-dropdown-item>
                </b-dropdown>

            </form>

            <template #modal-footer>
                <b-button  v-if="form.title != null" type="submit" data-cy="modal-add-save-button" @click="createNewTodoItem">Simpan</b-button>
                <b-button v-else type="submit" data-cy="modal-add-save-button" disabled @click="createNewTodoItem">Simpan</b-button>
            </template>

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
                "activity_group_id": this.$route.params.id,
                "title": null,
                "priority": null,
            },
            priority: {
                value: "very-high",
                text: "Very High"
            },
            isEmpty: undefined,
            isEditable: false,
        }
    },
    mounted() {
        this.getActivityDetail();
        this.getTodoItems();
    },
    methods: {
        async getActivityDetail() {
            try {
                const response = await axios.get('https://todo.api.devcode.gethired.id/activity-groups/' + this.$route.params.id);
                this.activity = response.data;
                
            } catch (error) {
                console.log(error)
            }
        },
        
        async getTodoItems() {
            try {
                const response = await axios.get('https://todo.api.devcode.gethired.id/todo-items?activity_group_id=' + this.$route.params.id);
                this.todoItems = response.data.data;
    
                if(this.todoItems.length < 1) {
                    this.isEmpty = true;
                } else {
                    this.isEmpty = false;
                }

            } catch (error) {
                console.log(error)
            }

        },

       async createNewTodoItem() {

            this.form.priority = this.priority.value;
                
            try {
                await axios.post('https://todo.api.devcode.gethired.id/todo-items', this.form );
                this.getTodoItems();
                
            } catch (error) {
                console.log(error)
            }
        },

        async editActivityTitle() {

            if(!this.isEditable) {
                this.isEditable = true;
            } else {
                
                try {
                    await axios.patch('https://todo.api.devcode.gethired.id/activity-groups/' + this.$route.params.id, this.activity);
                
                } catch (error) {
                    console.log(error)
                }
                this.isEditable = false;
            }
        },

        getPriorityValue(value, text) {
            this.priority.value = value;
            this.priority.text = text;
        },
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

[data-cy="todo-title-edit-input"] {
    border: unset;
    border-bottom: 1px solid #111111;
    border-radius: 0;
    color: #111111;
    font-weight: 700;
    font-size: 36px;
    line-height: 54px;
    padding: 0;
}

[data-cy="todo-title-edit-input"]:focus {
    box-shadow: unset;
    border-radius: 0;
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

[data-cy="modal-add-title"] {
    color: #111111;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 18px;
    line-height: 27px;
}

[data-cy="modal-add-close-button"] {
    color: #A4A4A4;
    cursor: pointer;
    font-size: 12px;
}

[data-cy="modal-add-name-title"], 
[data-cy="modal-add-priority-title"] {
    color: #111111;
    font-weight: 600;
    font-size: 12px;
    line-height: 18px;
    margin: 26px 0 9px;
    text-transform: uppercase;
}

</style>