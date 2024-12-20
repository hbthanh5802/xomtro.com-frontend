import { phoneRegex } from '@/validations/common.validation';
import { FormControl, FormHelperText, FormLabel, Input, InputProps, Typography } from '@mui/joy';
import { ReactNode } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { MdOutlineInfo } from 'react-icons/md';

interface RHFPhoneInputProps<T extends FieldValues> {
  label?: ReactNode | string;
  name: Path<T>;
  control?: Control<T>;
  className?: string;
  placeholder?: string;
  disable?: boolean;
  required?: boolean;
}

const RHFPhoneInput = <T extends FieldValues>(props: RHFPhoneInputProps<T> & InputProps) => {
  const { ...others } = props;
  return (
    <>
      <Controller
        control={props.control}
        name={props.name}
        rules={{
          required: 'Số điện thoại là bắt buộc',
          pattern: {
            value: phoneRegex,
            message: 'Số điện thoại không hợp lệ',
          },
        }}
        render={({ field, fieldState }) => (
          <>
            <FormControl error={!!fieldState.error}>
              {props.label && (
                <FormLabel>
                  {props.required && <Typography color='danger' level='title-sm'>{`(*)`}</Typography>}
                  {props.label}
                </FormLabel>
              )}
              <Input
                disabled={props.disable}
                className={props.className}
                placeholder={props.placeholder || 'Nhập thông tin của bạn'}
                type={'tel'}
                {...field}
                value={field.value ?? ''}
                {...others}
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

export default RHFPhoneInput;
