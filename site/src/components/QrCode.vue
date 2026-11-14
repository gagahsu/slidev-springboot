<script setup lang="ts">
import QRCode from 'qrcode'
import { ref, watchEffect } from 'vue'

const props = defineProps<{ text: string }>()
const svg = ref('')
watchEffect(async () => {
  try { svg.value = await QRCode.toString(props.text, { type: 'svg', margin: 1, errorCorrectionLevel: 'M' }) }
  catch { svg.value = '' }
})
</script>

<template>
  <div class="qr" role="img" aria-label="QR code" v-html="svg" />
</template>

<style>
.qr { background: #fff; line-height: 0; }
.qr svg { display: block; width: 100%; height: auto; }
</style>
