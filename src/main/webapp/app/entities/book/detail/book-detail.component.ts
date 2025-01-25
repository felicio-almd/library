import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IBook } from '../book.model';

@Component({
  selector: 'jhi-book-detail',
  templateUrl: './book-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class BookDetailComponent {
  book = input<IBook | null>(null);

  previousState(): void {
    window.history.back();
  }
}
