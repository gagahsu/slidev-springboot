#!/bin/bash
H="http://localhost:8080"
j() { python3 -c "import sys,json;d=json.load(sys.stdin);$1"; }
req() { curl -s -w "\n[HTTP %{http_code}]" "$@"; }
echo "== 1 前台列表 (published only, 預設 10 筆)"; curl -s "$H/api/surveys" | j "print([ (s['id'],s['statusLabel']) for s in d['data']['content']], d['data']['totalElements'], d['data']['totalPages'])"
echo "== 2 分頁 size=2 page=1"; curl -s "$H/api/surveys?size=2&page=1" | j "print([s['id'] for s in d['data']['content']], d['data']['totalPages'])"
echo "== 3 搜尋 title=午餐"; curl -s -G "$H/api/surveys" --data-urlencode "title=午餐" | j "print([s['title'] for s in d['data']['content']])"
echo "== 3b 日期區間包含"; curl -s -G "$H/api/surveys" --data-urlencode "startDate=$(date -d '-6 day' +%F)" --data-urlencode "endDate=$(date -d '+12 day' +%F)" | j "print([s['id'] for s in d['data']['content']])"
echo "== 4 內頁"; curl -s "$H/api/surveys/2" | j "q=d['data']['questions'];print(d['data']['statusLabel'],[(x['title'],x['type'],[o['label'] for o in x['options']]) for x in q])"
echo "== 4b 未發佈的前台看不到"; req "$H/api/surveys/5"
echo "== 5 作答：暫存→讀取→送出"
CJ=cookies1.txt; rm -f $CJ
BODY='{"name":"測試員","phone":"0955123456","email":"t1@example.com","age":30,"answers":[{"questionId":1,"values":["輕食"]},{"questionId":2,"values":["青菜","豆腐"]},{"questionId":3,"values":["很好"]}]}'
req -b $CJ -c $CJ -H 'Content-Type: application/json' -d "$BODY" "$H/api/surveys/2/draft"
curl -s -b $CJ "$H/api/surveys/2/draft" | j "print(d['data']['name'],[a['values'] for a in d['data']['answers']])"
req -b $CJ -c $CJ -X POST "$H/api/surveys/2/submit"
echo "== 5b 同 Email 重複"; req -c cookies2.txt -H 'Content-Type: application/json' -d "$BODY" "$H/api/surveys/2/draft"
echo "== 5c 必填沒填"; req -H 'Content-Type: application/json' -d '{"name":"A","phone":"0955123456","email":"z@example.com","answers":[]}' "$H/api/surveys/2/draft"
echo "== 5d 格式錯誤"; req -H 'Content-Type: application/json' -d '{"name":"A","phone":"123","email":"bad","answers":[]}' "$H/api/surveys/2/draft"
echo "== 5e 尚未開始的問卷不能填"; req -H 'Content-Type: application/json' -d '{"name":"A","phone":"0955123456","email":"z@example.com","answers":[{"questionId":8,"values":["參加"]}]}' "$H/api/surveys/4/draft"
echo "== 6 統計 (進行中)"; curl -s "$H/api/surveys/2/statistics" | j "print(d['data']['totalResponses'],[(q['title'],[(o['label'],o['count'],o['percent']) for o in q['options']],q['texts']) for q in d['data']['questions']])"
echo "== 6b 統計 (尚未開始)"; req "$H/api/surveys/4/statistics"
echo "== 7 權限"; req "$H/api/admin/surveys"
UT=$(curl -s -H 'Content-Type: application/json' -d '{"email":"ming@example.com","password":"Passw0rd12"}' "$H/api/auth/login" | j "print(d['data']['accessToken'])")
echo "user token -> admin:"; req -H "Authorization: Bearer $UT" "$H/api/admin/surveys"
echo "== 8 登入失敗"; req -H 'Content-Type: application/json' -d '{"email":"ming@example.com","password":"wrong"}' "$H/api/auth/login"
AT=$(curl -s -H 'Content-Type: application/json' -d '{"email":"admin@example.com","password":"Passw0rd12"}' "$H/api/auth/login" | j "print(d['data']['accessToken'])")
echo "== 9 後台列表(含未發佈)"; curl -s -H "Authorization: Bearer $AT" "$H/api/admin/surveys" | j "print([(s['id'],s['statusLabel']) for s in d['data']['content']])"
S=$(date -d '+2 day' +%F); E=$(date -d '+7 day' +%F)
SV='{"title":"新問卷","description":"說明","startDate":"'$S'","endDate":"'$E'","questions":[{"title":"喜歡嗎","type":"SINGLE","required":true,"options":[{"label":"喜歡"},{"label":"不喜歡"}]},{"title":"建議","type":"TEXT","required":false,"options":[]}]}'
echo "== 10 後台暫存→確認頁讀取→儲存並發佈"
CJ2=cookies3.txt; rm -f $CJ2
req -b $CJ2 -c $CJ2 -H "Authorization: Bearer $AT" -H 'Content-Type: application/json' -d "$SV" "$H/api/admin/survey-draft"
curl -s -b $CJ2 -H "Authorization: Bearer $AT" "$H/api/admin/survey-draft" | j "print(d['data']['title'],len(d['data']['questions']))"
NEWID=$(curl -s -b $CJ2 -c $CJ2 -X POST -H "Authorization: Bearer $AT" "$H/api/admin/survey-draft/commit?publish=true" | j "print(d['data']['id'], d['data']['statusLabel'])")
echo "新增結果: $NEWID"
NID=${NEWID%% *}
echo "== 11 日期防呆 (今天開始)"; req -H "Authorization: Bearer $AT" -H 'Content-Type: application/json' -d "${SV/$S/$(date +%F)}" "$H/api/admin/surveys"
echo "== 11b 修改(尚未開始可改)"; curl -s -X PUT -H "Authorization: Bearer $AT" -H 'Content-Type: application/json' -d "${SV/新問卷/改過的問卷}" "$H/api/admin/surveys/$NID" | j "print(d['data']['title'],d['data']['statusLabel'])"
echo "== 11c 修改進行中 → 409"; req -X PUT -H "Authorization: Bearer $AT" -H 'Content-Type: application/json' -d "$SV" "$H/api/admin/surveys/2"
echo "== 12 批次刪除含進行中 → 409 (整批不刪)"; req -X DELETE -H "Authorization: Bearer $AT" -H 'Content-Type: application/json' -d "[$NID,2]" "$H/api/admin/surveys"
echo "== 12b 批次刪除 4,5,新"; req -X DELETE -H "Authorization: Bearer $AT" -H 'Content-Type: application/json' -d "[$NID,4,5]" "$H/api/admin/surveys"
curl -s -H "Authorization: Bearer $AT" "$H/api/admin/surveys" | j "print([s['id'] for s in d['data']['content']])"
echo "== 13 回饋列表(倒序)"; curl -s -H "Authorization: Bearer $AT" "$H/api/admin/surveys/2/responses" | j "print([(r['id'],r['name']) for r in d['data']['content']])"
echo "== 13b 回饋細節"; curl -s -H "Authorization: Bearer $AT" "$H/api/admin/responses/4" | j "print(d['data']['name'],[(a['questionTitle'],a['values']) for a in d['data']['answers']])"
echo "== 14 註冊 / 登入 / 登入者作答 / 我的紀錄 / refresh"
req -H 'Content-Type: application/json' -d '{"name":"新會員","email":"new@example.com","password":"Abcd1234","phone":"0966000111"}' "$H/api/auth/register"
req -H 'Content-Type: application/json' -d '{"name":"新會員","email":"new@example.com","password":"Abcd1234","phone":"0966000111"}' "$H/api/auth/register"
req -H 'Content-Type: application/json' -d '{"name":"新會員","email":"n2@example.com","password":"short","phone":"0966000111"}' "$H/api/auth/register"
LOGIN=$(curl -s -H 'Content-Type: application/json' -d '{"email":"new@example.com","password":"Abcd1234"}' "$H/api/auth/login")
NT=$(echo "$LOGIN" | j "print(d['data']['accessToken'])"); RT=$(echo "$LOGIN" | j "print(d['data']['refreshToken'])")
CJ4=cookies4.txt; rm -f $CJ4
B2='{"name":"新會員","phone":"0966000111","email":"new@example.com","answers":[{"questionId":7,"values":["剛好"]}]}'
curl -s -b $CJ4 -c $CJ4 -H 'Content-Type: application/json' -d "$B2" "$H/api/surveys/6/draft" >/dev/null
req -b $CJ4 -c $CJ4 -X POST -H "Authorization: Bearer $NT" "$H/api/surveys/6/submit"
curl -s -H "Authorization: Bearer $NT" "$H/api/users/me/responses" | j "print([(r['surveyId'],r['email']) for r in d['data']])"
curl -s -H "Authorization: Bearer $NT" "$H/api/users/me" | j "print(d['data'])"
req -X PUT -H "Authorization: Bearer $NT" -H 'Content-Type: application/json' -d '{"name":"改名","phone":"0966000222"}' "$H/api/users/me"
echo "refresh:"; curl -s -H 'Content-Type: application/json' -d "{\"refreshToken\":\"$RT\"}" "$H/api/auth/refresh" | j "print(d['code'])"
echo "access token 拿來 refresh (應失敗):"; req -H 'Content-Type: application/json' -d "{\"refreshToken\":\"$NT\"}" "$H/api/auth/refresh"
echo "壞 token:"; req -H "Authorization: Bearer xxx" "$H/api/users/me"
echo "== 15 logout 後，同一個 refresh token 失效"
req -H 'Content-Type: application/json' -d "{\"refreshToken\":\"$RT\"}" "$H/api/auth/logout"
req -H 'Content-Type: application/json' -d "{\"refreshToken\":\"$RT\"}" "$H/api/auth/refresh"
echo "== 16 過期/竄改的 Access Token → 401 而不是 500"
req -H "Authorization: Bearer ${NT}x" "$H/api/users/me"
