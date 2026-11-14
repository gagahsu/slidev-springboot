<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{ code: string }>()
const svg = ref('')
const failed = ref(false)
let seq = 0

onMounted(async () => {
  try {
    const { default: mermaid } = await import('mermaid')
    mermaid.initialize({ startOnLoad: false, theme: 'neutral', fontFamily: 'inherit' })
    const out = await mermaid.render(`mmd-${Date.now()}-${seq++}`, decodeURIComponent(props.code))
    svg.value = out.svg
  }
  catch {
    failed.value = true
  }
})
</script>

<template>
  <div v-if="!failed" class="mermaid-box" v-html="svg" />
  <pre v-else class="mermaid-box">{{ decodeURIComponent(code) }}</pre>
</template>
