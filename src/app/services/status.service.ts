import { StorageService } from './storage.service';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { BehaviorSubject, TimeInterval } from 'rxjs';
import { Config } from '../types/config';
import { AvailableLanguages } from '../types/word';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  #storageService = inject(StorageService);

  private $isTestRunning = new BehaviorSubject(false);
  $isTestRunning_ = this.$isTestRunning.asObservable();

  #user = signal<string | undefined>(this.#storageService.readUser());
  #config = signal<Config>(this.#storageService.readConfig());

  get user() {
    return computed(() => this.#user());
  }

  get config() {
    return computed(() => ({
      conf: this.#config(),
      languageArray: Object.entries(this.#config().languages)
        .filter((res) => res[1])
        .map((res) => res[0] as AvailableLanguages),
    }));
  }

  updateLanguages(lang: string, value: boolean) {
    const languages = { ...this.#config().languages, [lang]: value };
    const config = { ...this.#config(), languages };
    this.#storageService.updateConfigLocalStorage(config);
    this.#config.set(config);
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
