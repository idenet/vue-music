import {
  h,
  mergeProps,
  renderSlot,
  withCtx,
  ref,
  computed,
  watch,
  nextTick,
} from 'vue'
import Scroll from '../base/scroll/scroll.vue'
import { usePlayerStore } from '../../store/index'

export default {
  name: 'wrap-scroll',
  props: Scroll.props,
  emits: Scroll.emits,
  render(ctx: any) {
    return h(
      Scroll,
      mergeProps(
        {
          ref: 'scrollRef',
        },
        ctx.$props,
        {
          onScroll: (e: any) => {
            ctx.$emit('scroll', e)
          },
        }
      ),
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, 'default')]
        }),
      }
    )
  },
  setup() {
    const scrollRef = ref<any>(null)
    const scroll = computed(() => {
      return scrollRef.value.scroll
    })

    const store = usePlayerStore()
    const playlist = computed(() => store.playList)

    watch(playlist, async () => {
      await nextTick()
      scroll.value.refresh()
    })

    return {
      scrollRef,
      scroll,
    }
  },
}
