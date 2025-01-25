import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IBookCategory } from '../book-category.model';
import { BookCategoryService } from '../service/book-category.service';

@Component({
  templateUrl: './book-category-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BookCategoryDeleteDialogComponent {
  bookCategory?: IBookCategory;

  protected bookCategoryService = inject(BookCategoryService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bookCategoryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
