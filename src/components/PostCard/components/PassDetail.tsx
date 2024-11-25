import { PostCardDataType } from '@/components/PostCard/PostCardWrapper';
import { formatCurrencyVND } from '@/utils/constants.helper';
import { Chip, Divider, Typography } from '@mui/joy';
import React from 'react';
import { IoLocationOutline } from 'react-icons/io5';
import { MdOutlineNoteAdd } from 'react-icons/md';
import { PiMoneyWavy } from 'react-icons/pi';

interface PassDetailProps {
  data: PostCardDataType;
}

const PassDetail = (props: PassDetailProps) => {
  const passId = React.useId();
  const { post, detail, passItems } = props.data;
  const [showMore, setShowMore] = React.useState(false);

  return (
    <div>
      <div className={`PostCard__post-info tw-px-[24px] ${showMore ? '' : 'tw-h-[200px] tw-overflow-hidden'}`}>
        <Typography color='primary' level='h4'>
          {post.title}
        </Typography>

        <div className='tw-mt-4 tw-flex tw-items-end tw-gap-2'>
          <Typography startDecorator={<PiMoneyWavy className='tw-text-[20px] tw-text-slate-600' />} level='title-md'>
            Giá pass giao động:
          </Typography>
          <div className='tw-flex tw-items-center tw-gap-3'>
            <Typography level='body-md' variant='soft' color='success'>
              {formatCurrencyVND(detail.priceStart)}
            </Typography>
            {detail.priceEnd && detail.priceEnd !== detail.priceStart && (
              <>
                <span>-</span>
                <Typography level='body-md' variant='soft' color='success'>{`${formatCurrencyVND(
                  detail.priceEnd,
                )}`}</Typography>
              </>
            )}
          </div>
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

        <div className='tw-my-2'>
          <Divider>Thông tin đồ pass</Divider>
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

export default PassDetail;
