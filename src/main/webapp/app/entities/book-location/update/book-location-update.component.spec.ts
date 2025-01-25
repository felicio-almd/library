import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { BookLocationService } from '../service/book-location.service';
import { IBookLocation } from '../book-location.model';
import { BookLocationFormService } from './book-location-form.service';

import { BookLocationUpdateComponent } from './book-location-update.component';

describe('BookLocation Management Update Component', () => {
  let comp: BookLocationUpdateComponent;
  let fixture: ComponentFixture<BookLocationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bookLocationFormService: BookLocationFormService;
  let bookLocationService: BookLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BookLocationUpdateComponent],
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
      .overrideTemplate(BookLocationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BookLocationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bookLocationFormService = TestBed.inject(BookLocationFormService);
    bookLocationService = TestBed.inject(BookLocationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const bookLocation: IBookLocation = { id: 1083 };

      activatedRoute.data = of({ bookLocation });
      comp.ngOnInit();

      expect(comp.bookLocation).toEqual(bookLocation);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBookLocation>>();
      const bookLocation = { id: 31804 };
      jest.spyOn(bookLocationFormService, 'getBookLocation').mockReturnValue(bookLocation);
      jest.spyOn(bookLocationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bookLocation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bookLocation }));
      saveSubject.complete();

      // THEN
      expect(bookLocationFormService.getBookLocation).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bookLocationService.update).toHaveBeenCalledWith(expect.objectContaining(bookLocation));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBookLocation>>();
      const bookLocation = { id: 31804 };
      jest.spyOn(bookLocationFormService, 'getBookLocation').mockReturnValue({ id: null });
      jest.spyOn(bookLocationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bookLocation: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bookLocation }));
      saveSubject.complete();

      // THEN
      expect(bookLocationFormService.getBookLocation).toHaveBeenCalled();
      expect(bookLocationService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBookLocation>>();
      const bookLocation = { id: 31804 };
      jest.spyOn(bookLocationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bookLocation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bookLocationService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
