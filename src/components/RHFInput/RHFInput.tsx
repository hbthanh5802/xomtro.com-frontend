import { FormControl, FormHelperText, FormLabel, Input, Typography } from '@mui/joy';
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

const RHFInput = <T extends FieldValues>(props: RHFInputProps<T>) => {
  const { minWidth = 0 } = props;

  return (
    <>
      <Controller
        control={props.control}
        name={props.name}
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
                sx={{ minWidth: `${minWidth}px` }}
                disabled={props.disable}
                placeholder={props.placeholder || ''}
                className={props.className}
                type={props.type || 'text'}
                {...field}
                onChange={(e) => field.onChange(props.type === 'number' ? Number(e.target.value) : e.target.value)}
                value={field.value ?? ''}
                required={props.required}
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
