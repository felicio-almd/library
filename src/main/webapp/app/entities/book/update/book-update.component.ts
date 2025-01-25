import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IBookLocation } from 'app/entities/book-location/book-location.model';
import { BookLocationService } from 'app/entities/book-location/service/book-location.service';
import { IAuthor } from 'app/entities/author/author.model';
import { AuthorService } from 'app/entities/author/service/author.service';
import { IBookCategory } from 'app/entities/book-category/book-category.model';
import { BookCategoryService } from 'app/entities/book-category/service/book-category.service';
import { BookService } from '../service/book.service';
import { IBook } from '../book.model';
import { BookFormGroup, BookFormService } from './book-form.service';

@Component({
  selector: 'jhi-book-update',
  templateUrl: './book-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BookUpdateComponent implements OnInit {
  isSaving = false;
  book: IBook | null = null;

  locationsCollection: IBookLocation[] = [];
  authorsSharedCollection: IAuthor[] = [];
  bookCategoriesSharedCollection: IBookCategory[] = [];

  protected bookService = inject(BookService);
  protected bookFormService = inject(BookFormService);
  protected bookLocationService = inject(BookLocationService);
  protected authorService = inject(AuthorService);
  protected bookCategoryService = inject(BookCategoryService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: BookFormGroup = this.bookFormService.createBookFormGroup();

  compareBookLocation = (o1: IBookLocation | null, o2: IBookLocation | null): boolean =>
    this.bookLocationService.compareBookLocation(o1, o2);

  compareAuthor = (o1: IAuthor | null, o2: IAuthor | null): boolean => this.authorService.compareAuthor(o1, o2);

  compareBookCategory = (o1: IBookCategory | null, o2: IBookCategory | null): boolean =>
    this.bookCategoryService.compareBookCategory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ book }) => {
      this.book = book;
      if (book) {
        this.updateForm(book);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const book = this.bookFormService.getBook(this.editForm);
    if (book.id !== null) {
      this.subscribeToSaveResponse(this.bookService.update(book));
    } else {
      this.subscribeToSaveResponse(this.bookService.create(book));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBook>>): void {
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

  protected updateForm(book: IBook): void {
    this.book = book;
    this.bookFormService.resetForm(this.editForm, book);

    this.locationsCollection = this.bookLocationService.addBookLocationToCollectionIfMissing<IBookLocation>(
      this.locationsCollection,
      book.location,
    );
    this.authorsSharedCollection = this.authorService.addAuthorToCollectionIfMissing<IAuthor>(this.authorsSharedCollection, book.authors);
    this.bookCategoriesSharedCollection = this.bookCategoryService.addBookCategoryToCollectionIfMissing<IBookCategory>(
      this.bookCategoriesSharedCollection,
      book.categories,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.bookLocationService
      .query({ filter: 'book-is-null' })
      .pipe(map((res: HttpResponse<IBookLocation[]>) => res.body ?? []))
      .pipe(
        map((bookLocations: IBookLocation[]) =>
          this.bookLocationService.addBookLocationToCollectionIfMissing<IBookLocation>(bookLocations, this.book?.location),
        ),
      )
      .subscribe((bookLocations: IBookLocation[]) => (this.locationsCollection = bookLocations));

    this.authorService
      .query()
      .pipe(map((res: HttpResponse<IAuthor[]>) => res.body ?? []))
      .pipe(map((authors: IAuthor[]) => this.authorService.addAuthorToCollectionIfMissing<IAuthor>(authors, this.book?.authors)))
      .subscribe((authors: IAuthor[]) => (this.authorsSharedCollection = authors));

    this.bookCategoryService
      .query()
      .pipe(map((res: HttpResponse<IBookCategory[]>) => res.body ?? []))
      .pipe(
        map((bookCategories: IBookCategory[]) =>
          this.bookCategoryService.addBookCategoryToCollectionIfMissing<IBookCategory>(bookCategories, this.book?.categories),
        ),
      )
      .subscribe((bookCategories: IBookCategory[]) => (this.bookCategoriesSharedCollection = bookCategories));
  }
}
