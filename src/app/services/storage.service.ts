import { Injectable } from '@angular/core';
import { Word } from '../types/word';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  getWordsFromLocalStorage(): Word[] {
    return JSON.parse(localStorage.getItem('words') ?? '[]');
  }
}
