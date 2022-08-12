import { Component, createApp, DirectiveBinding } from 'vue'
import { addClass, removeClass } from './dom'

const relativeCls = 'g-relative'

interface elType extends Element {
  [name: string]: any
}

export default function createLoadingLikeDirective(Comp: Component) {
  function append(el: any) {
    const name = Comp.name as string
    const style = getComputedStyle(el)
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }
    el.appendChild(el[name].instance.$el)
  }

  function remove(el: any) {
    const name = Comp.name as string
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }
  return {
    mounted(el: elType, binding: DirectiveBinding) {
      const app = createApp(Comp)
      const instance: Component = app.mount(document.createElement('div'))
      // 在同一个地方使用2次，会导致后面的覆盖前面的
      // el.instance = instance

      const name = Comp.name as string
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance
      const title = binding.arg

      if (typeof title !== 'undefined') {
        instance.setTitle(title)
      }

      if (binding.value) {
        append(el)
      }
    },
    updated(el: any, binding: any) {
      const name = Comp.name as string
      const title = binding.arg

      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }
}
