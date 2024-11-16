import { FormControl, FormHelperText, FormLabel, Textarea, Typography } from '@mui/joy';
import { ReactNode } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { MdOutlineInfo } from 'react-icons/md';

interface RHFInputProps<T extends FieldValues> {
  label?: ReactNode | string;
  name: Path<T>;
  control?: Control<T>;
  className?: string;
  required?: boolean;
  placeholder?: string;
  disable?: boolean;
  minRows?: number;
  maxRows?: number;
}

const RHFInput = <T extends FieldValues>(props: RHFInputProps<T>) => {
  return (
    <>
      <Controller
        control={props.control}
        name={props.name}
        render={({ field, fieldState }) => (
          <>
            <FormControl error={!!fieldState.error} sx={{ width: '100%' }}>
              {props.label && (
                <FormLabel>
                  {props.required && <Typography color='danger' level='title-sm'>{`(*)`}</Typography>}
                  {props.label}
                </FormLabel>
              )}
              <Textarea
                sx={{ width: '100%' }}
                disabled={props.disable}
                placeholder={props.placeholder || ''}
                error={!!fieldState.error}
                {...field}
                value={field.value ?? ''}
                minRows={props.minRows}
                maxRows={props.maxRows}
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
