import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IAuthor } from '../author.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../author.test-samples';

import { AuthorService, RestAuthor } from './author.service';

const requireRestSample: RestAuthor = {
  ...sampleWithRequiredData,
  birthDate: sampleWithRequiredData.birthDate?.toJSON(),
};

describe('Author Service', () => {
  let service: AuthorService;
  let httpMock: HttpTestingController;
  let expectedResult: IAuthor | IAuthor[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AuthorService);
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

    it('should create a Author', () => {
      const author = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(author).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Author', () => {
      const author = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(author).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Author', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Author', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Author', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAuthorToCollectionIfMissing', () => {
      it('should add a Author to an empty array', () => {
        const author: IAuthor = sampleWithRequiredData;
        expectedResult = service.addAuthorToCollectionIfMissing([], author);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(author);
      });

      it('should not add a Author to an array that contains it', () => {
        const author: IAuthor = sampleWithRequiredData;
        const authorCollection: IAuthor[] = [
          {
            ...author,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAuthorToCollectionIfMissing(authorCollection, author);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Author to an array that doesn't contain it", () => {
        const author: IAuthor = sampleWithRequiredData;
        const authorCollection: IAuthor[] = [sampleWithPartialData];
        expectedResult = service.addAuthorToCollectionIfMissing(authorCollection, author);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(author);
      });

      it('should add only unique Author to an array', () => {
        const authorArray: IAuthor[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const authorCollection: IAuthor[] = [sampleWithRequiredData];
        expectedResult = service.addAuthorToCollectionIfMissing(authorCollection, ...authorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const author: IAuthor = sampleWithRequiredData;
        const author2: IAuthor = sampleWithPartialData;
        expectedResult = service.addAuthorToCollectionIfMissing([], author, author2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(author);
        expect(expectedResult).toContain(author2);
      });

      it('should accept null and undefined values', () => {
        const author: IAuthor = sampleWithRequiredData;
        expectedResult = service.addAuthorToCollectionIfMissing([], null, author, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(author);
      });

      it('should return initial array if no Author is added', () => {
        const authorCollection: IAuthor[] = [sampleWithRequiredData];
        expectedResult = service.addAuthorToCollectionIfMissing(authorCollection, undefined, null);
        expect(expectedResult).toEqual(authorCollection);
      });
    });

    describe('compareAuthor', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAuthor(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 32542 };
        const entity2 = null;

        const compareResult1 = service.compareAuthor(entity1, entity2);
        const compareResult2 = service.compareAuthor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 32542 };
        const entity2 = { id: 11676 };

        const compareResult1 = service.compareAuthor(entity1, entity2);
        const compareResult2 = service.compareAuthor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 32542 };
        const entity2 = { id: 32542 };

        const compareResult1 = service.compareAuthor(entity1, entity2);
        const compareResult2 = service.compareAuthor(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
