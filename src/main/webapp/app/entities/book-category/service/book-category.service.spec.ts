import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IBookCategory } from '../book-category.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../book-category.test-samples';

import { BookCategoryService } from './book-category.service';

const requireRestSample: IBookCategory = {
  ...sampleWithRequiredData,
};

describe('BookCategory Service', () => {
  let service: BookCategoryService;
  let httpMock: HttpTestingController;
  let expectedResult: IBookCategory | IBookCategory[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(BookCategoryService);
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

    it('should create a BookCategory', () => {
      const bookCategory = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(bookCategory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BookCategory', () => {
      const bookCategory = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(bookCategory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BookCategory', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BookCategory', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BookCategory', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBookCategoryToCollectionIfMissing', () => {
      it('should add a BookCategory to an empty array', () => {
        const bookCategory: IBookCategory = sampleWithRequiredData;
        expectedResult = service.addBookCategoryToCollectionIfMissing([], bookCategory);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bookCategory);
      });

      it('should not add a BookCategory to an array that contains it', () => {
        const bookCategory: IBookCategory = sampleWithRequiredData;
        const bookCategoryCollection: IBookCategory[] = [
          {
            ...bookCategory,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBookCategoryToCollectionIfMissing(bookCategoryCollection, bookCategory);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BookCategory to an array that doesn't contain it", () => {
        const bookCategory: IBookCategory = sampleWithRequiredData;
        const bookCategoryCollection: IBookCategory[] = [sampleWithPartialData];
        expectedResult = service.addBookCategoryToCollectionIfMissing(bookCategoryCollection, bookCategory);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bookCategory);
      });

      it('should add only unique BookCategory to an array', () => {
        const bookCategoryArray: IBookCategory[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const bookCategoryCollection: IBookCategory[] = [sampleWithRequiredData];
        expectedResult = service.addBookCategoryToCollectionIfMissing(bookCategoryCollection, ...bookCategoryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bookCategory: IBookCategory = sampleWithRequiredData;
        const bookCategory2: IBookCategory = sampleWithPartialData;
        expectedResult = service.addBookCategoryToCollectionIfMissing([], bookCategory, bookCategory2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bookCategory);
        expect(expectedResult).toContain(bookCategory2);
      });

      it('should accept null and undefined values', () => {
        const bookCategory: IBookCategory = sampleWithRequiredData;
        expectedResult = service.addBookCategoryToCollectionIfMissing([], null, bookCategory, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bookCategory);
      });

      it('should return initial array if no BookCategory is added', () => {
        const bookCategoryCollection: IBookCategory[] = [sampleWithRequiredData];
        expectedResult = service.addBookCategoryToCollectionIfMissing(bookCategoryCollection, undefined, null);
        expect(expectedResult).toEqual(bookCategoryCollection);
      });
    });

    describe('compareBookCategory', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBookCategory(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 22271 };
        const entity2 = null;

        const compareResult1 = service.compareBookCategory(entity1, entity2);
        const compareResult2 = service.compareBookCategory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 22271 };
        const entity2 = { id: 5748 };

        const compareResult1 = service.compareBookCategory(entity1, entity2);
        const compareResult2 = service.compareBookCategory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 22271 };
        const entity2 = { id: 22271 };

        const compareResult1 = service.compareBookCategory(entity1, entity2);
        const compareResult2 = service.compareBookCategory(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
