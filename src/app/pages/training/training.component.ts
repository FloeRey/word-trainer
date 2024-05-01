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

  getRandomWord(words: Word[]) {
    const random = Math.floor(Math.random() * (this.trainingWords.length - 1));
    return words[random];
  }

  takeWord() {
    let errorCount = 0;
    const word = this.getRandomWord(this.trainingWords);

    const possibleLanguages = Object.keys(word).filter((key) => key !== 'id');
    const takeWord = Math.floor(Math.random() * (possibleLanguages.length - 1));

    let searchWord = takeWord + 1 > possibleLanguages.length ? 0 : takeWord + 1;

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

  showResult() {
    this.resultWord = this.activeTraningWord()!.search.word!;
    this.wordService.quality_sub(this.activeTraningWord()!.id);
  }
}
