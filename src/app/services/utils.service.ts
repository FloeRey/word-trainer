import { Injectable } from '@angular/core';
import { AvailableLanguages } from '../types/word';

@Injectable({
  providedIn: 'root',
})
export class UtilsService<T> {
  sortState: { [K in keyof T]?: number } = {};

  sort(array: T[], key: keyof T) {
    this.sortState[key] = this.sortState[key] === 1 ? 0 : 1;

    array.sort((a: T, b: T) => {
      const valueA = a[key] as unknown as string;
      const valueB = b[key] as unknown as string;

      if (!valueA && !valueB) return 0;
      if (!valueA) return 1;
      if (!valueB) return -1;

      return this.sortState[key] === 1
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  }

  shuffleArray(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  compareWords(word1: string, word2: string) {
    return word1.toLowerCase() === word2.toLowerCase();
  }

  calcTimeToString(time: number, unit: string) {
    if (unit === 's') {
      return `${(time / 60).toFixed(2)} min`;
    }

    return `${time}`;
  }
}
