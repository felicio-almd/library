import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { BookCategoryService } from '../service/book-category.service';
import { IBookCategory } from '../book-category.model';
import { BookCategoryFormService } from './book-category-form.service';

import { BookCategoryUpdateComponent } from './book-category-update.component';

describe('BookCategory Management Update Component', () => {
  let comp: BookCategoryUpdateComponent;
  let fixture: ComponentFixture<BookCategoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bookCategoryFormService: BookCategoryFormService;
  let bookCategoryService: BookCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BookCategoryUpdateComponent],
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
      .overrideTemplate(BookCategoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BookCategoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bookCategoryFormService = TestBed.inject(BookCategoryFormService);
    bookCategoryService = TestBed.inject(BookCategoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const bookCategory: IBookCategory = { id: 5748 };

      activatedRoute.data = of({ bookCategory });
      comp.ngOnInit();

      expect(comp.bookCategory).toEqual(bookCategory);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBookCategory>>();
      const bookCategory = { id: 22271 };
      jest.spyOn(bookCategoryFormService, 'getBookCategory').mockReturnValue(bookCategory);
      jest.spyOn(bookCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bookCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bookCategory }));
      saveSubject.complete();

      // THEN
      expect(bookCategoryFormService.getBookCategory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bookCategoryService.update).toHaveBeenCalledWith(expect.objectContaining(bookCategory));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBookCategory>>();
      const bookCategory = { id: 22271 };
      jest.spyOn(bookCategoryFormService, 'getBookCategory').mockReturnValue({ id: null });
      jest.spyOn(bookCategoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bookCategory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bookCategory }));
      saveSubject.complete();

      // THEN
      expect(bookCategoryFormService.getBookCategory).toHaveBeenCalled();
      expect(bookCategoryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBookCategory>>();
      const bookCategory = { id: 22271 };
      jest.spyOn(bookCategoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bookCategory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bookCategoryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
