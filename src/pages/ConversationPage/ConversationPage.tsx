import ConversationView from '@/pages/ConversationPage/components/ConversationView';
import SideBar from '@/pages/ConversationPage/components/SideBar';
import { useAppStore } from '@/store/store';
import { GetIndividualConversationResponseType } from '@/types/conservation.type';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

const ConversationPage = () => {
  const [selectedConversation, setSelectedConversation] = React.useState<GetIndividualConversationResponseType | null>(
    null,
  );

  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
    })),
  );
  const handleChooseConversation = React.useCallback(setSelectedConversation, [setSelectedConversation]);

  if (!currentUser) {
    return <Navigate to={'/403'} />;
  }
  return (
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
  );
};

export default ConversationPage;