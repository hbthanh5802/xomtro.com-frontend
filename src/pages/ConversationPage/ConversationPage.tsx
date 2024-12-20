import useUrl from '@/hooks/useUrl.hook';
import ConversationView from '@/pages/ConversationPage/components/ConversationView';
import SideBar from '@/pages/ConversationPage/components/SideBar';
import conversationService from '@/services/conversation.service';
import { useAppStore } from '@/store/store';
import { GetIndividualConversationResponseType } from '@/types/conservation.type';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

const ConversationPage = () => {
  const { params, search } = useUrl();
  const { conversationId } = params;
  const { slug } = search;
  const [selectedConversation, setSelectedConversation] = React.useState<GetIndividualConversationResponseType | null>(
    null,
  );

  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
    })),
  );
  const handleChooseConversation = React.useCallback(setSelectedConversation, [setSelectedConversation]);
  const { data: getUserIndividualConversationResponse } = conversationService.getUserIndividualConversations({
    enabled: !!currentUser,
  });
  const userIndividualConversations = getUserIndividualConversationResponse?.data;

  React.useEffect(() => {
    if (conversationId && Number.isSafeInteger(Number(conversationId))) {
      const conversation = userIndividualConversations?.find((con) => con.chatId === Number(conversationId));
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }
  }, [userIndividualConversations, conversationId, slug]);

  if (!currentUser) {
    return <Navigate to={'/403'} />;
  }
  return (
    <>
      <Helmet>
        <title>Tin nhắn - Xóm Trọ</title>
        <meta name='description' content={'Website Chia sẻ Và Tìm kiếm thông tin nhà trọ'} />
      </Helmet>
      <div className='tw-h-[calc(100dvh-var(--header-height))] tw-bg-backgroundColor tw-flex tw-flex-col tablet:tw-flex-row'>
        <div className='tw-hidden tablet:tw-block tablet:tw-w-[300px] laptop:tw-w-[400px]'>
          <SideBar selectedConversation={selectedConversation} setSelectedConversation={handleChooseConversation} />
        </div>
        <div className='tw-flex-1 tw-flex tw-h-[calc(100dvh-var(--header-height))]'>
          <ConversationView
            selectedConversation={selectedConversation}
            setSelectedConversation={handleChooseConversation}
          />
        </div>
      </div>
    </>
  );
};

export default ConversationPage;
