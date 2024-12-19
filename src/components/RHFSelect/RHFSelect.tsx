import { SelectOptionItemType } from '@/types/common.type';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Option,
  Select,
  SelectStaticProps,
  Typography,
  selectClasses,
} from '@mui/joy';
import React, { ReactNode } from 'react';
import { Control, Controller, FieldValues, Path, useController } from 'react-hook-form';
import { MdClose, MdOutlineInfo } from 'react-icons/md';

interface RHFSelectProps<T extends FieldValues> {
  label?: ReactNode | string;
  name: Path<T>;
  control: Control<T>;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  minWidth?: string | number;
  width?: string;
  options: SelectOptionItemType[];
  size?: 'md' | 'lg' | 'sm';
  allowClear?: boolean;
}

const RHFSelect = <T extends FieldValues>(props: RHFSelectProps<T>) => {
  const optionId = React.useId();
  const action: SelectStaticProps['action'] = React.useRef(null);
  const { name, control, required = false, size = 'sm', minWidth = 150, allowClear = false } = props;
  const { field } = useController({ name, control });

  const handleChange = (
    _event:
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.FocusEvent<Element, Element>
      | null,
    value: object | null,
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
                    minWidth: `${minWidth}px`,
                    // zIndex: '99999',
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
                  {...(field.value &&
                    allowClear && {
                      endDecorator: (
                        <IconButton
                          onMouseDown={(event) => {
                            // don't open the popup when clicking on this button
                            event.stopPropagation();
                          }}
                          onClick={() => {
                            field.onChange(null);
                            action.current?.focusVisible();
                          }}
                        >
                          <MdClose className='tw-text-[18px]' />
                        </IconButton>
                      ),
                      indicator: null,
                    })}
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
