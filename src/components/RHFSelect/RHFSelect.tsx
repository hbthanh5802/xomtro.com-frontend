import { SelectOptionItemType } from '@/types/common.type';
import { FormControl, FormHelperText, FormLabel, Option, Select, Typography, selectClasses } from '@mui/joy';
import React, { ReactNode } from 'react';
import { Control, Controller, FieldValues, Path, useController } from 'react-hook-form';
import { MdOutlineInfo } from 'react-icons/md';

interface RHFSelectProps<T extends FieldValues> {
  label?: ReactNode | string;
  name: Path<T>;
  control: Control<T>;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  options: SelectOptionItemType[];
  size?: 'md' | 'lg' | 'sm';
}

const RHFSelect = <T extends FieldValues>(props: RHFSelectProps<T>) => {
  const optionId = React.useId();
  const { name, control, required = false, size = 'sm' } = props;
  const { field } = useController({ name, control });

  const handleChange = (
    event:
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.FocusEvent<Element, Element>
      | null,
    value: {} | null,
  ) => {
    field.onChange(value);
  };

  return (
    <>
      <Controller
        control={props.control}
        name={props.name}
        render={({ field, fieldState }) => {
          return (
            <>
              <FormControl error={!!fieldState.error}>
                {props.label && (
                  <FormLabel>
                    {props.required && <Typography color='danger' level='title-sm'>{`(*)`}</Typography>}
                    {props.label}
                  </FormLabel>
                )}
                <Select
                  disabled={props.disabled}
                  required={required}
                  size={size}
                  placeholder={props.placeholder}
                  name={props.name}
                  onChange={handleChange}
                  value={field.value || null}
                  className={props.className}
                  // indicator={<MdOutlineKeyboardArrowDown className='tw-text-[24px]' />}
                  sx={{
                    zIndex: '99999',
                    p: 1,
                    gap: 1,
                    '--ListItem-radius': 'var(--joy-radius-sm)',
                    // width: 240,
                    [`& .${selectClasses.indicator}`]: {
                      transition: '0.2s',
                      [`&.${selectClasses.expanded}`]: {
                        transform: 'rotate(-180deg)',
                      },
                    },
                  }}
                  slotProps={{
                    listbox: {
                      sx: {
                        maxHeight: '300px',
                      },
                    },
                  }}
                >
                  {props.options.map((optionItem, index) => (
                    <Option key={`option-${optionId}-${index}`} value={optionItem.value}>
                      {optionItem.label}
                    </Option>
                  ))}
                </Select>
                {!!fieldState.error && (
                  <FormHelperText>
                    <MdOutlineInfo />
                    {fieldState.error?.message}
                  </FormHelperText>
                )}
              </FormControl>
            </>
          );
        }}
      />
    </>
  );
};

export default RHFSelect;
