import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../book-category.test-samples';

import { BookCategoryFormService } from './book-category-form.service';

describe('BookCategory Form Service', () => {
  let service: BookCategoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookCategoryFormService);
  });

  describe('Service methods', () => {
    describe('createBookCategoryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBookCategoryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
          }),
        );
      });

      it('passing IBookCategory should create a new form with FormGroup', () => {
        const formGroup = service.createBookCategoryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
          }),
        );
      });
    });

    describe('getBookCategory', () => {
      it('should return NewBookCategory for default BookCategory initial value', () => {
        const formGroup = service.createBookCategoryFormGroup(sampleWithNewData);

        const bookCategory = service.getBookCategory(formGroup) as any;

        expect(bookCategory).toMatchObject(sampleWithNewData);
      });

      it('should return NewBookCategory for empty BookCategory initial value', () => {
        const formGroup = service.createBookCategoryFormGroup();

        const bookCategory = service.getBookCategory(formGroup) as any;

        expect(bookCategory).toMatchObject({});
      });

      it('should return IBookCategory', () => {
        const formGroup = service.createBookCategoryFormGroup(sampleWithRequiredData);

        const bookCategory = service.getBookCategory(formGroup) as any;

        expect(bookCategory).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBookCategory should not enable id FormControl', () => {
        const formGroup = service.createBookCategoryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBookCategory should disable id FormControl', () => {
        const formGroup = service.createBookCategoryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
