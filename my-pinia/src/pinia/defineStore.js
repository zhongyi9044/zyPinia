import { computed, effectScope, inject, isReactive, isRef, reactive, ref, toRef, toRefs } from "vue";
import { formatArgs, isComputed, isFunction, subscription } from "./utils";
import { actionList, createDispose, createOnAction, createPatch, createReset, createState, createSubscribe } from "./api";
import { piniaSymbol } from "./global";
piniaSymbol

export default function defineStore(...args) {
  const { id, options, setup } = formatArgs(args)
  const isSetup = isFunction(setup)
  function useStore() {
    const pinia = inject(piniaSymbol)
    if (!pinia.store.has(id)) {
      if (isSetup) {
        createSetipStore(pinia, id, setup)
      } else {
        createOptions(pinia, id, options)
      }
    }
    return pinia.store.get(id)
  }
  return useStore
}

function createSetipStore(pinia, id, setup) {
  const setupStore = setup()
  let store
  let storeScope
  const result = pinia.scope.run(() => {
    storeScope = effectScope()
    store = reactive(createApis(pinia, id, storeScope))
    return storeScope.run(() => complieSetup(pinia, id, setupStore))
  })

  return setStore(pinia, store, id, result)
}

function complieSetup(pinia, id, setupStore) {
  !pinia.state.value[id] && (pinia.state.value[id] = {})
  for (let key in setupStore) {
    const el = setupStore[key]
    if ((isRef(el) && !isComputed(el)) || isReactive(el)) {
      pinia.state.value[id][key] = el
    }
  }
  return {
    ...setupStore
  }
}

function createOptions(pinia, id, options) {
  let store
  let storeScope
  const result = pinia.scope.run(() => {
    storeScope = effectScope()
    store = reactive(createApis(pinia, id, storeScope))
    return storeScope.run(() => complieOptions(pinia, id, options, store))
  })

  return setStore(pinia, store, id, result, options.state)
}

function setStore(pinia, store, id, result, state) {
  store.$id = id
  state && (store.$reset = createReset(store, state))
  Object.assign(store, result)
  pinia.store.set(id, store)
  createState(pinia, id)
  runPlugins(pinia, store)
  return store
}

function complieOptions(pinia, id, { state, getters, actions }, store) {
  const storeState = createStoreState(pinia, id, state)
  const storeGetters = createStoreGetter(store, getters)
  const storeActions = createStoreActions(store, actions)
  return {
    ...storeState,
    ...storeGetters,
    ...storeActions
  }
}

function createStoreState(pinia, id, state) {
  const _state = pinia.state.value[id] = state ? state() : {}
  return toRefs(pinia.state.value[id])
}

function createStoreGetter(store, getters) {
  return Object.keys(getters || {}).reduce((wrapper, getterName) => {
    wrapper[getterName] = computed(() => getters[getterName].call(store))
    return wrapper
  }, {})
}

function createStoreActions(store, actions) {
  const storeActions = {}
  for (let actionName in actions) {
    storeActions[actionName] = function () {
      const afterList = []
      const errorList = []
      let res
      subscription.triggle(actionList, { after, onError })
      try {
        res = actions[actionName].apply(store, arguments)
      } catch {
        subscription.triggle(errorList, err)
      }
      if (res instanceof Promise) {
        return res.then(r => {
          return subscription.triggle(afterList, r)
        }).catch(e => {
          subscription.triggle(errorList, e)
          return Promise.reject(e)
        })
      }
      subscription.triggle(afterList, res)
      return res
      function after(cb) {
        afterList.push(cb)
      }
      function onError(cb) {
        errorList.push(cb)
      }
    }
  }
  return storeActions
}

function createApis(pinia, id, scope) {
  return {
    $patch: createPatch(pinia, id),
    $subscribe: createSubscribe(pinia, id, scope),
    $onAction: createOnAction(),
    $dispose: createDispose(pinia, id, scope),
  }
}

function runPlugins(pinia, store) {
  pinia.plugins.forEach(plugin => {
    const res = plugin({ store })
    if (res) {
      Object.assign(store, res)
    }
  })
}