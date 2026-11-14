<script setup lang="ts">
import { onMounted, provide, ref, watch } from 'vue'
import { CODE_GROUP } from './codeGroup'

// <CodeSteps> pairs a stepped code block with a list: the n-th list item is the caption of the n-th state.
const root = ref<HTMLElement>()
const state = ref(0)
provide(CODE_GROUP, { state })

onMounted(() => {
  const list = root.value!.querySelector(':scope > ul, :scope > ol')
  const items = list ? [...list.children] as HTMLElement[] : []
  list?.classList.add('captions')
  items.forEach((el, i) => el.setAttribute('data-n', `${i + 1}/${items.length}`))
  const apply = () => items.forEach((el, i) => el.classList.toggle('active', i === Math.min(state.value, items.length - 1)))
  apply()
  watch(state, apply)
})
</script>

<template>
  <div ref="root" class="code-steps"><slot /></div>
</template>
