import { Component, input } from '@angular/core';

@Component({
  selector: 'app-status-chip',
  template: `<span class="status" [class]="'status ' + status()">{{ label() }}</span>`,
})
export class StatusChipComponent {
  status = input.required<string>();
  label = input.required<string>();
}
