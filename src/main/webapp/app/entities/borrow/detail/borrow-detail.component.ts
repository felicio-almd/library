import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IBorrow } from '../borrow.model';

@Component({
  selector: 'jhi-borrow-detail',
  templateUrl: './borrow-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class BorrowDetailComponent {
  borrow = input<IBorrow | null>(null);

  previousState(): void {
    window.history.back();
  }
}
