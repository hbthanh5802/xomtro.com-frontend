import { FullPostResponseType } from '@/services/post.service';
import {
  JoinPostSelectSchemaType,
  PassPostSelectSchemaType,
  RentalPostSelectSchemaType,
  WantedPostSelectSchemaType,
} from '@/types/schema.type';
import { formatCurrencyVND } from '@/utils/constants.helper';
import { formatTimeForVietnamese } from '@/utils/time.helper';
import { AspectRatio, Skeleton, Typography } from '@mui/joy';

interface PostAttachmentItemProps {
  data: FullPostResponseType<
    RentalPostSelectSchemaType | WantedPostSelectSchemaType | JoinPostSelectSchemaType | PassPostSelectSchemaType
  >;
}
const PostAttachmentItem = (props: PostAttachmentItemProps) => {
  const { data } = props;
  const { post, detail, assets } = data;

  return (
    <>
      {data ? (
        <div className='tw-duration-150 tw-flex tw-items-start tw-gap-2'>
          <Skeleton loading={!data} animation='wave'>
            <AspectRatio
              ratio='1/1'
              sx={{ width: 100, borderRadius: 'sm', boxShadow: 'sm', flexGrow: 0, flexShrink: 0 }}
            >
              {assets.length && <img src={assets?.[0].url} alt={post?.title} />}
            </AspectRatio>
          </Skeleton>

          <div className='tw-flex-1 tw-ml-3 tw-space-y-1 tw-overflow-auto'>
            <div className='tw-max-w-full'>
              <Typography letterSpacing={0.04} level='title-md' noWrap>
                <Skeleton animation='wave' loading={!data}>
                  {post?.title}
                </Skeleton>
              </Typography>
            </div>
            <div className='tw-flex tw-items-center tw-gap-1'>
              <Typography letterSpacing={0.04} level='title-sm' noWrap>
                Cập nhật gần nhất:
              </Typography>
              <Typography letterSpacing={0.04} level='body-sm' noWrap>
                <Skeleton animation='wave' loading={!data}>
                  {post?.updatedAt ? formatTimeForVietnamese(post.updatedAt, 'HH:mm:ss DD/MM/YYYY') : 'N/A'}
                </Skeleton>
              </Typography>
            </div>
            <div className='tw-flex tw-items-center tw-gap-1'>
              <Typography letterSpacing={0.04} level='title-sm' noWrap>
                Giá:
              </Typography>
              <Typography letterSpacing={0.04} level='body-sm' variant='soft' color='success'>
                <Skeleton animation='wave' loading={!data}>
                  {formatCurrencyVND(Number(detail?.priceStart))}
                  {post.type === 'pass' ? '' : '/tháng'}
                </Skeleton>
              </Typography>
              {detail?.priceEnd && detail?.priceEnd !== detail?.priceStart && (
                <>
                  <span>-</span>
                  <Typography letterSpacing={0.04} level='body-sm' variant='soft' color='success'>
                    <Skeleton animation='wave' loading={!data}>
                      {`${formatCurrencyVND(detail.priceEnd)}${post.type === 'pass' ? '' : '/tháng'}`}
                    </Skeleton>
                  </Typography>
                </>
              )}
            </div>
            <div className='tw-flex tw-items-center tw-gap-1'>
              <Typography letterSpacing={0.04} level='body-xs' noWrap>
                <Skeleton animation='wave' loading={!data}>
                  {`${post.addressDetail ? post.addressDetail + ', ' : ''}${post.addressWard}, ${
                    post.addressDistrict
                  }, ${post.addressProvince}.`}
                </Skeleton>
              </Typography>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Skeleton width={50} height={50} animation='wave' variant='rectangular' />
        </div>
      )}
    </>
  );
};

export default PostAttachmentItem;
