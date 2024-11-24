import { PostCardDataType } from '@/components/PostCard/PostCardWrapper';
import { Button } from '@mui/joy';
import React from 'react';
import { Gallery, Image, ThumbnailImageComponentImageProps } from 'react-grid-gallery';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import LazyLoad from 'react-lazyload';
// import { AspectRatio } from '@mui/joy';

interface PostImagesProps {
  data: PostCardDataType;
}

const LazyThumbnail = ({ imageProps }: { imageProps: ThumbnailImageComponentImageProps }) => {
  const { key, ...other } = imageProps;
  return (
    <LazyLoad height={200} offset={100}>
      <img {...other} title={imageProps.title || undefined} />
    </LazyLoad>
  );
};

const generateDynamicImageSizes = (images: Image[]) => {
  switch (images.length) {
    case 1:
      return images.map((img) => ({
        ...img,
        width: 1920,
        height: 1080,
        title: img.caption || undefined, // Xử lý null
      }));
    case 2:
      return images.map((img) => ({
        ...img,
        width: 960,
        height: 540,
        title: img.caption || undefined,
      }));
    case 3:
    case 4:
      return images.map((img) => ({
        ...img,
        width: 640,
        height: 360,
        title: img.caption || undefined,
      }));
    default:
      return images.map((img) => ({
        ...img,
        width: 320,
        height: 180,
        title: img.caption || undefined,
      }));
  }
};

const getDynamicRowHeight = (images: Image[]) => {
  switch (images.length) {
    case 1:
      return 500;
    case 2:
      return 400;
    case 3:
    case 4:
      return 360;
    default:
      return 180;
  }
};

const PostImages = (props: PostImagesProps) => {
  const { assets, post } = props.data;
  const [index, setIndex] = React.useState(-1);

  const images = React.useMemo(() => {
    return assets.reduce((acc, currentAsset) => {
      const { url } = currentAsset;
      const imageProps = {
        src: url,
        width: 160,
        height: 90,
        caption: post.title,
        title: post.title || undefined,
      };
      acc.push(imageProps);
      return acc;
    }, [] as Image[]);
  }, [assets]);
  const dynamicImages = generateDynamicImageSizes(images);
  const dynamicRowHeight = getDynamicRowHeight(images);

  const currentImage = dynamicImages[index];
  const nextIndex = (index + 1) % dynamicImages.length;
  const nextImage = dynamicImages[nextIndex] || currentImage;
  const prevIndex = (index + dynamicImages.length - 1) % dynamicImages.length;
  const prevImage = dynamicImages[prevIndex] || currentImage;

  const handleClick = (index: number) => setIndex(index);
  const handleClose = () => setIndex(-1);
  const handleMovePrev = () => setIndex(prevIndex);
  const handleMoveNext = () => setIndex(nextIndex);

  return (
    <div className='tw-relative tw-flex tw-justify-center tw-text-center tw-px-[12px] tw-gap-1 tw-mt-[12px]'>
      <Gallery
        images={dynamicImages.length < 7 ? dynamicImages : dynamicImages.slice(0, 7)}
        rowHeight={dynamicRowHeight}
        maxRows={2}
        defaultContainerWidth={1000}
        onClick={handleClick}
        enableImageSelection={false}
        thumbnailImageComponent={({ imageProps }) => <LazyThumbnail imageProps={imageProps} />}
      />
      {!!currentImage && (
        /* @ts-ignore */
        <Lightbox
          mainSrc={currentImage.src}
          imageTitle={currentImage.caption}
          mainSrcThumbnail={currentImage.src}
          nextSrc={nextImage.src}
          nextSrcThumbnail={nextImage.src}
          prevSrc={prevImage.src}
          prevSrcThumbnail={prevImage.src}
          onCloseRequest={handleClose}
          onMovePrevRequest={handleMovePrev}
          onMoveNextRequest={handleMoveNext}
        />
      )}

      {dynamicImages.length > 6 && (
        <Button variant='soft' onClick={() => handleClick(6)}>
          Xem thêm {dynamicImages.length - 6} ảnh
        </Button>
      )}
    </div>
  );
};

export default PostImages;
