<script setup lang="ts">
import { COLORS, SIZES, canRedo, canUndo, clearPage, draw, redo, strokesOf, undo, type Tool } from '../lib/draw'
import Icon from './Icon.vue'

defineProps<{ slideKey: string }>()

const tools: { id: Tool, icon: any, label: string, key?: string }[] = [
  { id: 'none', icon: 'cursor', label: '游標（不畫圖）' },
  { id: 'pen', icon: 'pen', label: '畫筆' },
  { id: 'marker', icon: 'marker', label: '螢光筆' },
  { id: 'arrow', icon: 'arrow', label: '箭頭' },
  { id: 'rect', icon: 'rect', label: '矩形' },
  { id: 'eraser', icon: 'eraser', label: '橡皮擦' },
  { id: 'laser', icon: 'laser', label: '雷射筆' },
]
const colorNames = ['紅', '橘', '綠', '藍', '紫', '黑']
const sizeNames = ['細', '中', '粗']
</script>

<template>
  <div class="draw-toolbar" role="toolbar" aria-label="畫圖工具">
    <div class="group">
      <button
        v-for="t in tools" :key="t.id" class="tool focusable" :class="{ on: draw.tool === t.id }"
        :title="t.label" :aria-label="t.label" :aria-pressed="draw.tool === t.id" @click="draw.tool = t.id"
      >
        <Icon :name="t.icon" />
      </button>
    </div>
    <div class="group">
      <button
        v-for="(c, n) in COLORS" :key="c" class="swatch focusable" :class="{ on: draw.color === c }"
        :style="{ '--c': c }" :title="`${colorNames[n]}色`" :aria-label="`${colorNames[n]}色`" :aria-pressed="draw.color === c" @click="draw.color = c"
      />
    </div>
    <div class="group">
      <button
        v-for="(s, n) in SIZES" :key="s" class="tool focusable" :class="{ on: draw.size === s }"
        :title="`粗細：${sizeNames[n]}`" :aria-label="`粗細：${sizeNames[n]}`" :aria-pressed="draw.size === s" @click="draw.size = s"
      >
        <i class="dot" :style="{ width: `${s + 3}px`, height: `${s + 3}px` }" />
      </button>
    </div>
    <div class="group">
      <button class="tool focusable" title="復原 (Ctrl+Z)" aria-label="復原" :disabled="!canUndo(slideKey)" @click="undo(slideKey)"><Icon name="undo" /></button>
      <button class="tool focusable" title="重做 (Ctrl+Shift+Z)" aria-label="重做" :disabled="!canRedo(slideKey)" @click="redo(slideKey)"><Icon name="redo" /></button>
      <button class="tool focusable" title="清除這一頁的筆跡" aria-label="清除這一頁的筆跡" :disabled="!strokesOf(slideKey).length" @click="clearPage(slideKey)"><Icon name="trash" /></button>
    </div>
  </div>
</template>

<style scoped>
.draw-toolbar { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; padding: 6px; border: 2px solid var(--c-line); border-radius: 18px; box-shadow: 0 4px 0 var(--c-line); background: var(--c-snow); overflow-x: auto; }
.group { display: flex; align-items: center; gap: 2px; padding: 0 6px; border-right: 2px solid var(--c-line); }
.group:last-child { border-right: 0; }
.tool { display: grid; place-items: center; width: 38px; height: 38px; border: 0; border-radius: 11px; background: none; color: var(--c-ink-soft); font-size: 17px; cursor: pointer; }
.tool:hover:not(:disabled) { background: var(--c-polar); }
.tool.on { background: var(--c-blue-soft); color: var(--c-blue-dark); box-shadow: inset 0 0 0 2px #84d8ff; }
.tool:disabled { opacity: .35; cursor: default; }
.dot { display: block; border-radius: 50%; background: currentColor; }
.swatch { width: 26px; height: 26px; margin: 0 3px; border: 3px solid var(--c-snow); border-radius: 50%; background: var(--c); box-shadow: 0 0 0 2px var(--c-line); cursor: pointer; }
.swatch.on { box-shadow: 0 0 0 3px var(--c); }
</style>
