import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../borrow.test-samples';

import { BorrowFormService } from './borrow-form.service';

describe('Borrow Form Service', () => {
  let service: BorrowFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BorrowFormService);
  });

  describe('Service methods', () => {
    describe('createBorrowFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBorrowFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            borrowDateTime: expect.any(Object),
            returnDateTime: expect.any(Object),
            book: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });

      it('passing IBorrow should create a new form with FormGroup', () => {
        const formGroup = service.createBorrowFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            borrowDateTime: expect.any(Object),
            returnDateTime: expect.any(Object),
            book: expect.any(Object),
            user: expect.any(Object),
          }),
        );
      });
    });

    describe('getBorrow', () => {
      it('should return NewBorrow for default Borrow initial value', () => {
        const formGroup = service.createBorrowFormGroup(sampleWithNewData);

        const borrow = service.getBorrow(formGroup) as any;

        expect(borrow).toMatchObject(sampleWithNewData);
      });

      it('should return NewBorrow for empty Borrow initial value', () => {
        const formGroup = service.createBorrowFormGroup();

        const borrow = service.getBorrow(formGroup) as any;

        expect(borrow).toMatchObject({});
      });

      it('should return IBorrow', () => {
        const formGroup = service.createBorrowFormGroup(sampleWithRequiredData);

        const borrow = service.getBorrow(formGroup) as any;

        expect(borrow).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBorrow should not enable id FormControl', () => {
        const formGroup = service.createBorrowFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBorrow should disable id FormControl', () => {
        const formGroup = service.createBorrowFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
