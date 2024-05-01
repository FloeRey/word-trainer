import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { AvailableLanguages, Quality, Word } from '../types/word';
import { StorageService } from './storage.service';
import { Subject, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { config } from '../../config/config';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  storageService = inject(StorageService);
  sortState: { [key: string]: number } = {};

  constructor(private http: HttpClient) {}

  words: WritableSignal<Word[]> = signal(
    this.storageService.getWordsFromLocalStorage()
  );

  wordsQuality: WritableSignal<Quality> = signal(
    this.storageService.getWordsQualityFromLocalStorage()
  );

  async deleteWord(id: string) {
    const findIndex = this.words().findIndex((word) => word.id === id);
    this.words().splice(findIndex, 1);
    this.storageService.updateLocalStorage(this.words());
  }

  async updateWord(newWord: Word) {
    Object.entries(newWord).forEach(([key, value]) => {
      if (!value.trim()) {
        delete newWord[key as AvailableLanguages];
      }
    });

    const findIndex = this.words().findIndex((word) => word.id === newWord.id);
    this.words()[findIndex] = newWord;
    this.storageService.updateLocalStorage(this.words());
  }

  public getWordsQuality() {
    return computed(() => this.wordsQuality());
  }

  public getWords(id?: string) {
    // if (id) {
    //   return computed(() => Object.keys(this.words()).find((e) => e === id));
    // }
    // console.log(this.words());
    return computed(() => this.words());
  }

  async loadExample() {
    const wordList = await firstValueFrom(
      this.http.get<Word[]>('assets/words_prepared/wordslist1.json')
    );
    this.words.set(wordList);
  }

  getTrainingWords() {
    return this.words().filter((word) => {
      const wordHasMultipleLanguages = Object.entries(word).filter(
        ([key, value]) =>
          value &&
          Object.entries(config.languages)
            .filter(([language, isAvailable]) => isAvailable)
            .map((e) => e[0])
            .indexOf(key) !== -1
      );

      return wordHasMultipleLanguages.length > 1;
    });
  }

  removeAll() {
    localStorage.removeItem('words');
    this.words.set([]);
  }

  quality_sub(id: string) {
    if (!this.wordsQuality()[id]) {
      this.wordsQuality()[id] = 0.5;
    }
    this.wordsQuality()[id] -= this.wordsQuality()[id] > 0.01 ? 0.01 : 0;
    this.wordsQuality()[id] = parseFloat(this.wordsQuality()[id].toFixed(2));
    this.storageService.updateLocalStorageQuality(this.wordsQuality());
  }

  quality_add(id: string) {
    if (!this.wordsQuality()[id]) {
      this.wordsQuality()[id] = 0.5;
    }
    this.wordsQuality()[id] += this.wordsQuality()[id] < 1 ? 0.01 : 0;
    this.wordsQuality()[id] = parseFloat(this.wordsQuality()[id].toFixed(2));
    this.storageService.updateLocalStorageQuality(this.wordsQuality());
  }

  storeNewWord(word: { [key: string]: string }) {
    const id = (Math.random() * 100).toString();
    word['id'] = id;
    Object.entries(word).forEach(([key, value]) => {
      if (!value.trim()) {
        delete word[key];
      }
    });

    const newWordList = [...this.words(), { ...(word as Word) }];
    localStorage.setItem('words', JSON.stringify(newWordList));
    this.words.set(newWordList);
  }

  sort(language: AvailableLanguages) {
    this.sortState[language] === 1
      ? (this.sortState[language] = 0)
      : (this.sortState[language] = 1);

    this.words().sort((a, b) => {
      if (!a[language] && !b[language]) return 0;
      if (!a[language]) {
        return 1;
      }
      if (!b[language]) {
        return -1;
      }
      return this.sortState[language] === 1
        ? a[language]!.localeCompare(b[language]!)
        : b[language]!.localeCompare(a[language]!);
    });
  }
}
