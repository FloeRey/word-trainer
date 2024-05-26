import { UtilsService } from './../../services/utils.service';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Word } from '../../types/word';
import { WordService } from '../../services/word.service';
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
  radixPencil2,
  radixPlus,
} from '@ng-icons/radix-icons';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import {
  BrnAlertDialogContentDirective,
  BrnAlertDialogTriggerDirective,
} from '@spartan-ng/ui-alertdialog-brain';
import {
  HlmAlertDialogActionButtonDirective,
  HlmAlertDialogCancelButtonDirective,
  HlmAlertDialogComponent,
  HlmAlertDialogContentComponent,
  HlmAlertDialogDescriptionDirective,
  HlmAlertDialogFooterComponent,
  HlmAlertDialogHeaderComponent,
  HlmAlertDialogOverlayDirective,
  HlmAlertDialogTitleDirective,
} from '@spartan-ng/ui-alertdialog-helm';

import {
  BrnDialogContentDirective,
  BrnDialogTriggerDirective,
} from '@spartan-ng/ui-dialog-brain';
import { StatusService } from '../../services/status.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HlmIconComponent,
    HlmInputDirective,
    CommonModule,
    FormsModule,
    HlmButtonDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
    HlmAlertDialogComponent,
    HlmAlertDialogOverlayDirective,
    HlmAlertDialogHeaderComponent,
    HlmAlertDialogFooterComponent,
    HlmAlertDialogTitleDirective,
    HlmAlertDialogDescriptionDirective,
    HlmAlertDialogCancelButtonDirective,
    HlmAlertDialogActionButtonDirective,
    HlmAlertDialogContentComponent,
    BrnAlertDialogContentDirective,
    BrnAlertDialogTriggerDirective,
  ],
  providers: [
    provideIcons({
      radixAlignBaseline,
      radixActivityLog,
      radixPadding,
      radixTrash,
      radixPencil2,
      radixPlus,
    }),
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  wordService = inject(WordService);
  utilsService = inject(UtilsService);
  statusService = inject(StatusService);
  words = this.wordService.getWords();
  config = this.statusService.config;
  loading = signal(false);
  newWord: { [key: string]: string } = {};
  selectedWord?: Word;
  activeDialog = signal('');

  loadExampleList() {
    this.wordService.loadExample();
  }

  removeAll() {
    this.wordService.removeAll();
  }

  closeDialog() {
    this.activeDialog.set('');
  }

  getGridColsClass() {
    const languageCount = this.config().languageArray.length;
    const count = Math.max(1, Math.min(languageCount, 12));
    return `grid-cols-${count + 1}`;
  }

  submitNewWord() {
    if (Object.keys(this.newWord).length) {
      this.wordService.add(this.newWord);
    }
    this.closeDialog();
  }

  updateWord() {
    if (this.selectedWord) {
      this.loading.set(true);
      if (Object.keys(this.selectedWord).length) {
        this.wordService.updateWord(this.selectedWord);
      } else {
        this.wordService.deleteWord(this.selectedWord.id);
      }
      this.loading.set(false);
    }
    this.closeDialog();
  }

  async deleteWord() {
    if (this.selectedWord) {
      this.loading.set(true);
      await this.wordService.deleteWord(this.selectedWord.id);
      this.loading.set(false);
    }
    this.closeDialog();
  }

  showModalForOptions(word: Word) {
    this.selectedWord = { ...word };
    this.activeDialog.set('options');
  }

  handleSort(lang: string) {
    this.utilsService.sort(this.words(), lang);
  }
}
