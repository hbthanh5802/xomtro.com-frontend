import assetService from '@/services/asset.service';
import { AspectRatio, Skeleton } from '@mui/joy';
import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

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
            loading='lazy'
            className='tw-h-auto tw-cursor-pointer'
            src={getAssetResponse?.data[0].url}
            alt={getAssetResponse?.data[0].name}
            onClick={() => setOpenLightBox(true)}
          />
        </Skeleton>
      </AspectRatio>
      {openLightbox && getAssetResponse && (
        <Lightbox
          carousel={{
            finite: true,
          }}
          plugins={[Zoom]}
          controller={{ closeOnPullDown: true, closeOnBackdropClick: true }}
          open={openLightbox}
          close={() => setOpenLightBox(false)}
          slides={[{ src: getAssetResponse.data[0].url }]}
        />
      )}
    </>
  );
};

export default MessageImage;
