import { convertToUTC, formatDateForInput, validateDateRange } from '@/utils/time.helper';
import { FormControl, FormHelperText, FormLabel, Typography } from '@mui/joy';
import { ReactNode } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { MdOutlineInfo } from 'react-icons/md';

interface RHFDatePickerProps<T extends FieldValues> {
  label?: ReactNode | string;
  name: Path<T>;
  control?: Control<T>;
  className?: string;
  placeholder?: string;
  disable?: boolean;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

const RHFDatePicker = <T extends FieldValues>(props: RHFDatePickerProps<T>) => {
  const { minDate, maxDate } = props;

  return (
    <>
      <Controller
        control={props.control}
        name={props.name}
        rules={{
          required: props.required ? 'Thông tin này là bắt buộc.' : false,
          validate: (value) => validateDateRange(value, minDate, maxDate),
        }}
        render={({ field, fieldState }) => (
          <>
            <FormControl error={!!fieldState.error} sx={{ width: '100%' }}>
              {props.label && (
                <FormLabel>
                  {props.required && (
                    <Typography color='danger' level='title-sm'>
                      {`(*)`}
                    </Typography>
                  )}
                  {props.label}
                </FormLabel>
              )}
              <input
                {...field}
                value={field.value ? formatDateForInput(field.value) : ''}
                type='date'
                min={minDate ? formatDateForInput(minDate) : undefined}
                max={maxDate ? formatDateForInput(maxDate) : undefined}
                disabled={props.disable}
                onChange={(e) => {
                  const utcValue = convertToUTC(e.target.value);
                  field.onChange(utcValue); // Cập nhật giá trị dưới dạng UTC
                }}
                className={`tw-border tw-border-slate-300 tw-p-1 tw-pl-2 tw-rounded-md tw-shadow-sm tw-w-full tw-outline-primaryColor ${
                  props.className ? props.className : ''
                }`}
              />
              {!!fieldState.error && (
                <FormHelperText>
                  <MdOutlineInfo />
                  {fieldState.error?.message}
                </FormHelperText>
              )}
            </FormControl>
          </>
        )}
      />
    </>
  );
};

export default RHFDatePicker;
