import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IBookCategory, NewBookCategory } from '../book-category.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBookCategory for edit and NewBookCategoryFormGroupInput for create.
 */
type BookCategoryFormGroupInput = IBookCategory | PartialWithRequiredKeyOf<NewBookCategory>;

type BookCategoryFormDefaults = Pick<NewBookCategory, 'id'>;

type BookCategoryFormGroupContent = {
  id: FormControl<IBookCategory['id'] | NewBookCategory['id']>;
  name: FormControl<IBookCategory['name']>;
  description: FormControl<IBookCategory['description']>;
};

export type BookCategoryFormGroup = FormGroup<BookCategoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BookCategoryFormService {
  createBookCategoryFormGroup(bookCategory: BookCategoryFormGroupInput = { id: null }): BookCategoryFormGroup {
    const bookCategoryRawValue = {
      ...this.getFormDefaults(),
      ...bookCategory,
    };
    return new FormGroup<BookCategoryFormGroupContent>({
      id: new FormControl(
        { value: bookCategoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(bookCategoryRawValue.name, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      description: new FormControl(bookCategoryRawValue.description),
    });
  }

  getBookCategory(form: BookCategoryFormGroup): IBookCategory | NewBookCategory {
    return form.getRawValue() as IBookCategory | NewBookCategory;
  }

  resetForm(form: BookCategoryFormGroup, bookCategory: BookCategoryFormGroupInput): void {
    const bookCategoryRawValue = { ...this.getFormDefaults(), ...bookCategory };
    form.reset(
      {
        ...bookCategoryRawValue,
        id: { value: bookCategoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BookCategoryFormDefaults {
    return {
      id: null,
    };
  }
}
