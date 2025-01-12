import EmptyMessage from '@/assets/EmptyMessage';
import useUrl from '@/hooks/useUrl.hook';
import ConversationItemSkeleton from '@/pages/ConversationPage/components/ConversationItemSkeleton';
import ConversationMobileItem from '@/pages/ConversationPage/components/ConversationMobileItem';
import conversationService from '@/services/conversation.service';
import { useAppStore } from '@/store/store';
import { GetIndividualConversationResponseType } from '@/types/conservation.type';
import { Typography } from '@mui/joy';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';

interface SideBarMobileProps {
  selectedConversation: GetIndividualConversationResponseType | null;
  setSelectedConversation: React.Dispatch<React.SetStateAction<GetIndividualConversationResponseType | null>>;
}
const SideBarMobile = (props: SideBarMobileProps) => {
  const { setSelectedConversation, selectedConversation } = props;
  const { params } = useUrl();
  const { conversationId } = params;
  const conversationItemId = React.useId();

  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      socketInstance: state.socketInstance,
    })),
  );

  const { data: getUserIndividualConversationResponse, isFetching: getUserIndividualConversationFetching } =
    conversationService.getUserIndividualConversations({
      enabled: !!currentUser,
    });
  const userIndividualConversations = getUserIndividualConversationResponse?.data;

  React.useEffect(() => {
    if (conversationId) {
      const target = userIndividualConversations?.find(
        (conversation) => conversation.chatId === Number(conversationId),
      );
      if (target) setSelectedConversation(target);
    }
  }, [conversationId, userIndividualConversations, setSelectedConversation]);

  return (
    <div className='tw-relative tw-bg-white tw-h-full tw-overflow-y-auto tw-scrollbar-thin tw-scrollbar-track-rounded-full tw-border-r'>
      <section className='tw-flex tw-p-[8px] tw-h-[60px] tw-items-center tw-max-w-[100dvw] tw-gap-2 tw-overflow-x-auto tw-overflow-y-'>
        {getUserIndividualConversationFetching ? (
          <>
            <ConversationItemSkeleton />
            <ConversationItemSkeleton />
            <ConversationItemSkeleton />
          </>
        ) : userIndividualConversations?.length ? (
          userIndividualConversations?.map((item, index) => {
            return (
              <div
                key={`ConversationItem_${conversationItemId}_${index}`}
                onClick={() => setSelectedConversation(item)}
              >
                <ConversationMobileItem selectedConversation={selectedConversation} data={item} />
              </div>
            );
          })
        ) : (
          <div className='tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-2'>
            <EmptyMessage color='#333' />
            <Typography level='title-sm'>Danh sách trống!</Typography>
            <Typography level='body-sm'>Bạn chưa từng nhắn tin với ai.</Typography>
          </div>
        )}
      </section>
    </div>
  );
};

export default SideBarMobile;
