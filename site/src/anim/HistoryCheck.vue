<script setup lang="ts">
/**
 * 每章結尾的「檢查點」：模擬 GitHub Desktop 的 History 分頁，
 * 讓學生對照自己畫面上的 commit 是否一樣（最新的在最上面）。
 *
 * 用法：
 * <HistoryCheck repo="my-profile" branch="main" :commits="[
 *   '忽略個人筆記 notes.txt',
 *   '新增興趣清單',
 *   { text: 'Initial commit', note: 'Desktop 自動建立' },
 * ]" />
 *
 * commits 每一項可以是字串，或 { text, note?, tag?, highlight? }
 *   tag：右側小標籤，例如 '↑ 未 Push'、'Merge'
 *   highlight：本章新增的 commit 會以橘色標示
 */
type Commit = string | { text: string, note?: string, tag?: string, highlight?: boolean }

const props = withDefaults(defineProps<{
  commits: Commit[]
  repo?: string
  branch?: string
}>(), {
  repo: 'my-profile',
  branch: 'main',
})

const norm = (c: Commit) => (typeof c === 'string' ? { text: c } : c)
</script>

<template>
  <div class="hc">
    <div class="hc-bar">
      <div class="hc-cell">
        <div class="hc-label">Current repository</div>
        <div class="hc-value">{{ repo }}</div>
      </div>
      <div class="hc-cell">
        <div class="hc-label">Current branch</div>
        <div class="hc-value">⑂ {{ branch }}</div>
      </div>
    </div>
    <div class="hc-tabs">
      <span>Changes</span>
      <span class="hc-tab-active">History</span>
    </div>
    <div
      v-for="(c, i) in props.commits.map(norm)"
      :key="i"
      class="hc-row"
      :class="{ 'hc-row-hl': c.highlight }"
    >
      <div class="hc-text">{{ c.text }}</div>
      <div class="hc-meta">
        <span v-if="c.note" class="hc-note">{{ c.note }}</span>
        <span v-if="c.tag" class="hc-tag">{{ c.tag }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hc {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  text-align: left;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
}
.hc-bar {
  display: flex;
  background: #24292f;
  color: #fff;
}
.hc-cell {
  padding: 0.35rem 0.9rem;
  border-right: 1px solid #3d444d;
  min-width: 170px;
}
.hc-label {
  font-size: 0.62rem !important;
  color: #9198a1;
}
.hc-value {
  font-size: 0.85rem !important;
  font-weight: 600;
}
.hc-tabs {
  display: flex;
  border-bottom: 1px solid #d1d5db;
}
.hc-tabs span {
  flex: 1;
  text-align: center;
  padding: 0.3rem 0;
  font-size: 0.8rem;
  color: #57606a;
}
.hc-tabs .hc-tab-active {
  color: #1f2328;
  font-weight: 700;
  box-shadow: inset 0 -2px 0 #fd8c73;
}
.hc-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.6rem;
  padding: 0.4rem 0.9rem;
  border-bottom: 1px solid #eaeef2;
}
.hc-row:last-child {
  border-bottom: none;
}
.hc-row-hl {
  background: #fff8f0;
  box-shadow: inset 3px 0 0 #d97706;
}
.hc-text {
  font-size: 0.88rem !important;
  font-weight: 600;
  color: #1f2328;
}
.hc-meta {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  flex-shrink: 0;
}
.hc-note {
  font-size: 0.7rem !important;
  color: #8c959f;
}
.hc-tag {
  font-size: 0.68rem !important;
  color: #92400e;
  background: #fef3c7;
  border-radius: 999px;
  padding: 0.05rem 0.5rem;
}
</style>
