import { passwordRegex } from '@/validations/common.validation';
import { FormControl, FormHelperText, FormLabel, IconButton, Input } from '@mui/joy';
import { ReactNode, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

interface RHFPasswordInputProps<T extends FieldValues> {
  label?: ReactNode | string;
  name: Path<T>;
  control?: Control<T>;
  className?: string;
  placeholder?: string;
  disable?: boolean;
}

const passwordMessage =
  'Mật khẩu phải chứa ít nhất 6 ký tự, bao gồm ít nhất 1 chữ cái viết hoa, 1 số và 1 ký tự đặc biệt (Vd: Abc@123).';

const RHFPasswordInput = <T extends FieldValues>(props: RHFPasswordInputProps<T>) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <Controller
        control={props.control}
        name={props.name}
        rules={{
          required: 'Vui lòng nhập mật khẩu.',
          pattern: {
            value: passwordRegex,
            message: passwordMessage,
          },
        }}
        render={({ field, fieldState }) => (
          <>
            <FormControl error={!!fieldState.error}>
              {props.label && <FormLabel>{props.label}</FormLabel>}
              <Input
                type={show ? 'text' : 'password'}
                disabled={props.disable}
                placeholder={props.placeholder || ''}
                onChange={field.onChange}
                onBlur={field.onBlur}
                endDecorator={
                  <IconButton onClick={() => setShow(!show)}>
                    {show ? (
                      <FaRegEye className='tw-text-slate-800' />
                    ) : (
                      <FaRegEyeSlash className='tw-text-slate-800' />
                    )}
                  </IconButton>
                }
              />

              <FormHelperText>
                {props.name === 'confirmPassword' ? fieldState.error?.message : passwordMessage}
              </FormHelperText>
            </FormControl>
          </>
        )}
      />
    </>
  );
};

export default RHFPasswordInput;
