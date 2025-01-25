import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IBookLocation } from '../book-location.model';
import { BookLocationService } from '../service/book-location.service';
import { BookLocationFormGroup, BookLocationFormService } from './book-location-form.service';

@Component({
  selector: 'jhi-book-location-update',
  templateUrl: './book-location-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BookLocationUpdateComponent implements OnInit {
  isSaving = false;
  bookLocation: IBookLocation | null = null;

  protected bookLocationService = inject(BookLocationService);
  protected bookLocationFormService = inject(BookLocationFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: BookLocationFormGroup = this.bookLocationFormService.createBookLocationFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookLocation }) => {
      this.bookLocation = bookLocation;
      if (bookLocation) {
        this.updateForm(bookLocation);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bookLocation = this.bookLocationFormService.getBookLocation(this.editForm);
    if (bookLocation.id !== null) {
      this.subscribeToSaveResponse(this.bookLocationService.update(bookLocation));
    } else {
      this.subscribeToSaveResponse(this.bookLocationService.create(bookLocation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBookLocation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(bookLocation: IBookLocation): void {
    this.bookLocation = bookLocation;
    this.bookLocationFormService.resetForm(this.editForm, bookLocation);
  }
}
