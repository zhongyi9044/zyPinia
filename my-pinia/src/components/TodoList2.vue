<template>
  <div>
    <div>
      <input type="text" v-model="todoText">
      <button @click="addTodo">Add</button>
      <p>{{ store.length }}条</p>
    </div>
    <ul>
      <li v-for="todo in store.todoList" :key="todo.id">

        <input type="checkbox" :checked="todo.completed" @click="store.toggleTodo(todo.id)">

        <span :style="{ textDecoration: todo.completed ? 'line-through' : '' }">{{ todo.content }}</span>

        <button @click="store.removeTodo(todo.id)">Remove</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import useTodoListStore from '../store/todoList2'
import { ref } from 'vue';
const store = useTodoListStore()
const todoText = ref('')
const addTodo = () => {
  if (!todoText.value.length) {
    return
  }
  const todo = {
    id: new Date().getTime(),
    content: todoText.value,
    completed: false
  }
  store.addTodo(todo)
  todoText.value = ''
}

</script>


<style scoped></style>
