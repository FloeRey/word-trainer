import { StatusService } from './../../services/status.service';
import { UtilsService } from './../../services/utils.service';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WordService } from '../../services/word.service';
import { AvailableLanguages, Word } from '../../types/word';
import { HlmInputDirective } from '../../../../libs/ui/ui-input-helm/src/lib/hlm-input.directive';
import { HlmButtonDirective } from '../../../../libs/ui/ui-button-helm/src/lib/hlm-button.directive';
import { HlmIconComponent } from '../../../../libs/ui/ui-icon-helm/src/lib/hlm-icon.component';
import { provideIcons } from '@ng-icons/core';
import { radixEyeOpen, radixHeartFilled } from '@ng-icons/radix-icons';

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
  selector: 'app-training',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HlmInputDirective,
    HlmButtonDirective,
    HlmIconComponent,
  ],
  providers: [
    provideIcons({
      radixHeartFilled,
      radixEyeOpen,
    }),
  ],
  templateUrl: './training.component.html',
  styleUrl: './training.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingComponent {
  wordService = inject(WordService);
  utilsService = inject(UtilsService);
  statusService = inject(StatusService);
  trainingWords = this.wordService.getTrainingWords();
  qualitys = this.wordService.getWordsQuality();
  config = this.statusService.config;
  activeTraningWord = signal<ActiveWord | undefined>(undefined);
  resultWord?: string;
  isSuccess = signal(false);
  isCheated = signal(false);

  ngOnInit() {
    if (this.trainingWords.length) {
      this.addQuality();
      this.nextWord();
    }
  }

  addQuality() {
    const extendedWordlist: Word[] = [];
    this.trainingWords.forEach((word) => {
      const q = this.qualitys()[word.id];
      if (q) {
        if (q < 0.5) extendedWordlist.push(word);
        if (q < 0.4) extendedWordlist.push(word);
        if (q < 0.3) extendedWordlist.push(word);
        if (q < 0.2) extendedWordlist.push(word);
        if (q < 0.1) extendedWordlist.push(word);
      }
      extendedWordlist.push(word);
    });
    this.trainingWords = extendedWordlist;
  }

  nextWord() {
    this.isSuccess.set(false);
    this.isCheated.set(false);
    this.resultWord = '';
    this.activeTraningWord.set(this.takeWord());
  }

  showResult() {
    this.resultWord = this.activeTraningWord()!.search.word!;
    this.wordService.quality_sub(this.activeTraningWord()!.id);
    this.isCheated.set(true);
  }

  onTrainWordChange(newValue: string) {
    if (
      this.utilsService.compareWords(
        newValue,
        this.activeTraningWord()!.search.word
      )
    ) {
      this.isSuccess.set(true);
    }
  }

  getRandomWord(words: Word[]): Word {
    return words[Math.floor(Math.random() * this.trainingWords.length)];
  }

  takeWord() {
    const word = this.getRandomWord(this.trainingWords);
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
}
