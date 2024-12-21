import ConversationViewEmpty from '@/pages/ConversationPage/components/ConversationViewEmpty';
import ConversationViewSkeleton from '@/pages/ConversationPage/components/ConversationViewSkeleton';
import { default as MessageBubble } from '@/pages/ConversationPage/components/MessageBubble';
import ConversationHeader from '@/pages/ConversationPage/components/MessageHeader';
import MessageInput from '@/pages/ConversationPage/components/MessageInput';
import SideBarMobile from '@/pages/ConversationPage/components/SideBarMobile';
import conversationService from '@/services/conversation.service';
import { useAppStore } from '@/store/store';
import { PaginationResponseType } from '@/types/common.type';
import { GetIndividualConversationResponseType } from '@/types/conservation.type';
import { MessageSelectSchemaType } from '@/types/schema.type';
import { handleAxiosError } from '@/utils/constants.helper';
import { Typography } from '@mui/joy';
import React from 'react';
import { TbMessageFilled } from 'react-icons/tb';
import { Navigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

interface ConversationViewProps {
  selectedConversation: GetIndividualConversationResponseType | null;
  setSelectedConversation: React.Dispatch<React.SetStateAction<GetIndividualConversationResponseType | null>>;
}
const ConversationView = (props: ConversationViewProps) => {
  const { selectedConversation, setSelectedConversation } = props;
  const messageItemId = React.useId();
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<MessageSelectSchemaType[]>([]);
  const [pagination, setPagination] = React.useState<PaginationResponseType | null>(null);

  const messageContainerRef = React.useRef<HTMLDivElement>(null); // Ref cho container
  const messageBubbleRef = React.useRef<HTMLDivElement>(null); // Ref cho container

  const { currentUser, socketInstance } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      socketInstance: state.socketInstance,
    })),
  );

  const handleFetchMessage = React.useCallback(async (conversationId: number, page: number) => {
    if (loading) return; // Ngăn chặn gọi API khi đang load
    setLoading(true);
    try {
      const response = await conversationService.getConversationMessages(conversationId, {
        page,
        pageSize: 30,
        sentAt: 'desc',
      });
      const messageData = response.data.results.reverse();
      const paginationData = response.data.pagination;
      setMessages((prev) => [...messageData, ...prev]);
      setPagination(paginationData);
    } catch (error) {
      console.log(handleAxiosError(error));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessageSuccess = React.useCallback((data: MessageSelectSchemaType) => {
    if (data) setMessages((prev) => [...prev, data]);
  }, []);

  React.useEffect(() => {
    if (selectedConversation?.chatId) {
      setMessages([]);
      setPagination(null);
      handleFetchMessage(selectedConversation.chatId, 1);
    }
  }, [handleFetchMessage, selectedConversation?.chatId]);

  // Gọi API khi cuộn gần cuối
  const handleScroll = React.useCallback(() => {
    const container = messageContainerRef.current;
    if (!container || loading || !pagination?.canNext) return;

    const scrollThreshold = 1;
    if (container?.scrollTop <= scrollThreshold) {
      // Khi cuộn gần đầu container
      handleFetchMessage(Number(selectedConversation?.chatId), pagination.currentPage + 1);
    }
  }, [loading, pagination, selectedConversation?.chatId, handleFetchMessage]);

  const handleRecallMessageSuccess = (messageIndex: number) => {
    if (messageIndex || messageIndex === 0) {
      setMessages((prev) => {
        const newMessage = [...prev];
        newMessage[messageIndex].isRecalled = true;
        return newMessage;
      });
    }
  };

  const handleReceivedNewMessage = React.useCallback(
    (newMessage: MessageSelectSchemaType) => {
      if (newMessage && newMessage.chatId === selectedConversation?.chatId) {
        setMessages((prev) => [...prev, newMessage]);
      }
    },
    [setMessages, selectedConversation],
  );

  const handleRecalledNewMessage = React.useCallback(
    (recallMessage: MessageSelectSchemaType) => {
      if (selectedConversation?.chatId !== recallMessage.chatId) return;
      const messageIndex = messages.findIndex((message) => message.id === recallMessage.id);
      if (messageIndex > -1) {
        setMessages((prev) => {
          const newMessage = [...prev];
          newMessage[messageIndex].isRecalled = true;
          return newMessage;
        });
      }
    },
    [setMessages, selectedConversation, messages],
  );

  React.useEffect(() => {
    if (!socketInstance) return;
    socketInstance.on('new-message', handleReceivedNewMessage);
    socketInstance.on('recall-message', handleRecalledNewMessage);

    return () => {
      socketInstance.off('new-message', handleReceivedNewMessage);
      socketInstance.off('recall-message', handleRecalledNewMessage);
    };
  }, [socketInstance, handleReceivedNewMessage, handleRecalledNewMessage]);

  const handleUpdateLastReadConversation = React.useCallback(async () => {
    if (!selectedConversation?.chatId) return;
    try {
      await conversationService.updateLastReadConversation(selectedConversation?.chatId);
    } catch (error) {
      console.log(handleAxiosError(error));
    }
  }, [selectedConversation]);

  React.useEffect(() => {
    const container = messageContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  React.useEffect(() => {
    handleUpdateLastReadConversation();
  }, [handleUpdateLastReadConversation]);

  React.useEffect(() => {
    if (messages.length && messageBubbleRef.current) {
      messageBubbleRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!selectedConversation) {
    return (
      <div className='tw-flex  tw-flex-1 tw-flex-col'>
        <div className='tw-block tablet:tw-hidden'>
          <SideBarMobile
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
          />
        </div>
        <div className='tw-w-full tw-flex-1 tw-flex tw-flex-col tw-gap-1 tw-items-center tw-justify-center'>
          <TbMessageFilled className='tw-text-[100px] tw-text-slate-500' />
          <Typography>Hãy cọn một cuộc hội thoại</Typography>
        </div>
      </div>
    );
  }
  if (!currentUser) {
    return <Navigate to={'/403'} />;
  }

  return (
    <div className='tw-relative tw-flex-1 tw-flex tw-flex-col'>
      <div className='tw-block tablet:tw-hidden'>
        <SideBarMobile selectedConversation={selectedConversation} setSelectedConversation={setSelectedConversation} />
      </div>
      <div className=''>
        <ConversationHeader selectedConversation={selectedConversation} />
      </div>
      <div
        ref={messageContainerRef} // Gán ref cho container tin nhắn
        className='MessageBubble__container tw-flex tw-flex-col tw-flex-1 tw-overflow-auto tw-p-[24px] tw-gap-2'
      >
        {loading && <ConversationViewSkeleton />}
        {!loading ? (
          messages.length ? (
            messages.map((messageItem, index) => {
              return (
                <div ref={messageBubbleRef} key={`MessageBubble-${messageItemId}-${index}`}>
                  <MessageBubble
                    data={messageItem}
                    currentUserId={currentUser?.userId}
                    onRecallSuccess={() => handleRecallMessageSuccess(index)}
                  />
                </div>
              );
            })
          ) : (
            <ConversationViewEmpty />
          )
        ) : (
          <></>
        )}
      </div>
      <div className=''>
        <MessageInput
          onSendMessageSuccess={handleSendMessageSuccess}
          selectedConversationId={selectedConversation.chatId}
        />
      </div>
    </div>
  );
};

export default ConversationView;
