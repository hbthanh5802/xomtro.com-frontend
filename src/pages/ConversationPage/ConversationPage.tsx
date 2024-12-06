import ConversationView from '@/pages/ConversationPage/components/ConversationView';
import SideBar from '@/pages/ConversationPage/components/SideBar';
import { GetIndividualConversationResponseType } from '@/types/conservation.type';
import React from 'react';

const ConversationPage = () => {
  const [selectedConversation, setSelectedConversation] = React.useState<GetIndividualConversationResponseType | null>(
    null,
  );

  const handleChooseConversation = React.useCallback(setSelectedConversation, [setSelectedConversation]);
  return (
    <div className='tw-h-[calc(100dvh-var(--header-height))] tw-bg-backgroundColor tw-flex'>
      <div className='tw-hidden tablet:tw-block tablet:tw-w-[300px] laptop:tw-w-[400px]'>
        <SideBar selectedConversation={selectedConversation} setSelectedConversation={handleChooseConversation} />
      </div>
      <div className='tw-flex-1 tw-flex tw-h-[calc(100dvh-var(--header-height))]'>
        <ConversationView selectedConversation={selectedConversation} />
      </div>
    </div>
  );
};

export default ConversationPage;
