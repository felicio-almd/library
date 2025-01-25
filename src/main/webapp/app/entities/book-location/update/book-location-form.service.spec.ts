import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../book-location.test-samples';

import { BookLocationFormService } from './book-location-form.service';

describe('BookLocation Form Service', () => {
  let service: BookLocationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookLocationFormService);
  });

  describe('Service methods', () => {
    describe('createBookLocationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBookLocationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            aisle: expect.any(Object),
            shelf: expect.any(Object),
          }),
        );
      });

      it('passing IBookLocation should create a new form with FormGroup', () => {
        const formGroup = service.createBookLocationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            aisle: expect.any(Object),
            shelf: expect.any(Object),
          }),
        );
      });
    });

    describe('getBookLocation', () => {
      it('should return NewBookLocation for default BookLocation initial value', () => {
        const formGroup = service.createBookLocationFormGroup(sampleWithNewData);

        const bookLocation = service.getBookLocation(formGroup) as any;

        expect(bookLocation).toMatchObject(sampleWithNewData);
      });

      it('should return NewBookLocation for empty BookLocation initial value', () => {
        const formGroup = service.createBookLocationFormGroup();

        const bookLocation = service.getBookLocation(formGroup) as any;

        expect(bookLocation).toMatchObject({});
      });

      it('should return IBookLocation', () => {
        const formGroup = service.createBookLocationFormGroup(sampleWithRequiredData);

        const bookLocation = service.getBookLocation(formGroup) as any;

        expect(bookLocation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBookLocation should not enable id FormControl', () => {
        const formGroup = service.createBookLocationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBookLocation should disable id FormControl', () => {
        const formGroup = service.createBookLocationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
