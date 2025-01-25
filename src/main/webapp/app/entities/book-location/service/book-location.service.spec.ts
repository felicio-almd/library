import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IBookLocation } from '../book-location.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../book-location.test-samples';

import { BookLocationService } from './book-location.service';

const requireRestSample: IBookLocation = {
  ...sampleWithRequiredData,
};

describe('BookLocation Service', () => {
  let service: BookLocationService;
  let httpMock: HttpTestingController;
  let expectedResult: IBookLocation | IBookLocation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(BookLocationService);
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

    it('should create a BookLocation', () => {
      const bookLocation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(bookLocation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BookLocation', () => {
      const bookLocation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(bookLocation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BookLocation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BookLocation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BookLocation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBookLocationToCollectionIfMissing', () => {
      it('should add a BookLocation to an empty array', () => {
        const bookLocation: IBookLocation = sampleWithRequiredData;
        expectedResult = service.addBookLocationToCollectionIfMissing([], bookLocation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bookLocation);
      });

      it('should not add a BookLocation to an array that contains it', () => {
        const bookLocation: IBookLocation = sampleWithRequiredData;
        const bookLocationCollection: IBookLocation[] = [
          {
            ...bookLocation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBookLocationToCollectionIfMissing(bookLocationCollection, bookLocation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BookLocation to an array that doesn't contain it", () => {
        const bookLocation: IBookLocation = sampleWithRequiredData;
        const bookLocationCollection: IBookLocation[] = [sampleWithPartialData];
        expectedResult = service.addBookLocationToCollectionIfMissing(bookLocationCollection, bookLocation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bookLocation);
      });

      it('should add only unique BookLocation to an array', () => {
        const bookLocationArray: IBookLocation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const bookLocationCollection: IBookLocation[] = [sampleWithRequiredData];
        expectedResult = service.addBookLocationToCollectionIfMissing(bookLocationCollection, ...bookLocationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bookLocation: IBookLocation = sampleWithRequiredData;
        const bookLocation2: IBookLocation = sampleWithPartialData;
        expectedResult = service.addBookLocationToCollectionIfMissing([], bookLocation, bookLocation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bookLocation);
        expect(expectedResult).toContain(bookLocation2);
      });

      it('should accept null and undefined values', () => {
        const bookLocation: IBookLocation = sampleWithRequiredData;
        expectedResult = service.addBookLocationToCollectionIfMissing([], null, bookLocation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bookLocation);
      });

      it('should return initial array if no BookLocation is added', () => {
        const bookLocationCollection: IBookLocation[] = [sampleWithRequiredData];
        expectedResult = service.addBookLocationToCollectionIfMissing(bookLocationCollection, undefined, null);
        expect(expectedResult).toEqual(bookLocationCollection);
      });
    });

    describe('compareBookLocation', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBookLocation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 31804 };
        const entity2 = null;

        const compareResult1 = service.compareBookLocation(entity1, entity2);
        const compareResult2 = service.compareBookLocation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 31804 };
        const entity2 = { id: 1083 };

        const compareResult1 = service.compareBookLocation(entity1, entity2);
        const compareResult2 = service.compareBookLocation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 31804 };
        const entity2 = { id: 31804 };

        const compareResult1 = service.compareBookLocation(entity1, entity2);
        const compareResult2 = service.compareBookLocation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
