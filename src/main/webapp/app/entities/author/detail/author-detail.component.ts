import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IAuthor } from '../author.model';

@Component({
  selector: 'jhi-author-detail',
  templateUrl: './author-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class AuthorDetailComponent {
  author = input<IAuthor | null>(null);

  previousState(): void {
    window.history.back();
  }
}
