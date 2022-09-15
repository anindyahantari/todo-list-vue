<template>
    <div>
        <!-- LIST HEADER -->
        <div class="activity-header">
            <div class="d-flex align-items-center">

                <!-- BACK BUTTON -->
                <router-link to="/" data-cy="todo-back-button">
                    <b-icon-chevron-left></b-icon-chevron-left>
                </router-link>

                <!-- EDITABLE ACTIVITY TITLE -->
                <b-form-input
                    id="title"
                    v-model="activity.title"
                    v-if="isEditable"
                    data-cy="todo-title-edit-input" 
                    @keydown.enter="editActivityTitle" 
                ></b-form-input>
                <h4 v-else data-cy="todo-title" @click.prevent="editActivityTitle">
                    {{ activity.title }} 
                </h4>
                <h6 data-cy="todo-title-edit-button" @click.prevent="editActivityTitle"><b-icon-pencil></b-icon-pencil></h6> 
                <!-- END OF EDITABLE ACTIVITY TITLE --> 

            </div>

            <!-- SORT DROPDOWN -->
            <div class="d-flex">
                <b-dropdown id="dropdown" data-cy="todo-sort-button" variant="none">
                    <template #button-content>
                        <span><b-icon-arrow-down-up></b-icon-arrow-down-up></span>
                    </template>

                    <b-dropdown-item data-cy="sort-selection" @click="sortLastest()">
                        <b-icon-sort-down></b-icon-sort-down>
                        Terbaru
                    </b-dropdown-item>
                    <b-dropdown-item data-cy="sort-selection" @click="sortOldest()">
                        <b-icon-sort-up></b-icon-sort-up>
                        Terlama
                    </b-dropdown-item>
                    <b-dropdown-item data-cy="sort-selection" @click="sortAZ()">
                        <b-icon-sort-alpha-down></b-icon-sort-alpha-down>
                        A-Z
                    </b-dropdown-item>
                    <b-dropdown-item data-cy="sort-selection" @click="sortZA()">
                        <b-icon-sort-alpha-up></b-icon-sort-alpha-up>
                        Z-A
                    </b-dropdown-item>
                    <b-dropdown-item data-cy="sort-selection" @click="sortUnfinished()">
                        <b-icon-arrow-down-up></b-icon-arrow-down-up>
                        Belum Selesai
                    </b-dropdown-item>
                </b-dropdown>
                <b-button class="btn btn-primary ms-2" data-cy="todo-add-button" type="button" v-b-modal="'modal-add'">
                    <b-icon-plus></b-icon-plus>
                    Tambah
                </b-button>
            </div>
            <!-- END OF SORT DROPDOWN -->
        </div>
        <!-- END OF LIST HEADER-->

        <!-- TODO ITEM EMPTY STATE -->
        <div data-cy="todo-empty-state" v-if="isEmpty" type="button" v-b-modal="'modal-add'">
            <img data-cy="todo-empty-state" src="../assets/todo-empty-state.png" />
        </div>
        <!-- END OF TODO ITEM EMPTY STATE -->

        <!-- TODO ITEM NOT EMPTY STATE -->
        <div v-else>
            <b-row>
                <b-col cols="12" v-for="(todoItem,index) in todoItems" :key="index" data-cy="todo-item">

                    <!-- TODO ITEM LIST CARD -->
                    <div class="card">
                        <div class="d-flex justify-content-between">
                            <div class="d-flex">

                                <!-- DONE CHECKBOX -->
                                <b-form-checkbox
                                    :id="'checkbox-' + index"
                                    v-model="todoItem.is_active" :ref="`field${index}`"
                                    :name="'checkbox-' + index"
                                    :value="0"
                                    :unchecked-value="1"
                                    v-on:change="updateTodoItem(todoItem.id, index)"
                                    data-cy="todo-item-checkbox"
                                    >
                                </b-form-checkbox>
                                <!-- END OF DONE CHECKBOX -->

                                <span class="priority-indicator" :class="todoItem.priority" data-cy="todo-item-indicator"></span>

                                <!-- EDITABLE TODO ITEM TITLE -->
                                <b-form-input
                                    v-model="todoItem.title" :ref="`field${index}`"
                                    v-if="isTodoItemEditable === todoItem.id"
                                    data-cy="todo-item-title-edit-input" 
                                    @keydown.enter="editTodoItemTitle(todoItem.id, index)" 
                                ></b-form-input>
                                <p v-else data-cy="todo-title" :class="{ done: !todoItem.is_active }" @click.prevent="editTodoItemTitle(todoItem.id, index)">
                                    {{ todoItem.title }} 
                                </p>
                                <span data-cy="todo-title-edit-button"  @click.prevent="editTodoItemTitle(todoItem.id, index)"><b-icon-pencil></b-icon-pencil></span>
                                <!-- END OF EDITABLE TODO ITEM TITLE -->

                            </div>
                            <div data-cy="todo-item-delete-button" type="button" v-b-modal="'modal-delete-' + todoItem.id"> <b-icon-trash></b-icon-trash> </div>
                        </div>
                    </div>

                    <!-- THE DELETE TODO MODAL -->
                    <b-modal data-cy="modal-delete" :id="'modal-delete-' + todoItem.id" hide-header hide-footer centered>
                        <img data-cy="modal-delete-icon" src="../assets/warning.png" />
                        <h5 data-cy="modal-delete-title">Apakah anda yakin menghapus List Item  <strong>"{{ todoItem.title }}"</strong> ? </h5>
                        <div class="modal-buttons">
                            <b-button data-cy="modal-delete-cancel-button" @click="$bvModal.hide('modal-delete-' + todoItem.id)"> Batal </b-button>
                            <b-button data-cy="modal-delete-confirm-button" @click="deleteTodoItem(todoItem.id)"> Hapus </b-button>
                        </div>          
                    </b-modal>
                </b-col>
            </b-row>
           
        </div>
        <!--  END OF TODO ITEM NOT EMPTY STATE -->

        <!-- THE ADD ITEM MODAL -->
        <b-modal data-cy="modal-add" id="modal-add" centered>
            <template #modal-header>
                <h5 class="modal-title" data-cy="modal-add-title">Tambah List Item</h5>
                <div data-cy="modal-add-close-button" @click="closeModal"><b-icon-x-lg></b-icon-x-lg></div> 
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
                <b-dropdown id="dropdown" data-cy="modal-add-priority-dropdown" variant="none" class="m-md-2 d-block">
                    <template #button-content>
                        <span class="priority-indicator" :class="priority.value"></span>
                        <span data-cy="modal-add-priority-item"> {{ priority.text }}</span>
                    </template>

                    <b-dropdown-item data-cy="modal-add-priority-item" @click="getPriorityValue('very-high', 'Very High')">
                        <span class="priority-indicator very-high"></span>
                        Very High
                    </b-dropdown-item>
                    <b-dropdown-item  data-cy="modal-add-priority-item" @click="getPriorityValue('high', 'High')">
                        <span class="priority-indicator high"></span>
                        High
                    </b-dropdown-item>
                    <b-dropdown-item data-cy="modal-add-priority-item" @click="getPriorityValue('normal', 'Medium')">
                        <span class="priority-indicator normal"></span>
                        Medium
                    </b-dropdown-item>
                    <b-dropdown-item data-cy="modal-add-priority-item" @click="getPriorityValue('low', 'Low')">
                        <span class="priority-indicator low"></span>
                        Low
                    </b-dropdown-item>
                    <b-dropdown-item data-cy="modal-add-priority-item" @click="getPriorityValue('very-low', 'Very Low')">
                        <span class="priority-indicator very-low"></span>
                        Very Low
                    </b-dropdown-item>
                </b-dropdown>

            </form>

            <template #modal-footer>
                <b-button  v-if="form.title != null" type="submit" data-cy="modal-add-save-button" @click="createNewTodoItem">Simpan</b-button>
                <b-button v-else type="submit" data-cy="modal-add-save-button" disabled @click="createNewTodoItem">Simpan</b-button>
            </template>

        </b-modal>

        <InformationModal />
    
    </div>
</template>

<script>

import axios from 'axios'
import InformationModal from "../components/InformationModal.vue"

export default {
    components: {
        InformationModal
    },
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
            isTodoItemEditable: -1,
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
                this.closeModal();
                
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

        async deleteTodoItem(id) {
            const response = await axios.delete('https://todo.api.devcode.gethired.id/todo-items/' + id);

            if(response.status == 200 ) {
                this.$bvModal.hide('modal-delete-' + id);
    
                this.getTodoItems();

                this.$bvModal.show('modal-information');
            }

        },

        editTodoItemTitle(id, arrayIndex) {

            if(this.isTodoItemEditable != id) {
                
                this.isTodoItemEditable = id;
            }
            else {
                this.updateTodoItem(id, arrayIndex);
                this.isTodoItemEditable = -1;
            }
        },

        async updateTodoItem(id, arrayIndex) {
            try {
                await axios.patch('https://todo.api.devcode.gethired.id/todo-items/' + id, this.todoItems[arrayIndex]);
            
            } catch (error) {
                console.log(error)
            }
        },

        getPriorityValue(value, text) {
            this.priority.value = value;
            this.priority.text = text;
        },

        closeModal() {
            this.resetModal();
            this.$bvModal.hide('modal-add');
        },

        resetModal() {
            this.form.title = null;
            this.form.priority = null;
            this.priority.text = "Very High";
            this.priority.value = "very-high";
        },

        sortOldest() {
            this.todoItems.sort(( a, b) => {
                if (a.id < b.id)
                    return -1;
                if (a.id > b.id)
                    return 1;
                return 0;
            });
            return this.items;
        },

        sortLastest() {
           this.todoItems.sort(( a, b) => {
                if (a.id > b.id)
                    return -1;
                if (a.id < b.id)
                    return 1;
                return 0;
            });
            return this.items;
        },

        sortAZ() {
            this.todoItems.sort(( a, b) => {
                if (a.title < b.title)
                    return -1;
                if (a.title > b.title)
                    return 1;
                return 0;
            })

            console.log(this.todoItems);
            
            return this.todoItems;
        },

        sortZA() {

            this.todoItems.sort(( a, b) => {
                if (a.title < b.title)
                    return 1;
                if (a.title > b.title)
                    return -1;
                return 0;
            })
            
            return this.todoItems;
     
        },

        sortUnfinished() {
            this.todoItems.sort(( a, b) => {
                if (a.is_active < b.is_active)
                    return 1;
                if (a.is_active > b.is_active)
                    return -1;
                return 0;
            })
            
            return this.todoItems;
        }
    }
}
</script>

<style scoped>

.card {
    max-width: 1000px;
}

.card .priority-indicator {
    margin-top: 6px;
}

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

[data-cy="todo-add-button"],
[data-cy="modal-add-save-button"] {
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

[data-cy="modal-add-priority-dropdown"] >>> .dropdown-toggle {
    border: 1px solid #E5E5E5 !important;
    border-radius: 6px !important;
}

[data-cy="modal-add-priority-item"],
.priority-indicator >>> .dropdown-item {
    color: #111111;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
}

[data-cy="todo-item-title"].done {
    color: #C7C7C7;
    text-decoration-line: line-through;
}

[data-cy="todo-item-delete-button"] {
    color: #888888;
}

[data-cy="todo-item-title-edit-input"] {
    border: unset;
    border-bottom: 1px solid #111111;
    border-radius: 0;
    color: #111111;
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    padding: 0;
}

[data-cy="todo-sort-button"] >>> .dropdown-toggle {
    border: 1px solid #88888858 !important;
    color: #888888;
    font-size: 14px;
    padding: 0 18px !important;
}

[data-cy="todo-sort-button"] >>> .dropdown-toggle::after {
    display: none;
}

[data-cy="todo-sort-button"] >>> .dropdown-item .b-icon.bi {
    color: #16ABF8;
}

[data-cy="todo-sort-button"] >>> .dropdown-item  {
    color: #4A4A4A;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
}

.custom-checkbox >>> input{
    margin: 6px 22px 0 0;
}
</style>