<script setup lang="ts">
import { ref, computed } from 'vue'

/**
 * 截圖元件：圖片放在 public/beginner/<file>。
 * 圖片還不存在時，顯示虛線占位框與預定檔名，截圖補上後自動換成圖片。
 *
 * 用法：<Shot file="b02-01-new-repo-dialog.png" desc="File → New repository 對話框" />
 */
const props = withDefaults(defineProps<{
  file: string
  desc?: string
  width?: string
  ratio?: string // 占位框長寬比，預設 1280 / 800
}>(), {
  desc: '',
  width: '100%',
  ratio: '1280 / 800',
})

const failed = ref(false)
const src = computed(() => `${import.meta.env.BASE_URL}beginner/${props.file}`)
</script>

<template>
  <figure class="shot" :style="{ width }">
    <img
      v-if="!failed"
      :src="src"
      :alt="desc || file"
      class="shot-img"
      @error="failed = true"
    >
    <div v-else class="shot-placeholder" :style="{ aspectRatio: ratio }">
      <div class="shot-icon">📷</div>
      <div class="shot-desc">{{ desc || '截圖' }}</div>
      <code class="shot-file">public/beginner/{{ file }}</code>
    </div>
  </figure>
</template>

<style scoped>
.shot {
  margin: 0;
}
.shot-img {
  display: block;
  max-width: 100%;
  max-height: 300px;
  width: auto;
  margin-left: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}
.shot-placeholder {
  width: 100%;
  max-height: 300px;
  border: 2px dashed #d97706;
  border-radius: 8px;
  background: repeating-linear-gradient(45deg, #fffbeb, #fffbeb 12px, #fff8f0 12px, #fff8f0 24px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  color: #92400e;
  text-align: center;
  padding: 0.5rem;
}
.shot-icon {
  font-size: 1.8rem;
}
.shot-desc {
  font-weight: 700;
}
.shot-placeholder .shot-file {
  font-size: 0.72rem !important;
}
</style>
