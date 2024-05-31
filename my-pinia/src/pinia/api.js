import { mergeObject, subscription } from "./utils"
import { watch } from "vue"

export function createPatch(pinia, id) {
  return function $patch(stateOrFn) {
    if (typeof stateOrFn === 'function') {
      stateOrFn(pinia.state.value[id])
    } else {
      mergeObject(pinia.state.value[id], stateOrFn)
    }
  }
}

export function createReset(store, stateFn) {
  return function $reset() {
    const initalState = stateFn ? stateFn() : {}
    store.$patch(state => {
      Object.assign(state, initalState)
    })
  }
}

export function createSubscribe(pinia, id, scope) {
  return function $subscribe(callback, options = {}) {
    scope.run(() =>
      watch(pinia.state.value[id], state => { callback({ storeId: id }, state), options })
    )
  }
}

export let actionList = []

export function createOnAction() {
  return function $onAction(cb) {
    subscription.add(actionList, cb)
  }
}

export function createDispose(pinia, id, scope) {
  return function $dispose() {
    actionList = []
    pinia.store.delete(id)
    scope.stop()
  }
}

export function createState(pinia, id) {
  const store = pinia.store.get(id)
  Object.defineProperty(store, '$state', {
    get: () => pinia.state.value[id],
    set: (newState) => store.$patch(state => Object.assign(state, newState))
  })
}