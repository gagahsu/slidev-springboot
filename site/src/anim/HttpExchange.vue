<script setup lang="ts">
import { ref } from 'vue'
import { useFixedSteps } from '../lib/steps'
import { usePoses } from './poses'

// One HTTP round trip for chapter 13: the request travels to the server, the response travels back.
const root = ref<HTMLElement>()
const { local, animated } = useFixedSteps(4)

usePoses(root, local, {
  req: [{ x: 150, y: 40, opacity: 0, scale: 0.7 }, { x: 150, y: 40 }, { x: 560, y: 150, opacity: 0, scale: 0.3 }],
  res: [{ x: 560, y: 150, opacity: 0, scale: 0.3 }, { x: 560, y: 150, opacity: 0, scale: 0.3 }, { x: 560, y: 150, opacity: 0, scale: 0.3 }, { x: 400, y: 50 }, { x: 150, y: 50 }],
}, animated)

const captions = [
  '前端想跟後端要資料，但兩邊要先講好「格式」',
  '前端把需求寫成 Http Request：四個部分',
  'Request 送到後端，後端依照內容處理',
  '後端把結果寫成 Http Response：三個部分',
  'Response 回到前端，一次請求完成',
]
</script>

<template>
  <div ref="root" class="anim-stage http-exchange" :class="`s${local}`">
    <div class="node client" :class="{ done: local >= 4 }"><b>前端</b><small>瀏覽器 / Postman</small></div>
    <div class="node server" :class="{ busy: local === 2 }"><b>後端</b><small>Spring Boot</small></div>
    <div class="wire" />

    <div class="msg req" data-actor="req">
      <h5>Http Request <i>前端 → 後端</i></h5>
      <dl>
        <div><dt>Method</dt><dd>GET</dd></div>
        <div><dt>URL</dt><dd>http://localhost:8080/test</dd></div>
        <div><dt>Header</dt><dd>Content-Type: application/json</dd></div>
        <div><dt>Body</dt><dd class="none">（GET 不帶 Body）</dd></div>
      </dl>
    </div>
    <div class="msg res" data-actor="res">
      <h5>Http Response <i>後端 → 前端</i></h5>
      <dl>
        <div><dt>Status</dt><dd>200 OK</dd></div>
        <div><dt>Header</dt><dd>Content-Type: text/plain</dd></div>
        <div><dt>Body</dt><dd>Hello World</dd></div>
      </dl>
    </div>

    <p class="caption"><span>{{ local + 1 }}</span>{{ captions[local] }}</p>
  </div>
</template>

<style>
.http-exchange .node { position: absolute; top: 96px; width: 128px; height: 108px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 3px solid var(--c-blue); border-radius: 22px; box-shadow: 0 5px 0 var(--c-blue-dark); background: #fff; transition: border-color .3s, box-shadow .3s, background .3s; }
.http-exchange .node b { font-size: 21px; font-weight: 900; color: #2b2b2b; }
.http-exchange .node small { color: var(--c-ink-soft); font-size: 12.5px; font-weight: 700; }
.http-exchange .client { left: 0; }
.http-exchange .server { right: 0; border-color: var(--c-brand); box-shadow: 0 5px 0 var(--c-brand-dark); }
.http-exchange .server.busy { background: #f1fde6; animation: http-busy .7s ease-in-out infinite alternate; }
.http-exchange .client.done { background: var(--c-blue-soft); }
@keyframes http-busy { to { transform: scale(1.06); } }
.http-exchange .wire { position: absolute; left: 128px; right: 128px; top: 148px; border-top: 4px dashed var(--c-line); }
.http-exchange .msg { position: absolute; left: 0; top: 0; width: 330px; padding: 10px 14px 12px; border: 3px solid #ff9600; border-radius: 18px; box-shadow: 0 5px 0 #cd7900; background: #fff; transform-origin: 50% 50%; }
.http-exchange .msg.res { border-color: var(--c-brand); box-shadow: 0 5px 0 var(--c-brand-dark); }
.http-exchange .msg h5 { margin: 0 0 6px; font-size: 16px; font-weight: 900; color: #2b2b2b; }
.http-exchange .msg h5 i { margin-left: 6px; color: var(--c-ink-soft); font-size: 12px; font-style: normal; font-weight: 800; }
.http-exchange .msg dl { margin: 0; }
.http-exchange .msg dl div { display: flex; align-items: baseline; gap: 8px; padding: 3px 0; }
.http-exchange .msg dt { flex: none; width: 62px; padding: 1px 0; border-radius: 7px; background: #ffeccf; color: #a35f00; font-size: 12px; font-weight: 900; text-align: center; }
.http-exchange .msg.res dt { background: #e5f9d3; color: var(--c-brand-dark); }
.http-exchange .msg dd { margin: 0; font: 700 13px/1.5 var(--font-mono); color: #2b2b2b; overflow-wrap: anywhere; }
.http-exchange .msg dd.none { color: var(--c-muted); font-family: var(--font-sans); }
</style>
