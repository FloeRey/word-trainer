import { Injectable } from '@angular/core';
import { Quality, Word } from '../types/word';

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

  readUser(): string | undefined {
    return localStorage.getItem('user') ?? undefined;
  }
}
