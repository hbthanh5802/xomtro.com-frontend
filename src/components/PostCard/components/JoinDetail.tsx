import { PostCardDataType } from '@/components/PostCard/PostCardWrapper';
import { formatCurrencyVND } from '@/utils/constants.helper';
import { room_amenities } from '@/utils/schema.helper';
import { formatTimeForVietnamese } from '@/utils/time.helper';
import { Chip, Divider, Typography } from '@mui/joy';
import React from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import { LuAreaChart } from 'react-icons/lu';
import { MdMiscellaneousServices, MdOutlineAccessTime, MdOutlineNoteAdd } from 'react-icons/md';
import { PiMoneyWavy } from 'react-icons/pi';

interface JoinDetailProps {
  data: PostCardDataType;
}

const JoinDetail = (props: JoinDetailProps) => {
  const { post, detail } = props.data;
  const [showMore, setShowMore] = React.useState(false);

  const hasAmenities = React.useMemo(
    () => Object.keys(room_amenities).some((key: string) => (detail as any)[key as keyof typeof detail] as boolean),
    [detail],
  );

  return (
    <div>
      <div className={`PostCard__post-info tw-px-[24px] ${showMore ? '' : 'tw-h-[200px] tw-overflow-hidden'}`}>
        <Typography color='primary' level='h4'>
          {post.title}
        </Typography>

        <div className='tw-mt-4 tw-flex tw-items-end tw-gap-2'>
          <Typography startDecorator={<PiMoneyWavy className='tw-text-[20px] tw-text-slate-600' />} level='title-md'>
            Giá thuê:
          </Typography>
          <div className='tw-flex tw-items-center tw-gap-3'>
            <Typography level='body-md' variant='soft' color='success'>
              ~{formatCurrencyVND(detail.priceStart)}/tháng
            </Typography>
            {detail.priceEnd && detail.priceEnd !== detail.priceStart && (
              <>
                <span>-</span>
                <Typography level='body-md' variant='soft' color='success'>{`~${formatCurrencyVND(
                  detail.priceEnd,
                )}/tháng`}</Typography>
              </>
            )}
          </div>
        </div>

        <div className='tw-mt-2 tw-flex tw-items-start tw-gap-2 tw-flex-wrap'>
          <Typography startDecorator={<LuAreaChart className='tw-text-slate-600 tw-text-[18px]' />} level='title-md'>
            Diện tích:
          </Typography>
          <Typography level='body-md'>
            {detail.totalArea} {detail.totalAreaUnit === 'm2' ? 'm' : detail.totalAreaUnit === 'cm2' ? 'cm' : 'km'}
            <sup>2</sup>
          </Typography>
        </div>

        <div className='tw-mt-4 tw-flex tw-items-start tw-gap-2 tw-flex-wrap'>
          <Typography
            startDecorator={<MdMiscellaneousServices className='tw-text-slate-600 tw-text-[18px]' />}
            level='title-md'
          >
            Dịch vụ:
          </Typography>
          {!hasAmenities ? (
            <Typography level='body-md'>Chưa có thông tin</Typography>
          ) : (
            <div className='tw-flex tw-flex-wrap tw-gap-2'>
              {detail.hasFurniture && (
                <div className='tw-mx-[4px]'>
                  <Typography level='body-md' variant='soft'>
                    Nội thất cơ bản
                  </Typography>
                </div>
              )}
              {detail.hasInternet && (
                <div className='tw-mx-[4px]'>
                  <Typography level='body-md' variant='soft'>
                    Kết nối internet
                  </Typography>
                </div>
              )}
              {detail.hasSecurity && (
                <div className='tw-mx-[4px]'>
                  <Typography level='body-md' variant='soft'>
                    Bảo vệ
                  </Typography>
                </div>
              )}
              {detail.hasAirConditioner && (
                <div className='tw-mx-[4px]'>
                  <Typography level='body-md' variant='soft'>
                    Điều hoà
                  </Typography>
                </div>
              )}
              {detail.hasElevator && (
                <div className='tw-mx-[4px]'>
                  <Typography level='body-md' variant='soft'>
                    Thang máy
                  </Typography>
                </div>
              )}
              {detail.hasPrivateBathroom && (
                <div className='tw-mx-[4px]'>
                  <Typography level='body-md' variant='soft'>
                    Vệ sinh khép kín
                  </Typography>
                </div>
              )}
              {detail.hasRefrigerator && (
                <div className='tw-mx-[4px]'>
                  <Typography level='body-md' variant='soft'>
                    Tủ lạnh
                  </Typography>
                </div>
              )}
              {detail.hasWashingMachine && (
                <div className='tw-mx-[4px]'>
                  <Typography level='body-md' variant='soft'>
                    Máy giặt
                  </Typography>
                </div>
              )}
              {detail.hasParking && (
                <div className='tw-mx-[4px]'>
                  <Typography level='body-md' variant='soft'>
                    Chỗ để xe
                  </Typography>
                </div>
              )}
              {detail.allowPets && (
                <div className='tw-mx-[4px]'>
                  <Typography level='body-md' variant='soft'>
                    Cho phép nuôi thú cưng
                  </Typography>
                </div>
              )}
            </div>
          )}
        </div>

        <div className='tw-mt-2 tw-flex tw-items-start tw-gap-2 tw-flex-wrap'>
          <Typography
            startDecorator={<MdOutlineAccessTime className='tw-text-slate-600 tw-text-[18px]' />}
            level='title-md'
          >
            Thời gian có thể chuyển vào:
          </Typography>
          <Typography level='body-md'>{formatTimeForVietnamese(detail.moveInDate)}</Typography>
        </div>

        <div className='tw-mt-4 tw-flex tw-items-start tw-gap-2 tw-flex-wrap'>
          <Typography
            startDecorator={<IoLocationOutline className='tw-text-slate-600 tw-text-[18px]' />}
            level='title-md'
          >
            Địa chỉ:
          </Typography>
          <Typography level='body-md'>{`${post.addressDetail ? post.addressDetail + ', ' : ''}${post.addressWard}, ${
            post.addressDistrict
          }, ${post.addressProvince}.`}</Typography>
        </div>

        <div className='tw-mt-4 tw-flex tw-items-start tw-gap-2 tw-flex-wrap'>
          <Typography
            startDecorator={<MdOutlineNoteAdd className='tw-text-slate-600 tw-text-[18px]' />}
            level='title-md'
          >
            Mô tả thêm:
          </Typography>
          {post.description ? (
            <div className='' dangerouslySetInnerHTML={{ __html: post.description }}></div>
          ) : (
            <Typography level='body-md'>Chưa có thông tin</Typography>
          )}
        </div>

        <div className='tw-mt-4 tw-flex tw-items-start tw-gap-2 tw-flex-wrap'>
          <Typography level='title-sm'>Ghi chú thêm:</Typography>
          <Typography level='body-sm'>{post.note || 'Chưa có ghi chú thêm'}</Typography>
        </div>
      </div>
      {!showMore && (
        <div className='tw-px-[12px] tw-py-[4px]'>
          <Divider orientation='horizontal'>
            <Chip color='primary' onClick={() => setShowMore(true)}>
              Hiển thị thêm
            </Chip>
          </Divider>
        </div>
      )}
    </div>
  );
};

export default JoinDetail;
