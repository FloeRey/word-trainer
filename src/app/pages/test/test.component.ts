import { UtilsService } from './../../services/utils.service';
import { Component, inject, signal } from '@angular/core';
import { WordService } from '../../services/word.service';
import { AvailableLanguages, Word } from '../../types/word';
import { FormsModule } from '@angular/forms';
import { StatusService } from '../../services/status.service';
import { config } from '../../../config/config';
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
  imports: [FormsModule, HlmButtonDirective, HlmInputDirective, CommonModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent {
  wordService = inject(WordService);
  statusService = inject(StatusService);
  utilsService = inject(UtilsService);
  testWords: Word[] = [...this.wordService.getTrainingWords()];
  activeTestWord = signal<ActiveWord | undefined>(undefined);
  configNaming: { [key in AvailableLanguages]: string } = config.naming;
  resultWord?: string;

  testResult = signal<{
    time: string;
    points: number;
    words: { wrong: ActiveWord[]; right: ActiveWord[] };
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

  showResults = signal(false);

  #timer?: ReturnType<typeof setTimeout>;
  isRunning = signal(false);
  runTime = 0;

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
  }

  countTestTime() {
    this.runTime = 0;
    if (this.#timer) {
      clearTimeout(this.#timer);
    }

    const testTimer = this.testSetup().testTimer;

    const count = () => {
      console.log(this.runTime);
      this.runTime++;
      if (testTimer && this.runTime / 60 > testTimer) {
        this.cancelTest();
      } else {
        this.#timer = setTimeout(count, 1000);
      }
    };

    count();
  }

  cancelTest() {
    this.statusService.stopTest();
    this.showResults.set(true);
    this.isRunning.set(false);

    this.testResult.update((e) => ({
      ...e,
      time: this.utilsService.calcTimeToString(this.runTime, 's'),
    }));
    clearTimeout(this.#timer);
  }

  checkWord() {
    const wordIndex = this.testWords.findIndex(
      (word) => word.id === this.activeTestWord()!.id
    );

    let rightOrFalse = true;

    if (this.resultWord) {
      if (
        this.utilsService.compareWords(
          this.resultWord,
          this.activeTestWord()!.search.word
        )
      ) {
        this.testResult.update((e) => ({
          ...e,
          points: e.points + 1,
          words: {
            wrong: [...e.words.wrong],
            right: [...e.words.right, this.activeTestWord()!],
          },
        }));
      } else {
        rightOrFalse = false;
      }
    } else {
      rightOrFalse = false;
    }

    if (!rightOrFalse) {
      this.testResult.update((e) => ({
        ...e,
        words: {
          wrong: [...e.words.wrong, this.activeTestWord()!],
          right: [...e.words.right],
        },
      }));
    }

    this.testWords.splice(wordIndex, 1);

    if (this.testSetup().neededSuccessWords) {
      if (
        this.testWords.length + this.testResult().points <
        this.testSetup().neededSuccessWords!
      ) {
        this.cancelTest();
        return;
      }
    }

    this.nextWord();
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
    const usedLanguages = Object.entries(config.languages)
      .filter(([language, isAvailable]) => isAvailable)
      .map((e) => e[0]);

    const availableLanguages = Object.keys(word).filter(
      (key) => key !== 'id' && usedLanguages.indexOf(key) !== -1
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
