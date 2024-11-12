import { FormControl, FormHelperText, FormLabel, Input } from '@mui/joy';
import { ReactNode } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { MdOutlineInfo } from 'react-icons/md';

interface RHFInputProps<T extends FieldValues> {
  label?: ReactNode | string;
  name: Path<T>;
  control?: Control<T>;
  className?: string;
  placeholder?: string;
  disable?: boolean;
  type?: 'text' | 'email';
}

const RHFInput = <T extends FieldValues>(props: RHFInputProps<T>) => {
  return (
    <>
      <Controller
        control={props.control}
        name={props.name}
        render={({ field, fieldState }) => (
          <>
            <FormControl error={!!fieldState.error}>
              {props.label && <FormLabel>{props.label}</FormLabel>}
              <Input
                disabled={props.disable}
                placeholder={props.placeholder || ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                type={props.type || 'text'}
                className={props.className}
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
