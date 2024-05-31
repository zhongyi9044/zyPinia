import { effectScope, ref } from "vue"
import { piniaSymbol } from "./global"

export default function createPinia() {
  const store = new Map()
  const scope = effectScope(true)
  const state = scope.run(() => ref({}))
  const plugins = []
  function use(cb) {
    plugins.push(cb)
  }
  return {
    install,
    use,
    store,
    scope,
    state,
    plugins
  }
}
function install(app) {
  app.provide(piniaSymbol, this)
}