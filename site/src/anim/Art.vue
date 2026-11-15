<script setup lang="ts">
// Small flat illustrations used by the story scenes. <Art name="tent" size="120" />
defineProps<{ name: string, size?: number | string }>()
</script>

<template>
  <svg class="art" :class="`art-${name}`" viewBox="0 0 100 100" :style="size ? { width: `${size}px`, height: `${size}px` } : undefined" aria-hidden="true">
    <!-- people -->
    <g v-if="name === 'you' || name === 'customer' || name === 'clerk' || name === 'staff' || name === 'teacher'">
      <path d="M18 100 Q18 56 50 56 Q82 56 82 100Z" :fill="{ you: '#1cb0f6', customer: '#ff9600', clerk: '#58cc02', staff: '#ce82ff', teacher: '#ff86d0' }[name]" />
      <path v-if="name === 'clerk'" d="M34 62 H66 V100 H34Z" fill="#fff" opacity=".9" />
      <path v-if="name === 'staff'" d="M47 58 H53 V100 H47Z" fill="#fff" opacity=".85" />
      <circle cx="50" cy="34" r="20" fill="#ffd9b3" />
      <path v-if="name === 'you'" d="M30 32 Q30 12 50 12 Q70 12 70 32 Q60 22 50 24 Q40 22 30 32Z" fill="#6b4226" />
      <path v-if="name === 'customer'" d="M29 36 Q26 10 50 11 Q74 10 71 36 Q66 22 50 22 Q34 22 29 36Z" fill="#2b2b2b" />
      <path v-if="name === 'teacher'" d="M30 30 Q32 10 50 12 Q68 10 70 30 Q60 20 50 22 Q40 20 30 30Z" fill="#8a5a3c" />
      <g v-if="name === 'clerk'"><path d="M30 26 Q30 10 50 10 Q70 10 70 26Z" fill="#46a302" /><rect x="26" y="24" width="40" height="6" rx="3" fill="#46a302" /></g>
      <g v-if="name === 'staff'"><rect x="34" y="8" width="32" height="12" rx="4" fill="#a568cc" /><rect x="30" y="18" width="40" height="5" rx="2.5" fill="#a568cc" /></g>
      <g v-if="name === 'teacher'" fill="none" stroke="#2b2b2b" stroke-width="2"><circle cx="42" cy="35" r="6" /><circle cx="58" cy="35" r="6" /><path d="M48 35h4" /></g>
      <circle cx="42" cy="35" r="2.4" fill="#2b2b2b" /><circle cx="58" cy="35" r="2.4" fill="#2b2b2b" />
      <path d="M43 43 Q50 49 57 43" fill="none" stroke="#b5651d" stroke-width="2.4" stroke-linecap="round" />
    </g>

    <!-- camping -->
    <g v-else-if="name === 'tent' || name === 'tent-big'">
      <ellipse cx="50" cy="88" rx="46" ry="7" fill="#b7e88a" />
      <path d="M8 88 L50 14 L92 88Z" :fill="name === 'tent' ? '#ff9600' : '#ff4b4b'" />
      <path d="M36 88 L50 46 L64 88Z" :fill="name === 'tent' ? '#cd7900' : '#c62828'" />
      <path d="M50 14 V6" stroke="#8b9aa3" stroke-width="3" stroke-linecap="round" />
    </g>
    <g v-else-if="name === 'backpack'">
      <path d="M38 22 Q38 10 50 10 Q62 10 62 22" fill="none" stroke="#1899d6" stroke-width="6" />
      <rect x="24" y="20" width="52" height="70" rx="16" fill="#1cb0f6" />
      <rect x="32" y="52" width="36" height="28" rx="8" fill="#1899d6" />
      <rect x="44" y="60" width="12" height="5" rx="2.5" fill="#fff" />
    </g>
    <g v-else-if="name === 'pot'">
      <rect x="8" y="46" width="14" height="8" rx="4" fill="#5f6f78" /><rect x="78" y="46" width="14" height="8" rx="4" fill="#5f6f78" />
      <path d="M18 42 H82 V74 Q82 88 68 88 H32 Q18 88 18 74Z" fill="#8b9aa3" />
      <rect x="14" y="34" width="72" height="10" rx="5" fill="#5f6f78" /><rect x="44" y="24" width="12" height="10" rx="4" fill="#5f6f78" />
    </g>
    <g v-else-if="name === 'stove'">
      <path d="M50 14 Q68 36 50 56 Q32 36 50 14Z" fill="#ff9600" /><path d="M50 30 Q59 42 50 54 Q41 42 50 30Z" fill="#ffc800" />
      <rect x="22" y="54" width="56" height="8" rx="4" fill="#5f6f78" />
      <rect x="14" y="62" width="72" height="28" rx="8" fill="#2f4550" /><circle cx="32" cy="76" r="5" fill="#ff4b4b" /><circle cx="50" cy="76" r="5" fill="#8b9aa3" />
    </g>

    <!-- hotel -->
    <g v-else-if="name === 'hotel'">
      <rect x="18" y="14" width="64" height="78" rx="6" fill="#ce82ff" /><rect x="12" y="8" width="76" height="10" rx="5" fill="#a568cc" />
      <g fill="#fff5cc"><rect x="27" y="26" width="12" height="12" rx="2" /><rect x="44" y="26" width="12" height="12" rx="2" /><rect x="61" y="26" width="12" height="12" rx="2" /><rect x="27" y="46" width="12" height="12" rx="2" /><rect x="44" y="46" width="12" height="12" rx="2" /><rect x="61" y="46" width="12" height="12" rx="2" /></g>
      <path d="M40 92 V72 Q40 66 50 66 Q60 66 60 72 V92Z" fill="#7d3fb0" />
    </g>
    <g v-else-if="name === 'bed'">
      <rect x="8" y="30" width="10" height="56" rx="4" fill="#8a5a3c" /><rect x="82" y="50" width="10" height="36" rx="4" fill="#8a5a3c" />
      <rect x="14" y="52" width="74" height="22" rx="6" fill="#fff" stroke="#e5e5e5" stroke-width="2" />
      <rect x="20" y="42" width="24" height="14" rx="6" fill="#ddf4ff" /><path d="M46 52 H88 V74 H46Z" fill="#1cb0f6" />
    </g>
    <g v-else-if="name === 'towel' || name === 'towel-dirty'">
      <rect x="16" y="56" width="68" height="22" rx="8" :fill="name === 'towel' ? '#84d8ff' : '#b9a58c'" />
      <rect x="20" y="36" width="60" height="22" rx="8" :fill="name === 'towel' ? '#ddf4ff' : '#d6c7b0'" />
      <rect x="24" y="18" width="52" height="20" rx="8" :fill="name === 'towel' ? '#84d8ff' : '#b9a58c'" />
      <g v-if="name === 'towel-dirty'" fill="#7a6248"><circle cx="38" cy="46" r="4" /><circle cx="58" cy="66" r="5" /><circle cx="60" cy="28" r="3" /></g>
    </g>
    <g v-else-if="name === 'brush'">
      <rect x="44" y="34" width="12" height="58" rx="6" fill="#2bd9b9" /><rect x="40" y="8" width="20" height="26" rx="5" fill="#fff" stroke="#e5e5e5" stroke-width="2" />
      <path d="M45 14v14M50 14v14M55 14v14" stroke="#84d8ff" stroke-width="2.5" stroke-linecap="round" />
    </g>

    <!-- printing at home / at the store -->
    <g v-else-if="name === 'store'">
      <rect x="8" y="30" width="84" height="62" rx="6" fill="#fff" stroke="#e5e5e5" stroke-width="2" />
      <rect x="4" y="14" width="92" height="20" rx="5" fill="#58cc02" /><rect x="4" y="27" width="92" height="7" fill="#ff9600" />
      <rect x="16" y="42" width="30" height="24" rx="3" fill="#ddf4ff" /><rect x="54" y="42" width="30" height="50" rx="3" fill="#ddf4ff" stroke="#84d8ff" stroke-width="2" />
      <path d="M69 44 V90" stroke="#84d8ff" stroke-width="2" /><rect x="16" y="72" width="30" height="6" rx="3" fill="#ffc800" />
    </g>
    <g v-else-if="name === 'paper'">
      <rect x="26" y="30" width="56" height="62" rx="4" fill="#e5e5e5" transform="rotate(6 54 61)" />
      <rect x="22" y="24" width="56" height="62" rx="4" fill="#f7f7f7" stroke="#d6d6d6" stroke-width="2" transform="rotate(-4 50 55)" />
      <rect x="20" y="16" width="56" height="66" rx="4" fill="#fff" stroke="#d6d6d6" stroke-width="2" />
    </g>
    <g v-else-if="name === 'ink' || name === 'ink-empty'">
      <rect x="28" y="22" width="44" height="68" rx="10" fill="#fff" stroke="#8b9aa3" stroke-width="4" />
      <rect x="40" y="10" width="20" height="14" rx="4" fill="#8b9aa3" />
      <rect v-if="name === 'ink'" x="32" y="44" width="36" height="42" rx="7" fill="#1cb0f6" />
      <rect v-else x="32" y="78" width="36" height="8" rx="4" fill="#84d8ff" />
      <path v-if="name === 'ink'" d="M50 52 Q58 62 50 70 Q42 62 50 52Z" fill="#fff" opacity=".85" />
    </g>
    <g v-else-if="name === 'doc'">
      <rect x="20" y="8" width="60" height="84" rx="6" fill="#fff" stroke="#1cb0f6" stroke-width="4" />
      <rect x="30" y="20" width="26" height="7" rx="3.5" fill="#1cb0f6" /><path d="M30 38h40M30 50h40M30 62h28" stroke="#d6d6d6" stroke-width="5" stroke-linecap="round" />
      <circle cx="66" cy="76" r="11" fill="#58cc02" /><path d="M60 76 L65 81 L73 71" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    </g>

    <!-- school / code world -->
    <g v-else-if="name === 'printer' || name === 'printer2'">
      <rect x="28" y="12" width="44" height="30" rx="4" fill="#fff" stroke="#e5e5e5" stroke-width="2" />
      <rect x="10" y="36" width="80" height="38" rx="10" :fill="name === 'printer' ? '#ffc800' : '#ce82ff'" />
      <rect x="26" y="62" width="48" height="28" rx="4" fill="#fff" stroke="#e5e5e5" stroke-width="2" /><path d="M34 72h32M34 80h22" stroke="#afafaf" stroke-width="3" stroke-linecap="round" />
      <circle cx="78" cy="48" r="4" fill="#58cc02" />
    </g>
    <g v-else-if="name === 'spring'">
      <circle cx="50" cy="50" r="42" fill="#58cc02" />
      <path d="M72 26 Q76 60 52 70 Q38 76 28 68 Q52 66 60 44 Q46 60 28 58 Q30 34 72 26Z" fill="#fff" />
    </g>
    <g v-else-if="name === 'code'">
      <rect x="8" y="16" width="84" height="68" rx="12" fill="#2f4550" /><path d="M38 38 L24 50 L38 62M62 38 L76 50 L62 62M54 34 L46 66" fill="none" stroke="#84d8ff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <g v-else-if="name === 'browser'">
      <rect x="8" y="16" width="84" height="68" rx="10" fill="#fff" stroke="#1cb0f6" stroke-width="4" /><path d="M8 34h84" stroke="#1cb0f6" stroke-width="4" />
      <circle cx="20" cy="25" r="3.5" fill="#ff4b4b" /><circle cx="31" cy="25" r="3.5" fill="#ffc800" /><circle cx="42" cy="25" r="3.5" fill="#58cc02" />
      <rect x="20" y="44" width="44" height="7" rx="3.5" fill="#ddf4ff" /><rect x="20" y="58" width="60" height="7" rx="3.5" fill="#e5e5e5" /><rect x="20" y="70" width="34" height="7" rx="3.5" fill="#e5e5e5" />
    </g>
    <g v-else-if="name === 'server'">
      <rect x="16" y="10" width="68" height="24" rx="8" fill="#58cc02" /><rect x="16" y="38" width="68" height="24" rx="8" fill="#46a302" /><rect x="16" y="66" width="68" height="24" rx="8" fill="#58cc02" />
      <g fill="#fff"><circle cx="30" cy="22" r="4" /><circle cx="30" cy="50" r="4" /><circle cx="30" cy="78" r="4" /><rect x="44" y="19" width="28" height="6" rx="3" /><rect x="44" y="47" width="28" height="6" rx="3" /><rect x="44" y="75" width="28" height="6" rx="3" /></g>
    </g>

    <!-- drink shop -->
    <g v-else-if="name === 'shop'">
      <rect x="10" y="34" width="80" height="58" rx="6" fill="#fff5cc" />
      <path d="M6 14 H94 L88 38 H12Z" fill="#ff4b4b" /><path d="M22 14 H38 L36 38 H24ZM54 14 H70 L72 38 H60Z" fill="#fff" />
      <rect x="18" y="48" width="64" height="20" rx="4" fill="#ddf4ff" /><rect x="10" y="72" width="80" height="20" rx="4" fill="#d9a066" />
    </g>
    <g v-else-if="name === 'cup'">
      <path d="M58 4 L52 30" stroke="#ff86d0" stroke-width="6" stroke-linecap="round" />
      <path d="M26 30 H74 L67 92 Q66 96 62 96 H38 Q34 96 33 92Z" fill="#e8c39e" /><path d="M29 56 H71 L67 92 Q66 96 62 96 H38 Q34 96 33 92Z" fill="#c98f5a" />
      <rect x="20" y="22" width="60" height="10" rx="5" fill="#fff" stroke="#e5e5e5" stroke-width="2" />
      <g fill="#3b2a20"><circle cx="42" cy="86" r="4.5" /><circle cx="53" cy="88" r="4.5" /><circle cx="61" cy="80" r="4.5" /><circle cx="47" cy="77" r="4.5" /><circle cx="38" cy="76" r="4" /></g>
    </g>
    <g v-else-if="name === 'form'">
      <rect x="18" y="8" width="64" height="84" rx="8" fill="#fff" stroke="#ff9600" stroke-width="4" />
      <rect x="28" y="20" width="26" height="7" rx="3.5" fill="#ff9600" /><path d="M28 40h44M28 54h44M28 68h30" stroke="#d6d6d6" stroke-width="5" stroke-linecap="round" />
    </g>
    <g v-else-if="name === 'machine'">
      <rect x="20" y="10" width="60" height="80" rx="10" fill="#8b9aa3" /><rect x="30" y="20" width="40" height="24" rx="5" fill="#2f4550" />
      <rect x="40" y="54" width="20" height="26" rx="4" fill="#fff" /><circle cx="50" cy="48" r="3" fill="#ff4b4b" />
    </g>

    <!-- marks -->
    <g v-else-if="name === 'ok'"><circle cx="50" cy="50" r="42" fill="#58cc02" /><path d="M30 52 L45 66 L72 36" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" /></g>
    <g v-else-if="name === 'no'"><circle cx="50" cy="50" r="42" fill="#ff4b4b" /><path d="M34 34 L66 66M66 34 L34 66" stroke="#fff" stroke-width="11" stroke-linecap="round" /></g>
    <g v-else-if="name === 'what'"><circle cx="50" cy="50" r="42" fill="#ffc800" /><path d="M38 40 Q38 26 50 26 Q63 26 63 38 Q63 46 50 52 V58" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" /><circle cx="50" cy="73" r="6" fill="#fff" /></g>
    <circle v-else cx="50" cy="50" r="40" fill="#e5e5e5" />
  </svg>
</template>

<style>
.art { display: inline-block; width: 1.6em; height: 1.6em; vertical-align: -0.4em; flex: none; }
</style>
