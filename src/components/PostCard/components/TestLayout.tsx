import { PostCardDataType } from '@/components/PostCard/PostCardWrapper';
import { AspectRatio } from '@mui/joy';
import LazyLoad from 'react-lazyload';

interface ImageProps {
  src: string;
  alt: string;
}

interface TestLayoutProps {
  data: PostCardDataType;
}

const LazyImage = ({ src, alt }: ImageProps) => (
  <LazyLoad height={200} offset={100}>
    <AspectRatio ratio={'1/1'} objectFit='cover'>
      <img src={src} alt={alt} className='tw-w-full tw-h-full tw-object-cover' />
    </AspectRatio>
  </LazyLoad>
);

const generateDynamicLayout = (images: ImageProps[]) => {
  if (images.length === 1) {
    return {
      rows: [[images[0]]], // 1 hàng duy nhất
      showMore: false,
    };
  }
  if (images.length === 2) {
    return {
      rows: [[images[0], images[1]]], // 1 hàng, 2 ảnh chia đôi
      showMore: false,
    };
  }
  if (images.length === 3) {
    return {
      rows: [[images[0]], [images[1], images[2]]], // 1 ảnh trên, 2 ảnh dưới
      showMore: false,
    };
  }
  if (images.length === 4) {
    return {
      rows: [
        [images[0], images[1]],
        [images[2], images[3]],
      ], // 2 hàng, mỗi hàng 2 ảnh
      showMore: false,
    };
  }
  // 5 ảnh trở lên
  return {
    rows: [
      [images[0], images[1]], // 2 ảnh trên
      [images[2], images[3]], // 2 ảnh dưới
    ],
    showMore: true,
    remainingImages: images.length - 4, // Số ảnh còn lại
  };
};

const TestLayout = (props: TestLayoutProps) => {
  const { assets, post } = props.data;

  const images: ImageProps[] = assets.map((item) => ({
    src: item.url,
    alt: item.name,
  }));

  const { rows, showMore, remainingImages } = generateDynamicLayout(images);

  return (
    <div className='tw-w-full tw-max-w-[1000px] tw-mx-auto tw-relative'>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className='tw-flex tw-gap-2 tw-mb-2'>
          {row.map((image, index) => (
            <div
              key={index}
              className={`tw-relative ${rows.length === 1 ? 'tw-w-full' : row.length === 1 ? 'tw-w-full' : 'tw-w-1/2'}`}
            >
              <LazyImage {...image} />
            </div>
          ))}
        </div>
      ))}

      {showMore && (
        <div className='tw-relative tw-flex tw-justify-center tw-items-center tw-h-[200px] tw-w-full tw-bg-gray-200 tw-rounded-md tw-cursor-pointer'>
          <span className='tw-text-sm tw-font-medium tw-text-gray-700'>+{remainingImages} Xem thêm</span>
        </div>
      )}
    </div>
  );
};

export default TestLayout;
