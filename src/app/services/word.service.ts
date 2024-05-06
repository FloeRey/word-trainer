import { StatusService } from './status.service';
import {
  Injectable,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { AvailableLanguages, Quality, Word } from '../types/word';
import { StorageService } from './storage.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  storageService = inject(StorageService);
  statusService = inject(StatusService);
  utilsService = inject(UtilsService);

  constructor(private http: HttpClient) {}

  words: WritableSignal<Word[]> = signal(
    this.storageService.getWordsFromLocalStorage()
  );

  wordsQuality: WritableSignal<Quality> = signal(
    this.storageService.getWordsQualityFromLocalStorage()
  );

  add(word: { [key: string]: string }) {
    if (!this.checkIfAllreadyInWordList(word)) {
      const id = this.utilsService.randomUuid();
      word['id'] = id;
      Object.entries(word).forEach(([key, value]) => {
        if (!value.trim()) {
          delete word[key];
        } else {
          word[key] = this.utilsService.toPascalCase(value);
        }
      });

      const newWordList = [...this.words(), { ...(word as Word) }];
      localStorage.setItem('words', JSON.stringify(newWordList));
      this.words.set(newWordList);
    }
  }

  checkIfAllreadyInWordList(newWord: { [key: string]: string }) {
    return this.words().some((word) =>
      Object.entries(newWord).every(([key, value]) => {
        if (!word[key as AvailableLanguages]) {
          return false;
        }
        return this.utilsService.compareWords(
          word[key as AvailableLanguages]!,
          value
        );
      })
    );
  }

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

  public getWords() {
    return computed(() => this.words());
  }

  async loadExample() {
    const wordList = await firstValueFrom(
      this.http.get<Word[]>('assets/words_prepared/wordslist1.json')
    );
    this.words.set(wordList);
  }

  getTrainingWords() {
    const config = this.statusService.config;
    const usedLanguages = config().languageArray;

    return this.words().filter((word) => {
      const wordHasMultipleLanguages = Object.entries(word).filter(
        ([key, value]) =>
          value && usedLanguages.indexOf(key as AvailableLanguages) !== -1
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
}
