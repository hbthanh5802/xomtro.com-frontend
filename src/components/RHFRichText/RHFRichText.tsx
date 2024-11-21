import { FormControl, FormHelperText, FormLabel } from '@mui/joy';
import { ReactNode, useEffect } from 'react';
import { Control, Controller, FieldValues, Path, useController } from 'react-hook-form';
import { MdOutlineInfo } from 'react-icons/md';
import { useQuill } from 'react-quilljs';

interface RHFRichTextProps<T extends FieldValues> {
  label?: ReactNode | string;
  name: Path<T>;
  control: Control<T>;
  className?: string;
  placeholder?: string;
  disable?: boolean;
}

const formats = [
  'bold',
  'italic',
  'underline',
  'strike',
  'align',
  'list',
  'indent',
  'size',
  'header',
  // 'link',
  // 'image',
  // 'video',
  // 'color',
  // 'background',
  // 'clean',
];
const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ align: [] }],

    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],

    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    // ['link', 'image', 'video'],
    // [{ color: [] }, { background: [] }],

    // ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const RHFRichText = <T extends FieldValues>(props: RHFRichTextProps<T>) => {
  const { label, name, control, placeholder, disable = false } = props;
  const {
    field: { onChange },
  } = useController({ control, name });
  const { quill, quillRef } = useQuill({ modules, formats, placeholder, readOnly: disable });

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        onChange(quill.root.innerHTML);
      });
    }
  }, [quill]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        return (
          <FormControl error={!!fieldState.error}>
            {label && <FormLabel>{label}</FormLabel>}
            <div
              ref={quillRef}
              className={`tw-w-full tw-min-h-[200px] tw-rounded tw-border tw-shadow-sm focus-within:tw-border-primaryColor ${props.className}`}
            />
            {!!fieldState.error && (
              <FormHelperText>
                <MdOutlineInfo />
                {fieldState.error.message}
              </FormHelperText>
            )}
          </FormControl>
        );
      }}
    />
  );
};

export default RHFRichText;
