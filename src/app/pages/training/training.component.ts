import { UtilsService } from './../../services/utils.service';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { radixHeartFilled } from '@ng-icons/radix-icons';
import { config } from '../../../config/config';

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
    }),
  ],
  templateUrl: './training.component.html',
  styleUrl: './training.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingComponent {
  wordService = inject(WordService);
  utilsService = inject(UtilsService);

  trainingWords = this.wordService.getTrainingWords();
  qualitys = this.wordService.getWordsQuality();

  activeTraningWord = signal<ActiveWord | undefined>(undefined);
  resultWord?: string;

  isSuccess = signal(false);

  ngOnInit() {
    console.log(this.trainingWords);
    this.nextWord();
  }

  nextWord() {
    if (this.trainingWords.length) {
      this.isSuccess.set(false);
      this.activeTraningWord.set(this.takeWord());
    }
  }

  onTrainWordChange(newValue: string) {
    if (newValue === this.activeTraningWord()!.search.word) {
      this.isSuccess.set(true);
    }
  }

  getRandomWord(words: Word[]): Word {
    const random = Math.floor(Math.random() * (this.trainingWords.length - 1));
    return words[random];
  }

  takeWord() {
    const word = this.getRandomWord(this.trainingWords);
    const availableLanguages = Object.keys(word).filter((key) => key !== 'id');
    const shuffledArray = this.utilsService.shuffleArray(availableLanguages);

    return {
      show: {
        word: word[shuffledArray[0] as AvailableLanguages]!,
        language: shuffledArray[0],
      },
      search: {
        word: word[shuffledArray[1] as AvailableLanguages]!,
        language: shuffledArray[1],
      },
      id: word.id,
    };
  }

  showResult() {
    this.resultWord = this.activeTraningWord()!.search.word!;
    this.wordService.quality_sub(this.activeTraningWord()!.id);
  }
}
