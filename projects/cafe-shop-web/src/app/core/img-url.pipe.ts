import { Pipe, PipeTransform } from '@angular/core';

import { API_ORIGIN } from './config';

// 後端回傳的圖片是 /uploads/xxx.jpg，前面要加上後端的位址
@Pipe({ name: 'imgUrl' })
export class ImgUrlPipe implements PipeTransform {
  transform(url: string | null | undefined): string {
    if (!url) {
      return 'placeholder.svg';
    }
    return url.startsWith('http') ? url : API_ORIGIN + url;
  }
}
