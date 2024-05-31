import { isRef } from "vue";

export function formatArgs(args) {
  let id;
  let options;
  let setup;
  if (isString(args[0])) {
    id = args[0]
    if (isFunction(args[1])) {
      setup = args[1]
    } else {
      options = args[1]
    }
  } else {
    options = args[0]
    id = args[0].id
  }

  return {
    id,
    options,
    setup
  }
}

export function isString(value) {
  return typeof value === 'string'
}

export function isFunction(value) {
  return typeof value === 'function'
}

export function isComputed(value) {
  return !!(isRef(value) && value.effect)
}

export function isObject(value) {
  return typeof value === 'object' && value != null
}

export function mergeObject(targetState, newState) {
  for (let k in newState) {
    const oldValue = targetState[k]
    const newValue = newState[k]

    if (isObject(oldValue) && isObject(newValue)) {
      targetState[k] = mergeObject(oldValue, newValue)

    } else {
      targetState[k] = newValue
    }
  }
}

export const subscription = {
  add(list, cb) {
    list.push(cb)
  },
  triggle(list, ...args) {
    list.forEach(cb => cb(...args))
  }
}