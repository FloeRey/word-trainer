import { Component, inject, signal } from '@angular/core';
import { WordService } from '../../services/word.service';
import { AvailableLanguages, Word } from '../../types/word';
import { FormsModule } from '@angular/forms';
import { StatusService } from '../../services/status.service';
import { RouterLink } from '@angular/router';

type ActiveWord = {
  show: {
    word: string;
    language: string;
  };
  search: {
    word: string;
    language: string;
  };
  id: string;
};
@Component({
  selector: 'app-test',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent {
  wordService = inject(WordService);
  statusService = inject(StatusService);
  trainingWords: Word[] = [...this.wordService.getTrainingWords()];
  activeTestWord = signal<ActiveWord | undefined>(undefined);
  resultWord?: string;

  testResult = signal<number>(0);

  ngOnInit() {
    this.nextWord();
    this.statusService.startTest();
  }

  checkWord() {
    const wordIndex = this.trainingWords.findIndex(
      (word) => word.id === this.activeTestWord()!.id
    );
    this.trainingWords.splice(wordIndex, 1);

    if (
      this.resultWord?.toLowerCase() ===
      this.activeTestWord()!.search.word.toLowerCase()
    ) {
      this.testResult.update((e) => e + 1);
    }

    this.nextWord();
  }

  nextWord() {
    if (this.trainingWords.length) {
      this.activeTestWord.set(this.takeWord());
    }
  }

  getRandomWord(words: Word[]) {
    const random = Math.floor(Math.random() * this.trainingWords.length);
    return words[random];
  }

  takeWord() {
    let errorCount = 0;
    const word = this.getRandomWord(this.trainingWords);
    const possibleLanguages = Object.keys(word).filter((key) => key !== 'id');
    const takeWord = Math.floor(Math.random() * possibleLanguages.length);

    let searchWord =
      takeWord + 1 > possibleLanguages.length - 1 ? 0 : takeWord + 1;
    while (searchWord === takeWord && errorCount < 50) {
      searchWord += 1;
      errorCount++;
    }

    const languageTakeWord = possibleLanguages[takeWord];
    const languageSearchWord = possibleLanguages[searchWord];

    return {
      show: {
        word: word[languageTakeWord as AvailableLanguages]!,
        language: languageTakeWord,
      },
      search: {
        word: word[languageSearchWord as AvailableLanguages]!,
        language: languageSearchWord,
      },
      id: word.id,
    };
  }

  ngOnDestroy(): void {
    this.statusService.stopTest();
  }
}
