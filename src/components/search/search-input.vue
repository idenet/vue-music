<template>
  <div class="search-input">
    <i class="icon-search"></i>
    <input
      class="input-inner"
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
    />
    <i v-show="modelValue" class="icon-dismiss" @click="clear"></i>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'
import { debounce } from 'throttle-debounce'

interface Props {
  modelValue: string
  placeholder?: string
}

const { modelValue, placeholder = '搜索歌曲、歌手' } = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'clear'])

const handleInput = debounce(300, (e: any) => {
  emit('update:modelValue', e.target.value.trim())
})

function clear() {
  emit('clear')
}
</script>

<style lang="scss" scoped>
.search-input {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 32px;
  background: $color-highlight-background;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: $color-text-d;
  }
  .input-inner {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: $color-text-d;
  }
}
</style>
