import { FormControl, FormHelperText, FormLabel, Slider, SliderProps, Typography } from '@mui/joy';
import { ReactNode } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { MdOutlineInfo } from 'react-icons/md';

interface RHFSliderProps<T extends FieldValues> {
  label?: ReactNode | string;
  name: Path<T>;
  control?: Control<T>;
  disabled?: boolean;
  required?: boolean;
}

const RHFSlider = <T extends FieldValues>(props: RHFSliderProps<T> & SliderProps) => {
  const { name, control, label, disabled, required, ...other } = props;

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
              <Slider {...other} {...field} name={name} disabled={disabled} />
              {/* <Slider {...props} marks={marks} orientation={orientation} valueLabelDisplay={valueLabelDisplay} variant={variant} /> */}
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

export default RHFSlider;
