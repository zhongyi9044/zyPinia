// import { defineStore } from "pinia";
import { defineStore } from "../pinia";
import { computed, ref } from "vue";

export default defineStore('todoList2', () => {
  const todoList = ref([])
  const length = computed(() => todoList.value.length)
  const count=ref(0)
  const doubleCount=computed(() => count.value * 2)
  function addTodo(todo) {
    todoList.value.unshift(todo)
  }
  function toggleTodo(id) {
    todoList.value.value = todoList.value.map(todo => {
      if (todo.id === id) {
        todo.completed = !todo.completed
      }
      return todo
    })

  }
  function removeTodo(id) {
    todoList.value = todoList.value.filter(todo => todo.id !== id)
  }
  return {
    todoList,
    count,
    doubleCount,
    length,
    addTodo,
    toggleTodo,
    removeTodo
  }
})