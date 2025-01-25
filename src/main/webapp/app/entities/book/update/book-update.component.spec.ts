import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IBookLocation } from 'app/entities/book-location/book-location.model';
import { BookLocationService } from 'app/entities/book-location/service/book-location.service';
import { IAuthor } from 'app/entities/author/author.model';
import { AuthorService } from 'app/entities/author/service/author.service';
import { IBookCategory } from 'app/entities/book-category/book-category.model';
import { BookCategoryService } from 'app/entities/book-category/service/book-category.service';
import { IBook } from '../book.model';
import { BookService } from '../service/book.service';
import { BookFormService } from './book-form.service';

import { BookUpdateComponent } from './book-update.component';

describe('Book Management Update Component', () => {
  let comp: BookUpdateComponent;
  let fixture: ComponentFixture<BookUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bookFormService: BookFormService;
  let bookService: BookService;
  let bookLocationService: BookLocationService;
  let authorService: AuthorService;
  let bookCategoryService: BookCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BookUpdateComponent],
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
      .overrideTemplate(BookUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BookUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bookFormService = TestBed.inject(BookFormService);
    bookService = TestBed.inject(BookService);
    bookLocationService = TestBed.inject(BookLocationService);
    authorService = TestBed.inject(AuthorService);
    bookCategoryService = TestBed.inject(BookCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call location query and add missing value', () => {
      const book: IBook = { id: 17120 };
      const location: IBookLocation = { id: 31804 };
      book.location = location;

      const locationCollection: IBookLocation[] = [{ id: 31804 }];
      jest.spyOn(bookLocationService, 'query').mockReturnValue(of(new HttpResponse({ body: locationCollection })));
      const expectedCollection: IBookLocation[] = [location, ...locationCollection];
      jest.spyOn(bookLocationService, 'addBookLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ book });
      comp.ngOnInit();

      expect(bookLocationService.query).toHaveBeenCalled();
      expect(bookLocationService.addBookLocationToCollectionIfMissing).toHaveBeenCalledWith(locationCollection, location);
      expect(comp.locationsCollection).toEqual(expectedCollection);
    });

    it('Should call Author query and add missing value', () => {
      const book: IBook = { id: 17120 };
      const authors: IAuthor = { id: 32542 };
      book.authors = authors;

      const authorCollection: IAuthor[] = [{ id: 32542 }];
      jest.spyOn(authorService, 'query').mockReturnValue(of(new HttpResponse({ body: authorCollection })));
      const additionalAuthors = [authors];
      const expectedCollection: IAuthor[] = [...additionalAuthors, ...authorCollection];
      jest.spyOn(authorService, 'addAuthorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ book });
      comp.ngOnInit();

      expect(authorService.query).toHaveBeenCalled();
      expect(authorService.addAuthorToCollectionIfMissing).toHaveBeenCalledWith(
        authorCollection,
        ...additionalAuthors.map(expect.objectContaining),
      );
      expect(comp.authorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call BookCategory query and add missing value', () => {
      const book: IBook = { id: 17120 };
      const categories: IBookCategory = { id: 22271 };
      book.categories = categories;

      const bookCategoryCollection: IBookCategory[] = [{ id: 22271 }];
      jest.spyOn(bookCategoryService, 'query').mockReturnValue(of(new HttpResponse({ body: bookCategoryCollection })));
      const additionalBookCategories = [categories];
      const expectedCollection: IBookCategory[] = [...additionalBookCategories, ...bookCategoryCollection];
      jest.spyOn(bookCategoryService, 'addBookCategoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ book });
      comp.ngOnInit();

      expect(bookCategoryService.query).toHaveBeenCalled();
      expect(bookCategoryService.addBookCategoryToCollectionIfMissing).toHaveBeenCalledWith(
        bookCategoryCollection,
        ...additionalBookCategories.map(expect.objectContaining),
      );
      expect(comp.bookCategoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const book: IBook = { id: 17120 };
      const location: IBookLocation = { id: 31804 };
      book.location = location;
      const authors: IAuthor = { id: 32542 };
      book.authors = authors;
      const categories: IBookCategory = { id: 22271 };
      book.categories = categories;

      activatedRoute.data = of({ book });
      comp.ngOnInit();

      expect(comp.locationsCollection).toContainEqual(location);
      expect(comp.authorsSharedCollection).toContainEqual(authors);
      expect(comp.bookCategoriesSharedCollection).toContainEqual(categories);
      expect(comp.book).toEqual(book);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBook>>();
      const book = { id: 32624 };
      jest.spyOn(bookFormService, 'getBook').mockReturnValue(book);
      jest.spyOn(bookService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ book });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: book }));
      saveSubject.complete();

      // THEN
      expect(bookFormService.getBook).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bookService.update).toHaveBeenCalledWith(expect.objectContaining(book));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBook>>();
      const book = { id: 32624 };
      jest.spyOn(bookFormService, 'getBook').mockReturnValue({ id: null });
      jest.spyOn(bookService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ book: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: book }));
      saveSubject.complete();

      // THEN
      expect(bookFormService.getBook).toHaveBeenCalled();
      expect(bookService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBook>>();
      const book = { id: 32624 };
      jest.spyOn(bookService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ book });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bookService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBookLocation', () => {
      it('Should forward to bookLocationService', () => {
        const entity = { id: 31804 };
        const entity2 = { id: 1083 };
        jest.spyOn(bookLocationService, 'compareBookLocation');
        comp.compareBookLocation(entity, entity2);
        expect(bookLocationService.compareBookLocation).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAuthor', () => {
      it('Should forward to authorService', () => {
        const entity = { id: 32542 };
        const entity2 = { id: 11676 };
        jest.spyOn(authorService, 'compareAuthor');
        comp.compareAuthor(entity, entity2);
        expect(authorService.compareAuthor).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareBookCategory', () => {
      it('Should forward to bookCategoryService', () => {
        const entity = { id: 22271 };
        const entity2 = { id: 5748 };
        jest.spyOn(bookCategoryService, 'compareBookCategory');
        comp.compareBookCategory(entity, entity2);
        expect(bookCategoryService.compareBookCategory).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
