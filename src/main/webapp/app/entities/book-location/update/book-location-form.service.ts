import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IBookLocation, NewBookLocation } from '../book-location.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBookLocation for edit and NewBookLocationFormGroupInput for create.
 */
type BookLocationFormGroupInput = IBookLocation | PartialWithRequiredKeyOf<NewBookLocation>;

type BookLocationFormDefaults = Pick<NewBookLocation, 'id'>;

type BookLocationFormGroupContent = {
  id: FormControl<IBookLocation['id'] | NewBookLocation['id']>;
  aisle: FormControl<IBookLocation['aisle']>;
  shelf: FormControl<IBookLocation['shelf']>;
};

export type BookLocationFormGroup = FormGroup<BookLocationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BookLocationFormService {
  createBookLocationFormGroup(bookLocation: BookLocationFormGroupInput = { id: null }): BookLocationFormGroup {
    const bookLocationRawValue = {
      ...this.getFormDefaults(),
      ...bookLocation,
    };
    return new FormGroup<BookLocationFormGroupContent>({
      id: new FormControl(
        { value: bookLocationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      aisle: new FormControl(bookLocationRawValue.aisle, {
        validators: [Validators.required],
      }),
      shelf: new FormControl(bookLocationRawValue.shelf, {
        validators: [Validators.required],
      }),
    });
  }

  getBookLocation(form: BookLocationFormGroup): IBookLocation | NewBookLocation {
    return form.getRawValue() as IBookLocation | NewBookLocation;
  }

  resetForm(form: BookLocationFormGroup, bookLocation: BookLocationFormGroupInput): void {
    const bookLocationRawValue = { ...this.getFormDefaults(), ...bookLocation };
    form.reset(
      {
        ...bookLocationRawValue,
        id: { value: bookLocationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BookLocationFormDefaults {
    return {
      id: null,
    };
  }
}
