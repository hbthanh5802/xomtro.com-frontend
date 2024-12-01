import useUrl from '@/hooks/useUrl.hook';
import useUserApiHook from '@/hooks/useUserApi.hook';
import postService, { FullPostResponseType } from '@/services/post.service';
import {
  JoinPostSelectSchemaType,
  PassPostSelectSchemaType,
  RentalPostSelectSchemaType,
  WantedPostSelectSchemaType,
} from '@/types/schema.type';
import { generateCloudinaryImageOptimizer, handleAxiosError } from '@/utils/constants.helper';
import { Avatar, Skeleton } from '@mui/joy';
import React from 'react';
import ImageGallery from 'react-image-gallery';

const ViewPostDetailPage = () => {
  const { params } = useUrl();
  const postId = Number(params.postId);
  // const navigate = useNavigate();
  const [postData, setPostData] = React.useState<FullPostResponseType<
    RentalPostSelectSchemaType | WantedPostSelectSchemaType | JoinPostSelectSchemaType | PassPostSelectSchemaType
  > | null>(null);
  const { post, detail, assets } = postData ?? {};

  React.useEffect(() => {
    const handleGetFullPost = async (postId: number) => {
      try {
        const response = await postService.getFullPost(postId);
        console.log(response.data);
        setPostData(response.data[0]);
      } catch (error) {
        console.log(handleAxiosError(error));
      }
    };

    if (postId) handleGetFullPost(postId);
  }, [postId]);

  const { data: getUserDetailResponse, isFetching: getUserDetailLoading } = useUserApiHook.useUserDetail(
    Number(post?.ownerId),
    {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  );
  const { data: getUserAvatarResponse, isFetching: getUserAvatarLoading } = useUserApiHook.useUserAvatar(
    Number(post?.ownerId),
    {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  );
  const userDetail = getUserAvatarResponse?.data;
  const userAvatar = getUserAvatarResponse?.data;

  console.log(getUserDetailResponse, getUserAvatarResponse);

  const postImages = React.useMemo(() => {
    if (!assets?.length) return [];
    return assets.map((item) => generateCloudinaryImageOptimizer(item.url));
  }, [assets]);

  if (!postId) return <></>;
  return (
    <div className='tw-w-full tw-min-h-[calc(100vh-var(--header-height))] tw-bg-backgroundColor tw-pt-[40px]'>
      <div className='tw-container tw-mx-auto tw-p-[12px]'>
        <div className='tw-flex tw-gap-6'>
          <div className='tw-flex-1'>
            <ImageGallery thumbnailPosition='bottom' showBullets showPlayButton={false} lazyLoad items={postImages} />
          </div>
          <div className='tw-w-[400px] tw-bg-white tw-shadow-sm tw-rounded tw-p-[24px] tw-flex tw-flex-col tw-items-center'>
            <Avatar src={getUserDetailLoading ? '' : userAvatar?.url} sx={{ width: 150, height: 150, boxShadow: 'md' }}>
              <Skeleton loading={getUserDetailLoading} />
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPostDetailPage;
