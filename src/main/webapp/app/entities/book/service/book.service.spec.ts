import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IBook } from '../book.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../book.test-samples';

import { BookService } from './book.service';

const requireRestSample: IBook = {
  ...sampleWithRequiredData,
};

describe('Book Service', () => {
  let service: BookService;
  let httpMock: HttpTestingController;
  let expectedResult: IBook | IBook[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(BookService);
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

    it('should create a Book', () => {
      const book = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(book).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Book', () => {
      const book = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(book).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Book', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Book', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Book', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBookToCollectionIfMissing', () => {
      it('should add a Book to an empty array', () => {
        const book: IBook = sampleWithRequiredData;
        expectedResult = service.addBookToCollectionIfMissing([], book);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(book);
      });

      it('should not add a Book to an array that contains it', () => {
        const book: IBook = sampleWithRequiredData;
        const bookCollection: IBook[] = [
          {
            ...book,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBookToCollectionIfMissing(bookCollection, book);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Book to an array that doesn't contain it", () => {
        const book: IBook = sampleWithRequiredData;
        const bookCollection: IBook[] = [sampleWithPartialData];
        expectedResult = service.addBookToCollectionIfMissing(bookCollection, book);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(book);
      });

      it('should add only unique Book to an array', () => {
        const bookArray: IBook[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const bookCollection: IBook[] = [sampleWithRequiredData];
        expectedResult = service.addBookToCollectionIfMissing(bookCollection, ...bookArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const book: IBook = sampleWithRequiredData;
        const book2: IBook = sampleWithPartialData;
        expectedResult = service.addBookToCollectionIfMissing([], book, book2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(book);
        expect(expectedResult).toContain(book2);
      });

      it('should accept null and undefined values', () => {
        const book: IBook = sampleWithRequiredData;
        expectedResult = service.addBookToCollectionIfMissing([], null, book, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(book);
      });

      it('should return initial array if no Book is added', () => {
        const bookCollection: IBook[] = [sampleWithRequiredData];
        expectedResult = service.addBookToCollectionIfMissing(bookCollection, undefined, null);
        expect(expectedResult).toEqual(bookCollection);
      });
    });

    describe('compareBook', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBook(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 32624 };
        const entity2 = null;

        const compareResult1 = service.compareBook(entity1, entity2);
        const compareResult2 = service.compareBook(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 32624 };
        const entity2 = { id: 17120 };

        const compareResult1 = service.compareBook(entity1, entity2);
        const compareResult2 = service.compareBook(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 32624 };
        const entity2 = { id: 32624 };

        const compareResult1 = service.compareBook(entity1, entity2);
        const compareResult2 = service.compareBook(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
