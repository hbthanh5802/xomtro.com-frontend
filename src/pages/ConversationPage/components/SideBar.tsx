import EmptyMessage from '@/assets/EmptyMessage';
import useUrl from '@/hooks/useUrl.hook';
import ConversationItem from '@/pages/ConversationPage/components/ConversationItem';
import ConversationItemSkeleton from '@/pages/ConversationPage/components/ConversationItemSkeleton';
import conversationService from '@/services/conversation.service';
import { useAppStore } from '@/store/store';
import { GetIndividualConversationResponseType } from '@/types/conservation.type';
import { Input, Typography } from '@mui/joy';
import React from 'react';
import { IoIosSearch } from 'react-icons/io';
import { useShallow } from 'zustand/react/shallow';

interface SideBarProps {
  selectedConversation: GetIndividualConversationResponseType | null;
  setSelectedConversation: React.Dispatch<React.SetStateAction<GetIndividualConversationResponseType | null>>;
}
const SideBar = (props: SideBarProps) => {
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
      <section className='tw-sticky tw-z-10 tw-bg-white tw-shadow-sm tw-top-0 tw-px-[18px] tw-py-[18px] tw-flex tw-flex-col tw-gap-1'>
        <Typography level='title-lg'>Tin nhắn</Typography>
        <Input disabled startDecorator={<IoIosSearch className='tw-text-[20px]' />} placeholder='Tìm người dùng' />
      </section>

      <section>
        {getUserIndividualConversationFetching && (
          <>
            <ConversationItemSkeleton />
            <ConversationItemSkeleton />
            <ConversationItemSkeleton />
          </>
        )}
        {userIndividualConversations?.length ? (
          userIndividualConversations?.map((item, index) => {
            return (
              <div
                key={`ConversationItem_${conversationItemId}_${index}`}
                onClick={() => setSelectedConversation(item)}
              >
                <ConversationItem selectedConversation={selectedConversation} data={item} />
              </div>
            );
          })
        ) : (
          <div className='tw-p-[24px] tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-2'>
            <EmptyMessage color='#333' />
            <Typography level='title-sm'>Danh sách trống!</Typography>
            <Typography level='body-sm'>Bạn chưa từng nhắn tin với ai.</Typography>
          </div>
        )}
      </section>
    </div>
  );
};

export default SideBar;
