import { Injectable } from '@angular/core';
import { Quality, Word } from '../types/word';
import { config } from '../../config/config';
import { Config } from '../types/config';
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  getWordsFromLocalStorage(): Word[] {
    return JSON.parse(localStorage.getItem('words') ?? '[]');
  }

  getWordsQualityFromLocalStorage(): Quality {
    return JSON.parse(localStorage.getItem('quality') ?? '{}');
  }

  updateLocalStorage(words: Word[]) {
    localStorage.setItem('words', JSON.stringify(words));
  }

  updateLocalStorageQuality(quality: Quality) {
    localStorage.setItem('quality', JSON.stringify(quality));
  }

  async updateUser(name: string) {
    localStorage.setItem('user', name);
  }

  async removeUser() {
    localStorage.removeItem('user');
  }

  readUser(): string | undefined {
    return localStorage.getItem('user') ?? undefined;
  }

  readConfig(): Config {
    let ls_config = localStorage.getItem('config');
    return ls_config ? JSON.parse(ls_config) : config;
  }

  updateConfigLocalStorage(config: Config) {
    localStorage.setItem('config', JSON.stringify(config));
  }
}
