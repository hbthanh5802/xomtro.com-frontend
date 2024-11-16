import { FormControl, FormHelperText, FormLabel, Input, Radio, RadioGroup, Typography } from '@mui/joy';
import { ReactNode, useId } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { MdOutlineInfo } from 'react-icons/md';

export type RadioOptionItem = {
  label: ReactNode | string;
  description?: ReactNode | string;
  value: any;
  defaultChecked?: boolean;
};

interface RHFRadioGroupProps<T extends FieldValues> {
  label?: ReactNode | string;
  name: Path<T>;
  options: RadioOptionItem[];
  control?: Control<T>;
  className?: string;
  placeholder?: string;
  disable?: boolean;
  direction?: 'vertical' | 'horizontal';
  required?: boolean;
}

const RHFRadioGroup = <T extends FieldValues>(props: RHFRadioGroupProps<T>) => {
  const radioId = useId();
  const { direction = 'vertical' } = props;

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
              <RadioGroup
                defaultValue={null}
                {...field}
                name={props.name}
                value={field.value || null}
                sx={{ gap: 2, flexDirection: direction === 'vertical' ? 'column' : 'row' }}
              >
                {props.options.map((optionItem, index) => {
                  return (
                    <FormControl sx={{ p: 0, flexDirection: 'row', gap: 2 }} key={`radio-item-${radioId}-${index}`}>
                      <Radio overlay value={optionItem.value} />
                      <div>
                        <FormLabel>{optionItem.label}</FormLabel>
                        {optionItem.description && <FormHelperText>{optionItem.description}</FormHelperText>}
                      </div>
                    </FormControl>
                  );
                })}
              </RadioGroup>
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

export default RHFRadioGroup;
