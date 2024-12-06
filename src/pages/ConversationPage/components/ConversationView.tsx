import ConversationViewEmpty from '@/pages/ConversationPage/components/ConversationViewEmpty';
import ConversationViewSkeleton from '@/pages/ConversationPage/components/ConversationViewSkeleton';
import { default as MessageBubble } from '@/pages/ConversationPage/components/MessageBubble';
import ConversationHeader from '@/pages/ConversationPage/components/MessageHeader';
import MessageInput from '@/pages/ConversationPage/components/MessageInput';
import conversationService from '@/services/conversation.service';
import { useAppStore } from '@/store/store';
import { PaginationResponseType } from '@/types/common.type';
import { GetIndividualConversationResponseType } from '@/types/conservation.type';
import { MessageSelectSchemaType } from '@/types/schema.type';
import { handleAxiosError } from '@/utils/constants.helper';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

interface ConversationViewProps {
  selectedConversation: GetIndividualConversationResponseType | null;
}
const ConversationView = (props: ConversationViewProps) => {
  const { selectedConversation } = props;
  const messageItemId = React.useId();
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<MessageSelectSchemaType[]>([]);
  const [pagination, setPagination] = React.useState<PaginationResponseType | null>(null);

  const messageContainerRef = React.useRef<HTMLDivElement>(null); // Ref cho container
  const messageBubbleRef = React.useRef<HTMLDivElement>(null);

  const { currentUser } = useAppStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
    })),
  );

  const handleFetchMessage = React.useCallback(async (conversationId: number, page: number) => {
    if (loading) return; // Ngăn chặn gọi API khi đang load
    setLoading(true);
    try {
      const response = await conversationService.getConversationMessages(conversationId, { page });
      const messageData = response.data.results;
      const paginationData = response.data.pagination;
      setMessages((prev) => [...prev, ...messageData]); // Thêm tin nhắn mới vào cuối danh sách
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

    if (Number(container?.clientHeight) - Number(container?.scrollTop) >= Number(container?.clientHeight) + 100) {
      // Khi cuộn gần đầu container
      handleFetchMessage(Number(selectedConversation?.chatId), pagination.currentPage + 1);
    }
  }, [loading, pagination, selectedConversation?.chatId, handleFetchMessage]);

  const handleRecallMessageSuccess = (messageIndex: number) => {
    console.log(messageIndex);
    if (messageIndex || messageIndex === 0) {
      setMessages((prev) => {
        const newMessage = [...prev];
        newMessage[messageIndex].isRecalled = true;
        return newMessage;
      });
    }
  };

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
    if (messageBubbleRef.current) {
      messageBubbleRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    handleUpdateLastReadConversation();
  }, [messages, handleUpdateLastReadConversation]);

  if (!selectedConversation) {
    return <>Chọn cuộc hội thoại</>;
  }
  if (!currentUser) {
    return <Navigate to={'/403'} />;
  }

  return (
    <div className='tw-relative tw-flex-1 tw-flex tw-flex-col'>
      <div className=''>
        <ConversationHeader selectedConversation={selectedConversation} />
      </div>
      <div
        ref={messageContainerRef} // Gán ref cho container tin nhắn
        className='MessageBubble__container tw-flex tw-flex-col tw-flex-1 tw-overflow-auto tw-p-[24px] tw-gap-2'
      >
        {loading && <ConversationViewSkeleton />}
        {!loading && messages.length ? (
          messages.map((messageItem, index) => {
            return (
              <div ref={messageBubbleRef}>
                <MessageBubble
                  key={`MessageBubble-${messageItemId}-${index}`}
                  data={messageItem}
                  currentUserId={currentUser?.userId}
                  onRecallSuccess={() => handleRecallMessageSuccess(index)}
                />
              </div>
            );
          })
        ) : (
          <ConversationViewEmpty />
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
