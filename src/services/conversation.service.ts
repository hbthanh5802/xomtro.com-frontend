/* eslint-disable react-hooks/rules-of-hooks */
import { axiosAuthRequest } from '@/configs/axios.config';
import { PaginationType } from '@/store/postFilterSlice';
import { TanstackQueryOptions } from '@/types/common.type';
import {
  CreateIndividualConversationDataType,
  GetConversationMessagesResponseType,
  GetIndividualConversationResponseType,
  InsertMessageDataType,
} from '@/types/conservation.type';
import { ChatSelectSchemaType, MessageSelectSchemaType } from '@/types/schema.type';
import { useQuery } from '@tanstack/react-query';

class conversationService {
  getUserIndividualConversations(options: TanstackQueryOptions) {
    return useQuery({
      queryKey: ['conversations', 'individual'],
      queryFn: () =>
        axiosAuthRequest<GetIndividualConversationResponseType[]>({
          method: 'GET',
          url: '/conversations/individual',
        }),
      ...options,
    });
  }

  getConversationMessages(conversationId: number, options: PaginationType & { sentAt?: 'asc' | 'desc' }) {
    return axiosAuthRequest<GetConversationMessagesResponseType>({
      method: 'GET',
      url: `/conversations/${conversationId}/messages`,
      params: { ...options },
    });
  }

  createMessage(data: InsertMessageDataType) {
    return axiosAuthRequest<MessageSelectSchemaType>({
      method: 'POST',
      url: '/conversations/messages',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  createIndividualConversation(data: CreateIndividualConversationDataType) {
    return axiosAuthRequest<ChatSelectSchemaType>({
      method: 'POST',
      url: '/conversations/individual',
      data,
    });
  }

  updateLastReadConversation(conversationId: number) {
    return axiosAuthRequest({
      method: 'PUT',
      url: `/conversations/${conversationId}/read`,
    });
  }

  recallMessage(messageId: number) {
    return axiosAuthRequest({
      method: 'PUT',
      url: `/conversations/messages/${messageId}/recall`,
    });
  }
}

export default new conversationService();
