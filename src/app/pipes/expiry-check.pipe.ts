import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'expiryCheck',
  standalone: true
})
export class ExpiryCheckPipe implements PipeTransform {

  transform(value: Date | string): string {
    const date = new Date(value);
    if (date.getFullYear() > 2900) {
      return 'Never';
    }
    return this.formatDate(date);
  }

  formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

}
