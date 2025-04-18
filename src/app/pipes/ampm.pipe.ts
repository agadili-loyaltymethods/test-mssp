import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '../classes/utils/utils';

@Pipe({
  name: 'ampm',
  standalone: true
})
export class AmpmPipe implements PipeTransform {

  transform(value: string): string {
    const [hours, minutes] = value.split(':');
    if(Number(hours) >= 12){
      return `${Utils.addLeadingZero(Number(hours)-12 || 12)}:${minutes}PM`
    }else {
      return value + 'AM';
    }
  }

}
