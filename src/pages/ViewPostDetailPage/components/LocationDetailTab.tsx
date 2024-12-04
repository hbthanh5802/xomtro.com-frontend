import MapBox from '@/components/MapBox';
import ModalLayout from '@/components/ModalLayout';
import { PostCardDataType } from '@/components/PostCard/PostCardWrapper';
import { Button, Typography } from '@mui/joy';
import React from 'react';
import { MdLocationPin } from 'react-icons/md';

interface ViewPostDetailProps {
  data: PostCardDataType;
}

const LocationDetailTab = (props: ViewPostDetailProps) => {
  const { post } = props.data;
  const [viewMap, setViewMap] = React.useState(false);

  return (
    <>
      <div>
        <div className='tw-mt-4 tw-bg-white tw-shadow-sm tw-rounded tw-p-[24px]'>
          {/* <Divider orientation='horizontal' sx={{ '--Divider-childPosition': `${0}%` }}> */}
          <Typography level='title-lg' variant='plain'>
            Địa chỉ:
          </Typography>
          {/* </Divider> */}
          <div className='tw-my-4'>
            <Typography startDecorator={<MdLocationPin className='tw-text-[18px]' />} level='title-lg'>{`${
              post.addressDetail ? post.addressDetail + ', ' : ''
            }${post.addressWard}, ${post.addressDistrict}, ${post.addressProvince}.`}</Typography>
          </div>

          <MapBox
            center={[Number(post.addressLongitude), Number(post.addressLatitude)]}
            zoom={11}
            className='tw-w-full tw-h-[300px]'
            fillOpacity={0.1}
            // showToggleMapStyle
          />
          <Button fullWidth onClick={() => setViewMap(true)}>
            Xem toàn bản đồ
          </Button>
        </div>
      </div>
      <ModalLayout keepMounted isOpen={viewMap} onCloseModal={() => setViewMap(false)}>
        <MapBox
          center={[Number(post.addressLongitude), Number(post.addressLatitude)]}
          zoom={12}
          className='tw-max-w-[100dvh] laptop:tw-w-[100vh] tw-h-[80dvh]'
          scrollZoom
          doubleClickZoom
          dragPan
          fillOpacity={0.1}
          showToggleMapStyle
        />
      </ModalLayout>
    </>
  );
};

export default LocationDetailTab;
