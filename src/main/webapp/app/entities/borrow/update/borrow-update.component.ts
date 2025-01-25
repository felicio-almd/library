import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { BorrowService } from '../service/borrow.service';
import { IBorrow } from '../borrow.model';
import { BorrowFormGroup, BorrowFormService } from './borrow-form.service';

@Component({
  selector: 'jhi-borrow-update',
  templateUrl: './borrow-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BorrowUpdateComponent implements OnInit {
  isSaving = false;
  borrow: IBorrow | null = null;

  booksSharedCollection: IBook[] = [];
  usersSharedCollection: IUser[] = [];

  protected borrowService = inject(BorrowService);
  protected borrowFormService = inject(BorrowFormService);
  protected bookService = inject(BookService);
  protected userService = inject(UserService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: BorrowFormGroup = this.borrowFormService.createBorrowFormGroup();

  compareBook = (o1: IBook | null, o2: IBook | null): boolean => this.bookService.compareBook(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ borrow }) => {
      this.borrow = borrow;
      if (borrow) {
        this.updateForm(borrow);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const borrow = this.borrowFormService.getBorrow(this.editForm);
    if (borrow.id !== null) {
      this.subscribeToSaveResponse(this.borrowService.update(borrow));
    } else {
      this.subscribeToSaveResponse(this.borrowService.create(borrow));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBorrow>>): void {
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

  protected updateForm(borrow: IBorrow): void {
    this.borrow = borrow;
    this.borrowFormService.resetForm(this.editForm, borrow);

    this.booksSharedCollection = this.bookService.addBookToCollectionIfMissing<IBook>(this.booksSharedCollection, borrow.book);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, borrow.user);
  }

  protected loadRelationshipsOptions(): void {
    this.bookService
      .query()
      .pipe(map((res: HttpResponse<IBook[]>) => res.body ?? []))
      .pipe(map((books: IBook[]) => this.bookService.addBookToCollectionIfMissing<IBook>(books, this.borrow?.book)))
      .subscribe((books: IBook[]) => (this.booksSharedCollection = books));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.borrow?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
