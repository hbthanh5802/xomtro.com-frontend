import { FormControl, FormHelperText, FormLabel, Input, Typography } from '@mui/joy';
import React, { ReactNode } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { MdOutlineInfo } from 'react-icons/md';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

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
  size?: 'sm' | 'md' | 'lg';
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

const NumericFormatAdapter = React.forwardRef<NumericFormatProps, CustomProps>(function NumericFormatAdapter(
  props,
  ref,
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      // prefix='$'
    />
  );
});

const RHFNumberInput = <T extends FieldValues>(props: RHFNumberInputProps<T>) => {
  const { minWidth = 0, min, max, step, startDecorator, endDecorator, size = 'md' } = props;

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
                size={size}
                startDecorator={startDecorator}
                endDecorator={endDecorator}
                sx={{ minWidth: `${minWidth}px` }}
                disabled={props.disable}
                placeholder={props.placeholder || ''}
                className={props.className}
                // type='number'
                slotProps={{ input: { min, max, step, component: NumericFormatAdapter } }}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
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

export default RHFNumberInput;
