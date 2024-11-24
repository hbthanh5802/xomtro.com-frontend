import RHFImageInput from '@/components/RHFImageInput';
import { AspectRatio } from '@mui/joy';
import React, { useEffect } from 'react';
import { Control, FieldValues, Path, useFormContext } from 'react-hook-form';

interface RHFImageUploadPreviewProps<T extends FieldValues> {
  name: Path<T>;
  label?: React.ReactNode;
  control: Control<T>;
  minHeight?: number;
  maxHeight?: number;
  ratio?: '1/1' | '4/3' | '16/9';
  objectFit?: 'contain' | 'fill' | 'cover';
}
const RHFImageUploadPreview = <T extends FieldValues>(props: RHFImageUploadPreviewProps<T>) => {
  const { name, label, control, minHeight, maxHeight, ratio = '16/9', objectFit = 'contain' } = props;
  const { watch } = useFormContext();
  const [preview, setPreview] = React.useState<string | null>(null);

  const handlePreview = (fileList: FileList) => {
    const file = fileList[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const watchValue = watch(name);
  useEffect(() => {
    if (watchValue) handlePreview(watchValue);
  }, [watchValue]);

  return (
    <div className='tw-flex tw-flex-col tw-gap-2'>
      <div className='tw-drop-shadow-md'>
        <AspectRatio flex minHeight={minHeight} maxHeight={maxHeight} ratio={ratio} objectFit={objectFit}>
          <img
            src={preview || undefined}
            // srcSet='https://images.unsplash.com/photo-1502657877623-f66bf489d236?auto=format&fit=crop&w=800&dpr=2 2x'
            alt='Chưa có thông tin'
          />
        </AspectRatio>
      </div>
      <RHFImageInput control={control} name={name} label={label} />
    </div>
  );
};

export default RHFImageUploadPreview;
