import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appTimeFormat]',
  standalone: true
})
export class TimeFormatDirective {

  constructor(private el: ElementRef) {
  }
  ngOnInit(){
    setTimeout(() => {
      this.el.nativeElement.innerHTML = `${this.el.nativeElement.textContent.substr(0,5)}<small class="text-small">${this.el.nativeElement.textContent.substr(5,2)}</small>`;
    })
  }

}
