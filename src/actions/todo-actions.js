'use strict';
var actions = actions || {};

//store behavior on global namespace
actions.todo = {

  //declare our global model properties
  properties: {
    todos:{
      type:Array
    }
  },

  //listen for action events
  listeners: {
    'create_todo': 'createTodo',
    'delete_todo': 'deleteTodo',
    'update_todo': 'updateTodo'
  },

  //initialize model
  ready: function() {
    this.todos = [
      {complete:false, body:'complete this demo', saving:false},
      {complete:false, body:'astound friends', saving:false},
      {complete:false, body:'add component tests', saving:false},
      {complete:false, body:'tests for actions', saving:false},
      {complete:false, body:'routing', saving:false}
    ];
  },

  /** handle events **/

  createTodo: function(event, detail) {
    const todo = {complete:false, body:detail.body, saving:true};
    this.push('todos', todo);
    const index = this.todos.indexOf(todo);
    this.async(() => {
      this.notifyPath(`todos.${index}.saving`, false);
    }, 1000);
  },

  deleteTodo: function(event, detail) {
    const index = this.todos.indexOf(detail);
    if(index > -1) {
      const toBeRemoved = this.todos[index];
      this.notifyPath(`todos.${index}.saving`, true);
      //fake network action
      this.async(() => {
        this.notifyPath(`todos.${index}.saving`, false);
        this.splice('todos', index, 1);
      }, 1000);
    }
  },

  updateTodo: function(event, detail) {
    const index = this.todos.indexOf(detail.update);
    detail.saving = true;
    this.notifyPath(`todos.${index}.saving`, detail.saving);
    this.notifyPath(`todos.${index}.${detail.prop}`, detail.value);
    //push update events into an observable?
    //observable debounces x ms until deciding to save?
    //...
    this.async(() => {
      detail.saving = false;
      this.notifyPath(`todos.${index}.saving`, detail.saving);
      this.notifyPath(`todos.${index}.${detail.prop}`, detail.value);
    }, 1000);
  }
};
