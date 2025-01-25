import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IBorrow } from '../borrow.model';
import { BorrowService } from '../service/borrow.service';

@Component({
  templateUrl: './borrow-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BorrowDeleteDialogComponent {
  borrow?: IBorrow;

  protected borrowService = inject(BorrowService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.borrowService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
