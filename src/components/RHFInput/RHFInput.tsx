import { FormControl, FormHelperText, FormLabel, Input, InputProps, Typography } from '@mui/joy';
import { ReactNode } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { MdOutlineInfo } from 'react-icons/md';

interface RHFInputProps<T extends FieldValues> {
  label?: ReactNode | string;
  name: Path<T>;
  control?: Control<T>;
  className?: string;
  placeholder?: string;
  minWidth?: number | string;
  disable?: boolean;
  type?: 'text' | 'email' | 'number';
  required?: boolean;
}

const RHFInput = <T extends FieldValues>(props: RHFInputProps<T> & InputProps) => {
  const { minWidth = 0, name, className, placeholder, disable, type, required, control, label, ...others } = props;

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <FormControl error={!!fieldState.error}>
              {label && (
                <FormLabel>
                  {required && <Typography color='danger' level='title-sm'>{`(*)`}</Typography>}
                  {label}
                </FormLabel>
              )}
              <Input
                sx={{ minWidth: `${minWidth}px` }}
                disabled={disable}
                placeholder={placeholder || ''}
                className={className}
                type={type || 'text'}
                {...field}
                onChange={(e) => field.onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
                value={field.value ?? ''}
                required={required}
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

export default RHFInput;
