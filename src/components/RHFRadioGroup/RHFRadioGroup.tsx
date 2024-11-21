import { RadioOptionItemType } from '@/types/common.type';
import { FormControl, FormHelperText, FormLabel, Radio, RadioGroup, Typography } from '@mui/joy';
import { ReactNode, useId } from 'react';
import { Control, Controller, FieldValues, Path, useController } from 'react-hook-form';
import { MdOutlineInfo } from 'react-icons/md';

interface RHFRadioGroupProps<T extends FieldValues> {
  label?: ReactNode | string;
  name: Path<T>;
  options: RadioOptionItemType[];
  control?: Control<T>;
  className?: string;
  placeholder?: string;
  disable?: boolean;
  direction?: 'vertical' | 'horizontal';
  required?: boolean;
}

const RHFRadioGroup = <T extends FieldValues>(props: RHFRadioGroupProps<T>) => {
  const radioId = useId();
  const { direction = 'vertical', control, name } = props;
  const {
    field: { onChange },
  } = useController({
    control,
    name,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value === 'true' ? true : value === 'false' ? false : value);
  };

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
                value={field.value === true ? 'true' : field.value === false ? 'false' : field.value || null}
                onChange={handleChange}
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
