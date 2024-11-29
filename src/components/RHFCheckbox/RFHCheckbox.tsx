import { Checkbox, FormControl, FormHelperText } from '@mui/joy';
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
  disabled?: boolean;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RHFInput = <T extends FieldValues>(props: RHFInputProps<T>) => {
  const { size = 'md' } = props;
  return (
    <>
      <Controller
        control={props.control}
        name={props.name}
        render={({ field, fieldState }) => (
          <>
            <FormControl error={!!fieldState.error}>
              <Checkbox
                size={size}
                disabled={props.disabled}
                label={props.label}
                checked={field.value}
                name={props.name}
                onChange={(e) => field.onChange(e.target.checked)}
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
