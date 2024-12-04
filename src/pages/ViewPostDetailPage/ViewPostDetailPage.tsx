/* eslint-disable @typescript-eslint/no-explicit-any */
import useUrl from '@/hooks/useUrl.hook';
import {
  default as JoinViewDetail,
  default as WantedViewDetail,
} from '@/pages/ViewPostDetailPage/components/JoinViewDetail';
import OwnerContactTab from '@/pages/ViewPostDetailPage/components/OwnerContactTab';
import PassViewDetail from '@/pages/ViewPostDetailPage/components/PassViewDetail';
import RentalViewDetail from '@/pages/ViewPostDetailPage/components/RentalViewDetail';
import postService, { FullPostResponseType } from '@/services/post.service';
import {
  JoinPostSelectSchemaType,
  PassPostSelectSchemaType,
  RentalPostSelectSchemaType,
  WantedPostSelectSchemaType,
} from '@/types/schema.type';
import { generateCloudinaryImageOptimizer, handleAxiosError } from '@/utils/constants.helper';
import React from 'react';
import ImageGallery from 'react-image-gallery';
import { Navigate } from 'react-router-dom';

const ViewPostDetailPage = () => {
  const { params } = useUrl();
  const postId = Number(params.postId);
  const [postData, setPostData] = React.useState<FullPostResponseType<
    RentalPostSelectSchemaType | WantedPostSelectSchemaType | JoinPostSelectSchemaType | PassPostSelectSchemaType
  > | null>(null);
  const { post, assets } = postData ?? {};

  React.useEffect(() => {
    const handleGetFullPost = async (postId: number) => {
      try {
        const response = await postService.getFullPost(postId);
        setPostData(response.data[0]);
      } catch (error) {
        console.log(handleAxiosError(error));
      }
    };

    if (postId) handleGetFullPost(postId);
  }, [postId]);

  React.useEffect(() => {
    const handleUpdatePostViewCount = async (postId: number) => {
      try {
        await postService.updatePostViewCount(postId);
      } catch (error) {
        console.log(handleAxiosError(error));
      }
    };
    if (postId) {
      handleUpdatePostViewCount(postId);
    }
  }, [postId]);

  const postImages = React.useMemo(() => {
    if (!assets?.length) return [];
    return assets.map((item) => generateCloudinaryImageOptimizer(item.url));
  }, [assets]);

  if (!postId) {
    return <Navigate to={'/404'} />;
  }
  return (
    <div className='tw-w-full tw-min-h-[calc(100vh-var(--header-height))] tw-bg-backgroundColor tw-pt-[40px]'>
      <div className='tw-container tw-mx-auto tw-p-[12px]'>
        <div className='tw-flex tw-flex-col laptop:tw-flex-row tw-items-start tw-gap-6'>
          <div className='tw-flex-1 tw-mb-2'>
            {!!assets?.length && (
              <ImageGallery thumbnailPosition='bottom' showBullets showPlayButton={false} lazyLoad items={postImages} />
            )}
            <section className='PostViewDetail__detail'>
              {post?.type === 'rental' && <RentalViewDetail data={postData as any} />}
              {post?.type === 'wanted' && <WantedViewDetail data={postData as any} />}
              {post?.type === 'join' && <JoinViewDetail data={postData as any} />}
              {post?.type === 'pass' && <PassViewDetail data={postData as any} />}
            </section>
          </div>
          {/* Owner contact info */}
          <div className='tw-w-full laptop:tw-sticky tw-top-[calc(var(--header-height)+12px)] laptop:tw-w-[400px] tw-bg-white tw-shadow tw-rounded tw-p-[24px]'>
            <OwnerContactTab post={post!} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPostDetailPage;
