import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IBook } from '../book.model';
import { BookService } from '../service/book.service';

@Component({
  templateUrl: './book-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BookDeleteDialogComponent {
  book?: IBook;

  protected bookService = inject(BookService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bookService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
