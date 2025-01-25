import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IBookLocation } from '../book-location.model';
import { BookLocationService } from '../service/book-location.service';

@Component({
  templateUrl: './book-location-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BookLocationDeleteDialogComponent {
  bookLocation?: IBookLocation;

  protected bookLocationService = inject(BookLocationService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bookLocationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
