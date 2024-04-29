import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { WordService } from '../../../services/word.service';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { config } from '../../../../config/config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvailableLanguages, Word } from '../../../types/word';
import { HlmButtonDirective } from '../../../../../libs/ui/ui-button-helm/src/lib/hlm-button.directive';
import { provideIcons } from '@ng-icons/core';
import { radixAlignBaseline } from '@ng-icons/radix-icons';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HlmIconComponent,
    HlmInputDirective,
    CommonModule,
    FormsModule,
    HlmButtonDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [provideIcons({ radixAlignBaseline })],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  wordService = inject(WordService);
  words = this.wordService.getWords();

  @ViewChild('newWordDialog') newWordDialog!: ElementRef;

  languages = signal(
    Object.entries(config.languages)
      .filter((res) => res[1])
      .map((res) => res[0] as AvailableLanguages)
  );

  newWord: { [key: string]: string } = {};
  sortState: { [key: string]: number } = {};

  submit() {
    this.newWord['id'] = (Math.random() * 100).toString();
    this.wordService.storeNewWord(this.newWord);
    this.newWord = {};
    this.newWordDialog.nativeElement.close();
  }

  showModal() {
    this.newWordDialog.nativeElement.showModal();
  }
  closeModal() {
    this.newWordDialog.nativeElement.close();
  }

  sort(lang: AvailableLanguages) {
    this.sortState[lang] === 1
      ? (this.sortState[lang] = 0)
      : (this.sortState[lang] = 1);

    this.words().sort((a, b) => {
      if (!a[lang] && !b[lang]) return 0;
      if (!a[lang]) {
        return 1;
      }
      if (!b[lang]) {
        return -1;
      }
      return this.sortState[lang] === 1
        ? a[lang]!.localeCompare(b[lang]!)
        : b[lang]!.localeCompare(a[lang]!);
    });
  }
}
