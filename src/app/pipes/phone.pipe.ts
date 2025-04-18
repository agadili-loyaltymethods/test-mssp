import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone',
  standalone: true
})
export class PhonePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return (value || '').toString().replace(/(\d{1})(\d{2})(\d{2})(\d{3})/, '0$1-$2-$3-$4');
  }

}
