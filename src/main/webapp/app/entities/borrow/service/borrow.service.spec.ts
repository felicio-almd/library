import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IBorrow } from '../borrow.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../borrow.test-samples';

import { BorrowService, RestBorrow } from './borrow.service';

const requireRestSample: RestBorrow = {
  ...sampleWithRequiredData,
  borrowDateTime: sampleWithRequiredData.borrowDateTime?.toJSON(),
  returnDateTime: sampleWithRequiredData.returnDateTime?.toJSON(),
};

describe('Borrow Service', () => {
  let service: BorrowService;
  let httpMock: HttpTestingController;
  let expectedResult: IBorrow | IBorrow[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(BorrowService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Borrow', () => {
      const borrow = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(borrow).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Borrow', () => {
      const borrow = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(borrow).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Borrow', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Borrow', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Borrow', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBorrowToCollectionIfMissing', () => {
      it('should add a Borrow to an empty array', () => {
        const borrow: IBorrow = sampleWithRequiredData;
        expectedResult = service.addBorrowToCollectionIfMissing([], borrow);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(borrow);
      });

      it('should not add a Borrow to an array that contains it', () => {
        const borrow: IBorrow = sampleWithRequiredData;
        const borrowCollection: IBorrow[] = [
          {
            ...borrow,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBorrowToCollectionIfMissing(borrowCollection, borrow);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Borrow to an array that doesn't contain it", () => {
        const borrow: IBorrow = sampleWithRequiredData;
        const borrowCollection: IBorrow[] = [sampleWithPartialData];
        expectedResult = service.addBorrowToCollectionIfMissing(borrowCollection, borrow);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(borrow);
      });

      it('should add only unique Borrow to an array', () => {
        const borrowArray: IBorrow[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const borrowCollection: IBorrow[] = [sampleWithRequiredData];
        expectedResult = service.addBorrowToCollectionIfMissing(borrowCollection, ...borrowArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const borrow: IBorrow = sampleWithRequiredData;
        const borrow2: IBorrow = sampleWithPartialData;
        expectedResult = service.addBorrowToCollectionIfMissing([], borrow, borrow2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(borrow);
        expect(expectedResult).toContain(borrow2);
      });

      it('should accept null and undefined values', () => {
        const borrow: IBorrow = sampleWithRequiredData;
        expectedResult = service.addBorrowToCollectionIfMissing([], null, borrow, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(borrow);
      });

      it('should return initial array if no Borrow is added', () => {
        const borrowCollection: IBorrow[] = [sampleWithRequiredData];
        expectedResult = service.addBorrowToCollectionIfMissing(borrowCollection, undefined, null);
        expect(expectedResult).toEqual(borrowCollection);
      });
    });

    describe('compareBorrow', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBorrow(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 10965 };
        const entity2 = null;

        const compareResult1 = service.compareBorrow(entity1, entity2);
        const compareResult2 = service.compareBorrow(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 10965 };
        const entity2 = { id: 23587 };

        const compareResult1 = service.compareBorrow(entity1, entity2);
        const compareResult2 = service.compareBorrow(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 10965 };
        const entity2 = { id: 10965 };

        const compareResult1 = service.compareBorrow(entity1, entity2);
        const compareResult2 = service.compareBorrow(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
