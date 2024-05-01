import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private $isTestRunning = new BehaviorSubject(false);
  $isTestRunning_ = this.$isTestRunning.asObservable();

  startTest() {
    this.$isTestRunning.next(true);
  }

  stopTest() {
    this.$isTestRunning.next(false);
  }
}
