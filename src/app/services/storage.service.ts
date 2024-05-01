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
    return JSON.parse(localStorage.getItem('profile=1') ?? '{}');
  }

  updateLocalStorage(words: Word[]) {
    localStorage.setItem('words', JSON.stringify(words));
  }

  updateLocalStorageQuality(quality: Quality) {
    localStorage.setItem('profile=1', JSON.stringify(quality));
  }
}
