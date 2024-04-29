import {
  Injectable,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Word } from '../types/word';
import { StorageService } from './storage.service';
import { Subject, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  storageService = inject(StorageService);
  constructor(private http: HttpClient) {}

  words: WritableSignal<Word[]> = signal(
    this.storageService.getWordsFromLocalStorage()
  );

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
        ([key, value]) => value && key !== 'id'
      );

      return wordHasMultipleLanguages.length > 1;
    });
  }

  removeAll() {
    localStorage.removeItem('words');
    this.words.set([]);
  }

  storeNewWord(word: any) {
    const newWordList = [...this.words(), word];
    localStorage.setItem('words', JSON.stringify(newWordList));
    this.words.set(newWordList);
  }
}
