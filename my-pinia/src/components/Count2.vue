<template>
  <div>
    <h1>count:{{ store.count }}</h1>
    <h1>doubleCount:{{ store.doubleCount }}</h1>
    <button @click="handleChangeClick">change</button>
  </div>
</template>

<script setup>
import useStore from '../store/todoList2'
import { ref } from 'vue';
const store = useStore()
let a = 0
const handleChangeClick = () => {
  store.$patch(state => {
    state.count = --a
  })
}
store.$subscribe((info,state)=>{
console.log('2')
})
</script>

<style scoped></style>
