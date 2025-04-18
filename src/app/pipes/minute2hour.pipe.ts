import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minute2hour',
  standalone: true
})
export class Minute2hourPipe implements PipeTransform {

  transform(value: number): string {
    const hours = Math.floor(value / 60);
    const minutes = Math.floor(value % 60);
    return `${hours}h ${minutes}m`;
  }

}
