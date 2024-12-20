/* eslint-disable @typescript-eslint/no-explicit-any */
import PostComments from '@/components/PostComments';
import useUrl from '@/hooks/useUrl.hook';
import {
  default as JoinViewDetail,
  default as WantedViewDetail,
} from '@/pages/ViewPostDetailPage/components/JoinViewDetail';
import OwnerContactTab from '@/pages/ViewPostDetailPage/components/OwnerContactTab';
import PassViewDetail from '@/pages/ViewPostDetailPage/components/PassViewDetail';
import RentalViewDetail from '@/pages/ViewPostDetailPage/components/RentalViewDetail';
import postService, { FullPostResponseType } from '@/services/post.service';
import { useAppStore } from '@/store/store';
import {
  JoinPostSelectSchemaType,
  PassPostSelectSchemaType,
  RentalPostSelectSchemaType,
  WantedPostSelectSchemaType,
} from '@/types/schema.type';
import { generateCloudinaryImageOptimizer, handleAxiosError } from '@/utils/constants.helper';
import React from 'react';
import { Helmet } from 'react-helmet';
import ImageGallery from 'react-image-gallery';
import { useMediaQuery } from 'react-responsive';
import { Navigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

const ViewPostDetailPage = () => {
  const { params, hash } = useUrl();
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)',
  });
  const postId = Number(params.postId);
  const [postData, setPostData] = React.useState<FullPostResponseType<
    RentalPostSelectSchemaType | WantedPostSelectSchemaType | JoinPostSelectSchemaType | PassPostSelectSchemaType
  > | null>(null);
  const { post, assets } = postData ?? {};
  const commentContainerRef = React.useRef<HTMLElement>(null);

  const { resetPostCommentState } = useAppStore(
    useShallow((state) => ({
      resetPostCommentState: state.resetPostCommentState,
    })),
  );

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

  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (!hash) return;
  //     const element = document.querySelector(hash);
  //     if (element) {
  //       element.scrollIntoView({ behavior: 'smooth' });
  //       clearInterval(interval);
  //     }
  //   }, 100);

  //   return () => clearInterval(interval);
  // }, [hash]);

  React.useEffect(() => {
    // Cleanup logic: reset post comment state on unmount
    return () => {
      resetPostCommentState();
    };
  }, [resetPostCommentState]);

  if (!postId) {
    return <Navigate to={'/404'} />;
  }
  return (
    <>
      <Helmet>
        <title>{post?.title || 'Website Chia sẻ Và Tìm kiếm thông tin nhà trọ'}</title>
        <meta name='description' content={post?.title || 'Website Chia sẻ Và Tìm kiếm thông tin nhà trọ'} />
      </Helmet>
      <div className='tw-w-full tw-min-h-[calc(100vh-var(--header-height))] tw-bg-backgroundColor tw-pt-[40px]'>
        <div className='tw-container tw-mx-auto tw-p-[12px]'>
          <div className='tw-flex tw-flex-col laptop:tw-flex-row tw-items-start tw-gap-6'>
            <div className='tw-flex-1 tw-max-w-full laptop:tw-max-w-[calc(100%-400px)] tw-mb-2'>
              {!!assets?.length && (
                <ImageGallery
                  thumbnailPosition='bottom'
                  showBullets
                  showPlayButton={false}
                  lazyLoad
                  items={postImages}
                />
              )}
              {post && (
                <section className='PostViewDetail__detail'>
                  {post?.type === 'rental' && <RentalViewDetail data={postData as any} />}
                  {post?.type === 'wanted' && <WantedViewDetail data={postData as any} />}
                  {post?.type === 'join' && <JoinViewDetail data={postData as any} />}
                  {post?.type === 'pass' && <PassViewDetail data={postData as any} />}
                </section>
              )}
              {post && isDesktopOrLaptop && (
                <section
                  ref={commentContainerRef}
                  id='comments'
                  className='tw-bg-white tw-p-[24px] tw-mt-[12px] tw-shadow-sm tw-rounded tw-hidden laptop:tw-block'
                >
                  <PostComments scrollIntoView={hash === '#comments'} postId={post?.id} maxHeight='100dvh' />
                </section>
              )}
            </div>
            {/* Owner contact info */}
            <div className='tw-w-full laptop:tw-sticky tw-top-[calc(var(--header-height)+12px)] tw-grow-0 tw-shrink-0 laptop:tw-w-[400px] tw-bg-white tw-shadow tw-rounded tw-p-[24px]'>
              <OwnerContactTab post={post!} />
            </div>

            {post && !isDesktopOrLaptop && (
              <section
                ref={commentContainerRef}
                id='comments'
                className='tw-w-full laptop:tw-sticky tw-top-[calc(var(--header-height)+12px)] tw-grow-0 tw-shrink-0 laptop:tw-w-[400px] tw-bg-white tw-p-[24px] tw-mt-[12px] tw-shadow-sm tw-rounded tw-block laptop:tw-hidden'
              >
                <PostComments scrollIntoView={hash === '#comments'} postId={post?.id} maxHeight='100dvh' />
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPostDetailPage;
