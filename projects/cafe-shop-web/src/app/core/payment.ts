import { EcpayForm } from './models';

// 綠界規定由瀏覽器用表單 POST 到付款頁：動態建立隱藏表單再送出（整頁跳轉）
export function submitEcpayForm(form: EcpayForm): void {
  const el = document.createElement('form');
  el.method = 'post';
  el.action = form.action;
  for (const [name, value] of Object.entries(form.fields)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    el.appendChild(input);
  }
  document.body.appendChild(el);
  el.submit();
}
