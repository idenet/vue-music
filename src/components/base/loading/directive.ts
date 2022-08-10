import { Component, createApp, DirectiveBinding } from 'vue'
import Loading from './loading.vue'
// import createLoadingLikeDirective from '@/assets/js/create-loading-like-directive'
import { addClass, removeClass } from '../../../assets/js/dom'

// const loadingDirective = createLoadingLikeDirective(Loading)

// export default loadingDirective

const relativeCls = 'g-relative'

interface elType extends Element {
  instance: Component
}

const loadingirective = {
  mounted(el: elType, binding: DirectiveBinding) {
    const app = createApp(Loading)
    const instance: Component = app.mount(document.createElement('div'))
    el.instance = instance
    console.log(instance)

    const title = binding.arg

    if (typeof title !== 'undefined') {
      instance.setTitle(title)
    }

    if (binding.value) {
      append(el)
    }
  },
  updated(el: any, binding: any) {
    const title = binding.arg

    if (typeof title !== 'undefined') {
      el.instance.setTitle(title)
    }
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

function append(el: any) {
  const style = getComputedStyle(el)
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    addClass(el, relativeCls)
  }
  el.appendChild(el.instance.$el)
}

function remove(el: any) {
  removeClass(el, relativeCls)
  el.removeChild(el.instance.$el)
}

export default loadingirective
