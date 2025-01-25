import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IBookCategory } from '../book-category.model';
import { BookCategoryService } from '../service/book-category.service';
import { BookCategoryFormGroup, BookCategoryFormService } from './book-category-form.service';

@Component({
  selector: 'jhi-book-category-update',
  templateUrl: './book-category-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BookCategoryUpdateComponent implements OnInit {
  isSaving = false;
  bookCategory: IBookCategory | null = null;

  protected bookCategoryService = inject(BookCategoryService);
  protected bookCategoryFormService = inject(BookCategoryFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: BookCategoryFormGroup = this.bookCategoryFormService.createBookCategoryFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookCategory }) => {
      this.bookCategory = bookCategory;
      if (bookCategory) {
        this.updateForm(bookCategory);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bookCategory = this.bookCategoryFormService.getBookCategory(this.editForm);
    if (bookCategory.id !== null) {
      this.subscribeToSaveResponse(this.bookCategoryService.update(bookCategory));
    } else {
      this.subscribeToSaveResponse(this.bookCategoryService.create(bookCategory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBookCategory>>): void {
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

  protected updateForm(bookCategory: IBookCategory): void {
    this.bookCategory = bookCategory;
    this.bookCategoryFormService.resetForm(this.editForm, bookCategory);
  }
}
