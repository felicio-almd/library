import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IBookLocation } from '../book-location.model';

@Component({
  selector: 'jhi-book-location-detail',
  templateUrl: './book-location-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class BookLocationDetailComponent {
  bookLocation = input<IBookLocation | null>(null);

  previousState(): void {
    window.history.back();
  }
}
