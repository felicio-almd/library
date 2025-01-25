import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAuthor, NewAuthor } from '../author.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAuthor for edit and NewAuthorFormGroupInput for create.
 */
type AuthorFormGroupInput = IAuthor | PartialWithRequiredKeyOf<NewAuthor>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAuthor | NewAuthor> = Omit<T, 'birthDate'> & {
  birthDate?: string | null;
};

type AuthorFormRawValue = FormValueOf<IAuthor>;

type NewAuthorFormRawValue = FormValueOf<NewAuthor>;

type AuthorFormDefaults = Pick<NewAuthor, 'id' | 'birthDate'>;

type AuthorFormGroupContent = {
  id: FormControl<AuthorFormRawValue['id'] | NewAuthor['id']>;
  name: FormControl<AuthorFormRawValue['name']>;
  birthDate: FormControl<AuthorFormRawValue['birthDate']>;
};

export type AuthorFormGroup = FormGroup<AuthorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AuthorFormService {
  createAuthorFormGroup(author: AuthorFormGroupInput = { id: null }): AuthorFormGroup {
    const authorRawValue = this.convertAuthorToAuthorRawValue({
      ...this.getFormDefaults(),
      ...author,
    });
    return new FormGroup<AuthorFormGroupContent>({
      id: new FormControl(
        { value: authorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(authorRawValue.name, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      birthDate: new FormControl(authorRawValue.birthDate),
    });
  }

  getAuthor(form: AuthorFormGroup): IAuthor | NewAuthor {
    return this.convertAuthorRawValueToAuthor(form.getRawValue() as AuthorFormRawValue | NewAuthorFormRawValue);
  }

  resetForm(form: AuthorFormGroup, author: AuthorFormGroupInput): void {
    const authorRawValue = this.convertAuthorToAuthorRawValue({ ...this.getFormDefaults(), ...author });
    form.reset(
      {
        ...authorRawValue,
        id: { value: authorRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AuthorFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      birthDate: currentTime,
    };
  }

  private convertAuthorRawValueToAuthor(rawAuthor: AuthorFormRawValue | NewAuthorFormRawValue): IAuthor | NewAuthor {
    return {
      ...rawAuthor,
      birthDate: dayjs(rawAuthor.birthDate, DATE_TIME_FORMAT),
    };
  }

  private convertAuthorToAuthorRawValue(
    author: IAuthor | (Partial<NewAuthor> & AuthorFormDefaults),
  ): AuthorFormRawValue | PartialWithRequiredKeyOf<NewAuthorFormRawValue> {
    return {
      ...author,
      birthDate: author.birthDate ? author.birthDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
