import { StorageService } from './storage.service';
import { Injectable, computed, inject, signal } from '@angular/core';
import { BehaviorSubject, TimeInterval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  #storageService = inject(StorageService);

  private $isTestRunning = new BehaviorSubject(false);
  $isTestRunning_ = this.$isTestRunning.asObservable();

  #user = signal<string | undefined>(this.#storageService.readUser());

  get user() {
    return computed(() => this.#user());
  }

  async username(name: string) {
    if (name) {
      await this.#storageService.updateUser(name);
      this.#user.set(name);
    }
  }

  startTest() {
    this.$isTestRunning.next(true);
  }

  stopTest() {
    this.$isTestRunning.next(false);
  }
}
