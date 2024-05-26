import { UtilsService } from './../../services/utils.service';
import { Component, inject, signal } from '@angular/core';
import { WordService } from '../../services/word.service';
import { AvailableLanguages, Word } from '../../types/word';
import { FormsModule } from '@angular/forms';
import { StatusService } from '../../services/status.service';
import { HlmBadgeDirective } from '@spartan-ng/ui-badge-helm';
import { HlmButtonDirective } from '../../../../libs/ui/ui-button-helm/src/lib/hlm-button.directive';
import { HlmInputDirective } from '../../../../libs/ui/ui-input-helm/src/lib/hlm-input.directive';
import { CommonModule } from '@angular/common';

type ActiveWord = {
  show: {
    word: string;
    language: AvailableLanguages;
  };
  search: {
    word: string;
    language: AvailableLanguages;
  };
  id: string;
};
@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    FormsModule,
    HlmButtonDirective,
    HlmInputDirective,
    CommonModule,
    HlmBadgeDirective,
  ],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent {
  wordService = inject(WordService);
  statusService = inject(StatusService);
  utilsService = inject(UtilsService);
  testWords: Word[] = [...this.wordService.getTrainingWords()];
  activeTestWord = signal<ActiveWord | undefined>(undefined);
  config = this.statusService.config;
  resultWord: string = '';
  showResults = signal(false);
  #timer?: ReturnType<typeof setTimeout>;
  isRunning = signal(false);
  runTime = 0;

  testResult = signal<{
    time: string;
    points: number;
    words: { wrong: ActiveWord[]; right: ActiveWord[] };
    cancelReason?: string;
  }>({
    time: '0',
    points: 0,
    words: {
      wrong: [],
      right: [],
    },
  });
  testSetup = signal({
    time: 3600,
    neededSuccessWords: undefined,
    wordCount: undefined,
    testTimer: undefined,
  });

  start() {
    this.setup();
    this.countTestTime();
    this.isRunning.set(true);
    this.statusService.startTest();
  }

  setup() {
    const shuffledArray = this.utilsService.shuffleArray(this.testWords);
    this.testWords = shuffledArray;

    if (this.testSetup().wordCount) {
      this.testWords.splice(
        0,
        this.testWords.length - this.testSetup().wordCount!
      );
    }

    this.nextWord();
  }

  resett() {
    this.isRunning.set(false);
    this.showResults.set(false);
    this.testResult.set({
      time: '0',
      points: 0,
      words: {
        wrong: [],
        right: [],
      },
      cancelReason: '',
    });
  }

  countTestTime() {
    this.runTime = 0;
    if (this.#timer) {
      clearTimeout(this.#timer);
    }

    const testTimer = this.testSetup().testTimer;

    const count = () => {
      this.runTime++;
      if (testTimer && this.runTime / 60 > testTimer) {
        this.cancelTest();
      } else {
        this.#timer = setTimeout(count, 1000);
      }
    };

    count();
  }

  cancelTest(reason?: string) {
    this.statusService.stopTest();
    this.showResults.set(true);
    this.isRunning.set(false);

    this.testResult.update((e) => ({
      ...e,
      time: this.utilsService.calcTimeToString(this.runTime, 's'),
      cancelReason: reason ?? '',
    }));
    clearTimeout(this.#timer);
  }

  updateStatistik(success: boolean) {
    if (success) {
      this.testResult.update((e) => ({
        ...e,
        points: e.points + 1,
        words: {
          wrong: [...e.words.wrong],
          right: [...e.words.right, this.activeTestWord()!],
        },
      }));
    } else {
      this.testResult.update((e) => ({
        ...e,
        words: {
          wrong: [...e.words.wrong, this.activeTestWord()!],
          right: [...e.words.right],
        },
      }));
    }
  }

  checkWord() {
    const wordIndex = this.testWords.findIndex(
      (word) => word.id === this.activeTestWord()!.id
    );

    this.updateStatistik(
      this.utilsService.compareWords(
        this.resultWord,
        this.activeTestWord()!.search.word
      )
    );

    this.testWords.splice(wordIndex, 1);

    if (this.testSetup().neededSuccessWords) {
      if (
        this.testWords.length + this.testResult().points <
        this.testSetup().neededSuccessWords!
      ) {
        this.cancelTest('Leider die Anzahl gefordeten Wörter nicht erreicht');
        return;
      }
    }

    if (this.testWords.length <= 0) {
      this.cancelTest('Alle Wörter abgefragt');
    } else {
      this.nextWord();
    }
  }

  nextWord() {
    if (this.testWords.length) {
      this.resultWord = '';
      this.activeTestWord.set(this.takeWord());
    }
  }

  getRandomWord(words: Word[]) {
    const random = Math.floor(Math.random() * this.testWords.length);
    return words[random];
  }

  takeWord() {
    const word = this.getRandomWord(this.testWords);
    const usedLanguages = this.config().languageArray;

    const availableLanguages = Object.keys(word).filter(
      (key) =>
        key !== 'id' && usedLanguages.indexOf(key as AvailableLanguages) !== -1
    );

    const shuffledArray = this.utilsService.shuffleArray(availableLanguages);

    return {
      show: {
        word: word[shuffledArray[0] as AvailableLanguages]!,
        language: shuffledArray[0] as AvailableLanguages,
      },
      search: {
        word: word[shuffledArray[1] as AvailableLanguages]!,
        language: shuffledArray[1] as AvailableLanguages,
      },
      id: word.id,
    };
  }

  ngOnDestroy(): void {
    this.statusService.stopTest();
  }
}
