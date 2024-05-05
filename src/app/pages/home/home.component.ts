import { UtilsService } from './../../services/utils.service';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { AvailableLanguages, Word } from '../../types/word';
import { WordService } from '../../services/word.service';
import { config } from '../../../config/config';
import { FormsModule } from '@angular/forms';
import { HlmButtonDirective } from '../../../../libs/ui/ui-button-helm/src/lib/hlm-button.directive';
import { provideIcons } from '@ng-icons/core';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '../../../../libs/ui/ui-input-helm/src/lib/hlm-input.directive';
import { CommonModule } from '@angular/common';

import {
  radixAlignBaseline,
  radixActivityLog,
  radixPadding,
  radixTrash,
} from '@ng-icons/radix-icons';

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
  providers: [
    provideIcons({
      radixAlignBaseline,
      radixActivityLog,
      radixPadding,
      radixTrash,
    }),
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  wordService = inject(WordService);
  utilsService = inject(UtilsService);
  words = this.wordService.getWords();

  configNaming = config.naming;

  loading = signal(false);

  @ViewChild('newWordDialog') newWordDialog!: ElementRef;
  @ViewChild('optionsDialog') optionsDialog!: ElementRef;

  languages = signal(
    Object.entries(config.languages)
      .filter((res) => res[1])
      .map((res) => res[0] as AvailableLanguages)
  );

  newWord: { [key: string]: string } = {};
  activeWord?: Word;

  submit() {
    this.wordService.add(this.newWord);
    this.closeModals();
  }

  getGridColsClass() {
    const languageCount = this.languages().length;
    const count = Math.max(1, Math.min(languageCount, 12));
    return `grid-cols-${count + 1}`;
  }

  updateWord() {
    this.loading.set(true);
    this.wordService.updateWord(this.activeWord!);
    this.closeModals();
    this.loading.set(false);
  }

  async deleteWord() {
    this.loading.set(true);
    await this.wordService.deleteWord(this.activeWord!.id);
    this.closeModals();
    this.loading.set(false);
  }

  showModalForCreating() {
    this.newWordDialog.nativeElement.showModal();
  }

  showModalForOptions(word: Word) {
    this.activeWord = word;
    this.optionsDialog.nativeElement.showModal();
  }

  closeModals() {
    this.newWord = {};
    this.activeWord = undefined;
    this.newWordDialog.nativeElement.close();
    this.optionsDialog.nativeElement.close();
  }

  handleSort(lang: string) {
    this.utilsService.sort(this.words(), lang);
  }
}
