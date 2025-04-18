import { Component, OnInit, OnDestroy, input, Input } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-app-timer',
  standalone: true,
  imports: [],
  templateUrl: './app-timer.component.html',
  styleUrl: './app-timer.component.scss'
})

export class AppTimerComponent implements OnInit, OnDestroy {
  @Input() startedAt = '';
  @Input() timeLimit = 0;
 
  timeRemaining: string = ''; 
  private timerSubscription!: Subscription;

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  startTimer(): void {
    if (this.startedAt && this.timeLimit > 0) {
      const startTime = new Date(this.startedAt).getTime();
      const endTime = startTime + this.timeLimit * 60 * 1000;


      this.timerSubscription = interval(1000).subscribe(() => {
        const currentTime = Date.now();
        const timeDiff = Math.max(0, endTime - currentTime);

        if (timeDiff <= 0) {
          this.timeRemaining = '00:00:00';
          this.timerSubscription.unsubscribe();
        } else {
          this.timeRemaining = this.formatTimeRemaining(timeDiff);
        }
      });
    } else {
      this.timeRemaining = '00:00:00';
    }
  }

  formatTimeRemaining(timeInMs: number): string {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return days > 0 ? `${days} day(s) ${hours}h : ${minutes}m : ${seconds}s` : `${hours}h : ${minutes}m : ${seconds}s`;
  }

  padNumber(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
