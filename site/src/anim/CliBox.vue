<script setup lang="ts">
/**
 * 「💻 CLI 對照」小框：放在操作投影片右欄的最下方（截圖下面），靠右對齊。
 * CLI 只求認得、不要求操作。
 *
 * 用法：<CliBox :cmds="['git add index.html']" note="把檔案放進暫存區" />
 *       指令裡要用雙引號時寫成 &quot;
 */
withDefaults(defineProps<{
  cmds: string[]
  note?: string
}>(), {
  note: '',
})
</script>

<template>
  <div class="cli-wrap">
    <div class="cli-box">
      <div class="cli-title">💻 CLI 對照</div>
      <div v-for="c in cmds" :key="c" class="cli-cmd">$ {{ c }}</div>
      <div v-if="note" class="cli-note">{{ note }}</div>
    </div>
  </div>
</template>

<style scoped>
.cli-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.6rem;
}
.cli-box {
  background: #1f2937;
  border-radius: 8px;
  padding: 0.45rem 0.8rem 0.5rem;
  max-width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
  text-align: left;
}
.cli-title {
  font-size: 0.68rem !important;
  color: #fbbf24;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 0.15rem;
}
.cli-cmd {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.78rem !important;
  color: #f9fafb;
  white-space: pre-wrap;
  line-height: 1.5;
}
.cli-note {
  font-size: 0.68rem !important;
  color: #9ca3af;
  margin-top: 0.15rem;
}
</style>
