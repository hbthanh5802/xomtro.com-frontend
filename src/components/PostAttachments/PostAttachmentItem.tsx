import { FullPostResponseType } from '@/services/post.service';
import {
  JoinPostSelectSchemaType,
  PassPostSelectSchemaType,
  RentalPostSelectSchemaType,
  WantedPostSelectSchemaType,
} from '@/types/schema.type';
import { formatCurrencyVND } from '@/utils/constants.helper';
import { AspectRatio, Skeleton, Typography } from '@mui/joy';

interface PostAttachmentItemProps {
  data: FullPostResponseType<
    RentalPostSelectSchemaType | WantedPostSelectSchemaType | JoinPostSelectSchemaType | PassPostSelectSchemaType
  >;
  size?: 'sm' | 'md';
}
const PostAttachmentItem = (props: PostAttachmentItemProps) => {
  const { data, size = 'md' } = props;
  const { post, detail, assets } = data;

  return (
    <>
      {data ? (
        <div className='tw-duration-150 tw-flex tw-items-start tw-gap-2'>
          <Skeleton loading={!data} animation='wave'>
            <AspectRatio
              ratio='1/1'
              sx={{
                width: 100,
                borderRadius: 'sm',
                border: 1,
                borderColor: 'var(--joy-palette-neutral-300)',
                flexGrow: 0,
                flexShrink: 0,
              }}
            >
              {assets.length && <img src={assets?.[0].url} alt={post?.title} />}
            </AspectRatio>
          </Skeleton>

          <div className='tw-flex-1 tw-ml-3 tw-space-y-1 tw-overflow-auto'>
            <div className='tw-max-w-full'>
              <Typography letterSpacing={0.04} level={size === 'md' ? 'title-md' : 'title-sm'}>
                <Skeleton animation='wave' loading={!data}>
                  {post?.title}
                </Skeleton>
              </Typography>
            </div>
            <div className='tw-flex tw-items-center tw-gap-1'>
              <Typography letterSpacing={0.04} level={size === 'md' ? 'title-md' : 'title-sm'}>
                Giá:
              </Typography>
              <Typography
                letterSpacing={0.04}
                level={size === 'md' ? 'body-md' : 'body-sm'}
                variant='soft'
                color='success'
              >
                <Skeleton animation='wave' loading={!data}>
                  {formatCurrencyVND(Number(detail?.priceStart))}
                  {post.type === 'pass' ? '' : '/tháng'}
                </Skeleton>
              </Typography>
              {detail?.priceEnd && detail?.priceEnd !== detail?.priceStart && (
                <>
                  <span>-</span>
                  <Typography
                    letterSpacing={0.04}
                    level={size === 'md' ? 'body-md' : 'body-sm'}
                    variant='soft'
                    color='success'
                  >
                    <Skeleton animation='wave' loading={!data}>
                      {`${formatCurrencyVND(detail.priceEnd)}${post.type === 'pass' ? '' : '/tháng'}`}
                    </Skeleton>
                  </Typography>
                </>
              )}
            </div>
            <div className='tw-flex tw-items-center tw-gap-1'>
              <Typography letterSpacing={0.04} level='body-xs'>
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
