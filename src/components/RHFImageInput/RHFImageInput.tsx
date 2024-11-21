import { FormControl, FormHelperText, FormLabel, Typography, styled } from '@mui/joy';
import Button from '@mui/joy/Button';
import SvgIcon from '@mui/joy/SvgIcon';
import * as React from 'react';
import { Control, Controller, FieldValues, Path, useFormContext } from 'react-hook-form';
import { MdOutlineInfo } from 'react-icons/md';

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

interface RHFFileInput<T extends FieldValues> {
  label?: React.ReactNode | string;
  name: Path<T>;
  control?: Control<T>;
  className?: string;
  placeholder?: string;
  disable?: boolean;
  required?: boolean;
  maxFiles?: number;
  maxSize?: number; // Kích thước file tối đa (theo byte)
  acceptedTypes?: string[]; // Danh sách loại file được chấp nhận
}

export default function RHFFileInput<T extends FieldValues>(props: RHFFileInput<T>) {
  const {
    maxFiles = 1,
    maxSize = 10 * 1024 * 1024,
    acceptedTypes = ['image/png', 'image/jpeg', 'image/png', 'image/webp'],
  } = props;
  const { setError, clearErrors } = useFormContext();

  const handleValidation = (fileList: FileList | null) => {
    if (!fileList) return false;

    // Rule 1: Số lượng file tối đa
    if (fileList.length > maxFiles) {
      setError(props.name, {
        type: 'manual',
        message: `Bạn chỉ được upload tối đa ${maxFiles} file.`,
      });
      return false;
    }

    // Rule 2: Kích thước file
    for (const file of Array.from(fileList)) {
      if (file.size > maxSize) {
        setError(props.name, {
          type: 'manual',
          message: `Dung lượng file vượt quá ${(maxSize / (1024 * 1024)).toFixed(1)} MB.`,
        });
        return false;
      }
    }

    // Rule 3: Loại file hợp lệ
    for (const file of Array.from(fileList)) {
      if (!acceptedTypes.includes(file.type)) {
        setError(props.name, {
          type: 'manual',
          message: `Chỉ chấp nhận các file: ${acceptedTypes.join(', ')}`,
        });
        return false;
      }
    }

    // Nếu tất cả hợp lệ
    clearErrors(props.name);
    return true;
  };

  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field, fieldState }) => (
        <FormControl error={!!fieldState.error}>
          {props.label && (
            <FormLabel>
              {props.required && <Typography color='danger' level='title-sm'>{`(*)`}</Typography>}
              {props.label}
            </FormLabel>
          )}
          <Button
            component='label'
            role={undefined}
            tabIndex={-1}
            variant='outlined'
            color={!!fieldState.error ? 'danger' : 'neutral'}
            startDecorator={
              <SvgIcon>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z'
                  />
                </svg>
              </SvgIcon>
            }
          >
            {props.label || 'Chọn ảnh'}
            {/* Visually hidden input */}
            <VisuallyHiddenInput
              multiple={maxSize > 1 ? true : false}
              type='file'
              onChange={(e) => {
                const fileList = e.target.files;
                if (handleValidation(fileList)) {
                  field.onChange(fileList);
                } else {
                  field.onChange([]);
                }
              }}
            />
          </Button>

          {/* Hiển thị lỗi nếu có */}
          {!!fieldState.error && (
            <FormHelperText>
              <MdOutlineInfo />
              {fieldState.error.message}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
