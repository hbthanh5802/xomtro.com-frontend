import AddToInterestedButton from '@/components/PostCard/components/AddToInterestedButton';
import { PostCardDataType } from '@/components/PostCard/PostCardWrapper';
import ShareButtons from '@/components/ShareButton';
import useClickOutside from '@/hooks/useClickOutside';
import LocationDetailTab from '@/pages/ViewPostDetailPage/components/LocationDetailTab';
import RoomAmenities from '@/pages/ViewPostDetailPage/components/RoomAmenities';
import { formatCurrencyVND } from '@/utils/constants.helper';
import { formatTimeForVietnamese } from '@/utils/time.helper';
import { Chip, Divider, IconButton, Tooltip, Typography } from '@mui/joy';
import React from 'react';
import { BsHouseAdd } from 'react-icons/bs';
import { IoIosShareAlt } from 'react-icons/io';
import { LuAreaChart } from 'react-icons/lu';
import { MdMiscellaneousServices, MdOutlineNoteAdd } from 'react-icons/md';
import { PiMoneyWavy } from 'react-icons/pi';
import { RiContractLine } from 'react-icons/ri';

interface ViewPostDetailProps {
  data: PostCardDataType;
}

const RentalViewDetail = (props: ViewPostDetailProps) => {
  const { post, detail } = props.data;
  const shareButtonRef = React.useRef(null);
  const [openShare, setOpenShare] = React.useState(false);

  useClickOutside(shareButtonRef, () => setOpenShare(false));

  return (
    <section className='PostViewDetail__post-detail'>
      <div className='tw-bg-white tw-shadow-sm tw-rounded tw-p-[24px]'>
        <header className=''>
          <div className='tw-flex tw-items-center tw-justify-between'>
            <div className='tw-mb-[12px]'>
              <Typography level='h4'>{post.title}</Typography>
            </div>

            <div className='tw-flex tw-gap-1 tw-items-center'>
              <AddToInterestedButton postId={post.id} />
              <Tooltip
                title={
                  <ShareButtons
                    url={window.location.href}
                    ref={shareButtonRef}
                    onShareWindowClose={() => setOpenShare(false)}
                  />
                }
                variant='outlined'
                arrow
                open={openShare}
              >
                <IconButton onClick={() => setOpenShare(!openShare)}>
                  <IoIosShareAlt className='tw-text-[20px]' />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div className='tw-flex tw-items-center tw-flex-wrap tw-gap-2'>
            {post.addressProvince && (
              <Chip color='danger' variant='soft'>
                {post.addressProvince}
              </Chip>
            )}
            {post.addressDistrict && (
              <Chip color='warning' variant='soft'>
                {post.addressDistrict}
              </Chip>
            )}
            {post.addressWard && (
              <Chip color='success' variant='soft'>
                {post.addressWard}
              </Chip>
            )}
            <Chip color='neutral' variant='soft'>
              Số lượt xem: {post.viewedCount}
            </Chip>
          </div>
        </header>

        <section className='tw-mt-[24px]'>
          <Divider orientation='horizontal' sx={{ '--Divider-childPosition': `${0}%` }}>
            <Typography
              // startDecorator={<MdMiscellaneousServices className='tw-text-[18px]' />}
              level='title-sm'
              color='primary'
              variant='soft'
            >
              Thông tin cơ bản:
            </Typography>
          </Divider>

          <div className='tw-mt-4 tw-flex tw-items-start tw-gap-2 tw-flex-wrap'>
            <Typography startDecorator={<LuAreaChart className='tw-text-slate-600 tw-text-[18px]' />} level='title-sm'>
              Ngày đăng tải:
            </Typography>
            <Typography level='body-sm'>{formatTimeForVietnamese(post.updatedAt!, 'DD/MM/YYYY')}</Typography>
          </div>

          <div className='tw-mt-4 tw-flex tw-items-end tw-gap-2'>
            <Typography startDecorator={<PiMoneyWavy className='tw-text-[20px] tw-text-slate-600' />} level='title-sm'>
              Giá:
            </Typography>
            <div className='tw-flex tw-items-center tw-gap-3'>
              <Typography level='title-sm' variant='plain' color='success'>
                {formatCurrencyVND(detail.priceStart)}/tháng
              </Typography>
              {detail.priceEnd && detail.priceEnd !== detail.priceStart && (
                <>
                  <span>-</span>
                  <Typography level='body-sm' variant='soft' color='success'>{`${formatCurrencyVND(
                    detail.priceEnd,
                  )}/tháng`}</Typography>
                </>
              )}
            </div>
          </div>

          <div className='tw-mt-4 tw-flex tw-items-start tw-gap-2 tw-flex-wrap'>
            <Typography startDecorator={<LuAreaChart className='tw-text-slate-600 tw-text-[18px]' />} level='title-sm'>
              Diện tích:
            </Typography>
            <Typography level='body-sm'>
              {detail.totalArea} {detail.totalAreaUnit === 'm2' ? 'm' : detail.totalAreaUnit === 'cm2' ? 'cm' : 'km'}
              <sup>2</sup>
            </Typography>
          </div>

          <div className='tw-mt-4 tw-flex tw-items-start tw-gap-2 tw-flex-wrap'>
            <Typography
              startDecorator={<RiContractLine className='tw-text-slate-600 tw-text-[18px]' />}
              level='title-sm'
            >
              Hợp đồng thuê tối thiểu:
            </Typography>
            <Typography level='body-sm'>
              {detail.minLeaseTerm}{' '}
              {detail.minLeaseTermUnit === 'day'
                ? 'ngày'
                : detail.minLeaseTermUnit === 'hour'
                ? 'giờ'
                : detail.minLeaseTermUnit === 'month'
                ? 'tháng'
                : 'năm'}
            </Typography>
          </div>

          <div className='tw-mt-4 tw-flex tw-items-start tw-gap-2 tw-flex-wrap'>
            <Typography startDecorator={<BsHouseAdd className='tw-text-slate-600 tw-text-[18px]' />} level='title-sm'>
              Số phòng có sẵn:
            </Typography>
            <Typography level='body-sm'>{detail.numberRoomAvailable} phòng</Typography>
          </div>

          <div className='tw-mt-4 tw-flex tw-items-start tw-gap-2 tw-flex-wrap'>
            <Typography
              startDecorator={<MdOutlineNoteAdd className='tw-text-slate-600 tw-text-[18px]' />}
              level='title-sm'
            >
              Mô tả thêm:
            </Typography>
            {post.description ? (
              <div className='tw-text-[14px]' dangerouslySetInnerHTML={{ __html: post.description }}></div>
            ) : (
              <Typography level='body-sm'>Chưa có thông tin</Typography>
            )}
          </div>

          <div className='tw-mt-4'>
            <Divider orientation='horizontal' sx={{ '--Divider-childPosition': `${0}%` }}>
              <Typography
                startDecorator={<MdMiscellaneousServices className='tw-text-[18px]' />}
                level='title-sm'
                color='primary'
                variant='soft'
              >
                Dịch vụ, tiện tích:
              </Typography>
            </Divider>
            <div className='tw-mt-4'>
              <RoomAmenities data={props.data} />
            </div>
          </div>

          <div className='tw-mt-4 tw-flex tw-items-start tw-gap-2 tw-flex-wrap'>
            <Typography level='title-sm'>Ghi chú thêm:</Typography>
            <Typography level='body-sm'>{post.note || 'Chưa có ghi chú thêm'}</Typography>
          </div>
        </section>
      </div>

      <LocationDetailTab data={props.data} />
    </section>
  );
};

export default RentalViewDetail;
