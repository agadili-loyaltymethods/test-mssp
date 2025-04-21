import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-unsubscribe',
  standalone: true,
  imports: [],
  template: '',
})
export class UnsubscribeComponent implements OnDestroy{
  subscriptions: Subscription[] = [];

  ngOnDestroy(){
    this.subscriptions.forEach(x => x.unsubscribe());
  }
}
