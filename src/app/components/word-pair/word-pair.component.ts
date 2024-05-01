import { WordService } from './../../services/word.service';
import {
  Component,
  input,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { AvailableLanguages, Word } from '../../types/word';
import { provideIcons } from '@ng-icons/core';
import { radixAlignBaseline } from '@ng-icons/radix-icons';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';

@Component({
  selector: 'app-word-pair',
  standalone: true,
  imports: [HlmIconComponent],
  providers: [provideIcons({ radixAlignBaseline })],
  templateUrl: './word-pair.component.html',
  styleUrl: './word-pair.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordPairComponent {
  word = input.required<Word>();
}
