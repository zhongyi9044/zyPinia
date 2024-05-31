<template>
  <div>
    <h1>count:{{ store.count }}</h1>
    <h1>doubleCount:{{ store.doubleCount }}</h1>
    <button @click="handleChangeClick">change</button>
    <button @click="handleResetClick">Reset</button>
    <button @click="handleDisposeClick">Dispose</button>
    <button @click="handleStateClick">State</button>
  </div>
</template>

<script setup>
import useStore from '../store/todoList1'
const store = useStore()
let a = 0
const handleChangeClick = () => {
  store.$patch({
    count: ++a
  })
}
const handleResetClick = () => {
  store.$reset()
}
const handleDisposeClick=()=>{
  store.$dispose()
}
const handleStateClick=()=>{
  store.$state={
    count:18000,
    todoList:[
      {
        id:1,
        content:'aa',
        completed:true
      }
    ]
  }
}
store.$subscribe((info, state) => {

})
</script>

<style scoped></style>
