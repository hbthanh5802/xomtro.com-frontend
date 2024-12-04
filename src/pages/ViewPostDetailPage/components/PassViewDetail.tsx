import AddToInterestedButton from '@/components/PostCard/components/AddToInterestedButton';
import { PostCardDataType } from '@/components/PostCard/PostCardWrapper';
import ShareButtons from '@/components/ShareButton';
import useClickOutside from '@/hooks/useClickOutside';
import LocationDetailTab from '@/pages/ViewPostDetailPage/components/LocationDetailTab';
import { formatCurrencyVND } from '@/utils/constants.helper';
import { formatTimeForVietnamese } from '@/utils/time.helper';
import { Chip, Divider, IconButton, Tooltip, Typography } from '@mui/joy';
import React from 'react';
import { IoIosShareAlt } from 'react-icons/io';
import { LuAreaChart } from 'react-icons/lu';
import { MdOutlineNoteAdd } from 'react-icons/md';
import { PiMoneyWavy } from 'react-icons/pi';

interface ViewPostDetailProps {
  data: PostCardDataType;
}

const PassViewDetail = (props: ViewPostDetailProps) => {
  const passId = React.useId();
  const { post, detail, passItems } = props.data;
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
              Giá bán lại giao động:
            </Typography>
            <div className='tw-flex tw-items-center tw-gap-3'>
              <Typography level='title-sm' variant='plain' color='success'>
                {formatCurrencyVND(detail.priceStart)}
              </Typography>
              {detail.priceEnd && detail.priceEnd !== detail.priceStart && (
                <>
                  <span>-</span>
                  <Typography level='body-sm' variant='soft' color='success'>{`${formatCurrencyVND(
                    detail.priceEnd,
                  )}`}</Typography>
                </>
              )}
            </div>
          </div>

          <div className='tw-my-4'>
            <Divider orientation='horizontal' sx={{ '--Divider-childPosition': `${0}%` }}>
              <Typography
                // startDecorator={<MdMiscellaneousServices className='tw-text-[18px]' />}
                level='title-sm'
                color='primary'
                variant='soft'
              >
                Thông tin đồ pass:
              </Typography>
            </Divider>
            <div className='tw-mt-[12px] tw-space-y-4'>
              {passItems?.map((item, index) => {
                return (
                  <div
                    key={`passItem-${passId}-${index}`}
                    className='tw-flex tw-gap-4 tw-border tw-rounded hover:tw-bg-slate-50 tw-duration-150 tw-overflow-hidden'
                  >
                    <div className='tw-shrink-0 tw-grow-0 tw-text-center tw-w-[24px] tw-p-2 tw-bg-slate-600 tw-text-white'>
                      {index + 1}
                    </div>
                    <div className='tw-flex tw-flex-col tw-gap-1 tw-py-[8px] tw-pr-[12px]'>
                      <div className='tw-flex tw-items-baseline tw-gap-2'>
                        <Typography level='title-sm'>Tên:</Typography>
                        <Typography level='body-sm'>{item.passItemName}</Typography>
                      </div>
                      <div className='tw-flex tw-items-baseline tw-gap-2'>
                        <Typography level='title-sm'>Giá pass lại:</Typography>
                        <Typography level='body-sm'>{formatCurrencyVND(item.passItemPrice)}</Typography>
                      </div>
                      <div className='tw-flex tw-items-baseline tw-gap-2'>
                        <Typography level='title-sm'>Tình trạng:</Typography>
                        <Typography level='body-sm'>
                          {item.passItemStatus === 'new' ? 'Mới' : 'Đã qua sử dụng'}
                        </Typography>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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

export default PassViewDetail;
