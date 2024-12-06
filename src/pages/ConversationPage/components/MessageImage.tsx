import assetService from '@/services/asset.service';
import { AspectRatio, Skeleton } from '@mui/joy';
import React from 'react';
import Lightbox from 'react-image-lightbox';

interface MessageImageProps {
  assetId: number;
}
const MessageImage = (props: MessageImageProps) => {
  const { assetId } = props;
  const [openLightbox, setOpenLightBox] = React.useState(false);

  const { data: getAssetResponse, isFetching: fetchingAssetData } = assetService.getAssetById(Number(assetId), {
    gcTime: 10 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <>
      <AspectRatio
        flex
        sx={(theme) => ({
          borderRadius: 'sm',
          width: 200,
          [theme.breakpoints.up('md')]: {
            width: 500,
          },
        })}
        objectFit='contain'
      >
        <Skeleton loading={fetchingAssetData}>
          <img
            className='tw-h-auto tw-cursor-pointer'
            src={getAssetResponse?.data[0].url}
            alt={getAssetResponse?.data[0].name}
            onClick={() => setOpenLightBox(true)}
          />
        </Skeleton>
      </AspectRatio>
      {openLightbox && getAssetResponse && (
        <Lightbox mainSrc={getAssetResponse?.data[0].url} onCloseRequest={() => setOpenLightBox(false)} />
      )}
    </>
  );
};

export default MessageImage;
