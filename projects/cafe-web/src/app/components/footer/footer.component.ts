import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  // 營業資訊寫死在前端，不進資料庫
  info = {
    address: '台北市大安區轉角路 1 號',
    phone: '02-1234-5678',
    hours: '每天 10:00–20:00',
    closed: '每週一公休',
  };
}
