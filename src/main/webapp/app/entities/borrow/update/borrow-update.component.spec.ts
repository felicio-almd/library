import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IBorrow } from '../borrow.model';
import { BorrowService } from '../service/borrow.service';
import { BorrowFormService } from './borrow-form.service';

import { BorrowUpdateComponent } from './borrow-update.component';

describe('Borrow Management Update Component', () => {
  let comp: BorrowUpdateComponent;
  let fixture: ComponentFixture<BorrowUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let borrowFormService: BorrowFormService;
  let borrowService: BorrowService;
  let bookService: BookService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BorrowUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(BorrowUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BorrowUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    borrowFormService = TestBed.inject(BorrowFormService);
    borrowService = TestBed.inject(BorrowService);
    bookService = TestBed.inject(BookService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Book query and add missing value', () => {
      const borrow: IBorrow = { id: 23587 };
      const book: IBook = { id: 32624 };
      borrow.book = book;

      const bookCollection: IBook[] = [{ id: 32624 }];
      jest.spyOn(bookService, 'query').mockReturnValue(of(new HttpResponse({ body: bookCollection })));
      const additionalBooks = [book];
      const expectedCollection: IBook[] = [...additionalBooks, ...bookCollection];
      jest.spyOn(bookService, 'addBookToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ borrow });
      comp.ngOnInit();

      expect(bookService.query).toHaveBeenCalled();
      expect(bookService.addBookToCollectionIfMissing).toHaveBeenCalledWith(
        bookCollection,
        ...additionalBooks.map(expect.objectContaining),
      );
      expect(comp.booksSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const borrow: IBorrow = { id: 23587 };
      const user: IUser = { id: 3944 };
      borrow.user = user;

      const userCollection: IUser[] = [{ id: 3944 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ borrow });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const borrow: IBorrow = { id: 23587 };
      const book: IBook = { id: 32624 };
      borrow.book = book;
      const user: IUser = { id: 3944 };
      borrow.user = user;

      activatedRoute.data = of({ borrow });
      comp.ngOnInit();

      expect(comp.booksSharedCollection).toContainEqual(book);
      expect(comp.usersSharedCollection).toContainEqual(user);
      expect(comp.borrow).toEqual(borrow);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBorrow>>();
      const borrow = { id: 10965 };
      jest.spyOn(borrowFormService, 'getBorrow').mockReturnValue(borrow);
      jest.spyOn(borrowService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ borrow });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: borrow }));
      saveSubject.complete();

      // THEN
      expect(borrowFormService.getBorrow).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(borrowService.update).toHaveBeenCalledWith(expect.objectContaining(borrow));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBorrow>>();
      const borrow = { id: 10965 };
      jest.spyOn(borrowFormService, 'getBorrow').mockReturnValue({ id: null });
      jest.spyOn(borrowService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ borrow: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: borrow }));
      saveSubject.complete();

      // THEN
      expect(borrowFormService.getBorrow).toHaveBeenCalled();
      expect(borrowService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBorrow>>();
      const borrow = { id: 10965 };
      jest.spyOn(borrowService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ borrow });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(borrowService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBook', () => {
      it('Should forward to bookService', () => {
        const entity = { id: 32624 };
        const entity2 = { id: 17120 };
        jest.spyOn(bookService, 'compareBook');
        comp.compareBook(entity, entity2);
        expect(bookService.compareBook).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 3944 };
        const entity2 = { id: 6275 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
