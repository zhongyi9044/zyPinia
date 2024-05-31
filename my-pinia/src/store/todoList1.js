// import { defineStore } from "pinia";
import { defineStore } from "../pinia";
import { computed, ref } from "vue";

export default defineStore('todoList1', {
  state: () => ({
    todoList: [],
    count: 0
  }),
  getters: {
    length() {
      return this.todoList.length
    },
    doubleCount() {
      return this.count * 2
    }
  },
  actions: {
    addTodo(todo) {
      this.todoList.unshift(todo)
    },
    toggleTodo(id) {
      this.todoList = this.todoList.map(todo => {
        if (todo.id === id) {
          todo.completed = !todo.completed
        }
        return todo
      })

    },
    removeTodo(id) {
      this.todoList = this.todoList.filter(todo => todo.id !== id)
    }
  }
})