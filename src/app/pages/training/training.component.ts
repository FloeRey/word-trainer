import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WordService } from '../../services/word.service';
import { AvailableLanguages, Word } from '../../types/word';
import { HlmInputDirective } from '../../../../libs/ui/ui-input-helm/src/lib/hlm-input.directive';
@Component({
  selector: 'app-training',
  standalone: true,
  imports: [CommonModule, FormsModule, HlmInputDirective],
  templateUrl: './training.component.html',
  styleUrl: './training.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingComponent {
  validLanguages: AvailableLanguages[] = ['de', 'en', 'fr', 'it'];
  wordService = inject(WordService);

  trainingWords = this.wordService.getTrainingWords();
  activeTraningWord = this.takeWord(this.trainingWords[0]);
  resultWord: string = '';

  onTrainWordChange(newValue: string) {
    console.log('trainWord changed to:', newValue);
  }

  takeWord(word: Word) {
    if (!word) return;
    const wordAvailableLanguages = Object.entries(word).filter(
      ([key, value]) =>
        value && this.validLanguages.includes(key as AvailableLanguages)
    );
    return wordAvailableLanguages[
      Math.floor(Math.random() * wordAvailableLanguages.length)
    ][1];
  }
}
