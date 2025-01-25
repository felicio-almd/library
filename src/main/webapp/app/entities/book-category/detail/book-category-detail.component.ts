import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IBookCategory } from '../book-category.model';

@Component({
  selector: 'jhi-book-category-detail',
  templateUrl: './book-category-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class BookCategoryDetailComponent {
  bookCategory = input<IBookCategory | null>(null);

  previousState(): void {
    window.history.back();
  }
}
