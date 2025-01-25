import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IBorrow, NewBorrow } from '../borrow.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBorrow for edit and NewBorrowFormGroupInput for create.
 */
type BorrowFormGroupInput = IBorrow | PartialWithRequiredKeyOf<NewBorrow>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IBorrow | NewBorrow> = Omit<T, 'borrowDateTime' | 'returnDateTime'> & {
  borrowDateTime?: string | null;
  returnDateTime?: string | null;
};

type BorrowFormRawValue = FormValueOf<IBorrow>;

type NewBorrowFormRawValue = FormValueOf<NewBorrow>;

type BorrowFormDefaults = Pick<NewBorrow, 'id' | 'borrowDateTime' | 'returnDateTime'>;

type BorrowFormGroupContent = {
  id: FormControl<BorrowFormRawValue['id'] | NewBorrow['id']>;
  borrowDateTime: FormControl<BorrowFormRawValue['borrowDateTime']>;
  returnDateTime: FormControl<BorrowFormRawValue['returnDateTime']>;
  book: FormControl<BorrowFormRawValue['book']>;
  user: FormControl<BorrowFormRawValue['user']>;
};

export type BorrowFormGroup = FormGroup<BorrowFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BorrowFormService {
  createBorrowFormGroup(borrow: BorrowFormGroupInput = { id: null }): BorrowFormGroup {
    const borrowRawValue = this.convertBorrowToBorrowRawValue({
      ...this.getFormDefaults(),
      ...borrow,
    });
    return new FormGroup<BorrowFormGroupContent>({
      id: new FormControl(
        { value: borrowRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      borrowDateTime: new FormControl(borrowRawValue.borrowDateTime, {
        validators: [Validators.required],
      }),
      returnDateTime: new FormControl(borrowRawValue.returnDateTime),
      book: new FormControl(borrowRawValue.book),
      user: new FormControl(borrowRawValue.user),
    });
  }

  getBorrow(form: BorrowFormGroup): IBorrow | NewBorrow {
    return this.convertBorrowRawValueToBorrow(form.getRawValue() as BorrowFormRawValue | NewBorrowFormRawValue);
  }

  resetForm(form: BorrowFormGroup, borrow: BorrowFormGroupInput): void {
    const borrowRawValue = this.convertBorrowToBorrowRawValue({ ...this.getFormDefaults(), ...borrow });
    form.reset(
      {
        ...borrowRawValue,
        id: { value: borrowRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BorrowFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      borrowDateTime: currentTime,
      returnDateTime: currentTime,
    };
  }

  private convertBorrowRawValueToBorrow(rawBorrow: BorrowFormRawValue | NewBorrowFormRawValue): IBorrow | NewBorrow {
    return {
      ...rawBorrow,
      borrowDateTime: dayjs(rawBorrow.borrowDateTime, DATE_TIME_FORMAT),
      returnDateTime: dayjs(rawBorrow.returnDateTime, DATE_TIME_FORMAT),
    };
  }

  private convertBorrowToBorrowRawValue(
    borrow: IBorrow | (Partial<NewBorrow> & BorrowFormDefaults),
  ): BorrowFormRawValue | PartialWithRequiredKeyOf<NewBorrowFormRawValue> {
    return {
      ...borrow,
      borrowDateTime: borrow.borrowDateTime ? borrow.borrowDateTime.format(DATE_TIME_FORMAT) : undefined,
      returnDateTime: borrow.returnDateTime ? borrow.returnDateTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
