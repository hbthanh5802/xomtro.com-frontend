import { FormControl, FormHelperText, FormLabel, Input, InputProps, Typography } from '@mui/joy';
import { ReactNode } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { MdOutlineInfo } from 'react-icons/md';

interface RHFNumberInputProps<T extends FieldValues> {
  label?: ReactNode | string;
  name: Path<T>;
  control?: Control<T>;
  className?: string;
  placeholder?: string;
  minWidth?: number | string;
  disable?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  startDecorator?: ReactNode;
  endDecorator?: ReactNode;
  fullWidth?: boolean;
}

const RHFNumberInput = <T extends FieldValues>(props: RHFNumberInputProps<T> & InputProps) => {
  const { minWidth = 0, min, max, step, startDecorator, endDecorator, fullWidth = true, ...others } = props;

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
                startDecorator={startDecorator}
                endDecorator={endDecorator}
                sx={{ minWidth: `${minWidth}px` }}
                disabled={props.disable}
                placeholder={props.placeholder || ''}
                className={props.className}
                type='number'
                slotProps={{ input: { min, max, step } }}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value ?? ''}
                required={props.required}
                fullWidth={fullWidth}
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

export default RHFNumberInput;
