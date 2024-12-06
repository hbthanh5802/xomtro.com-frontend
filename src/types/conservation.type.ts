import { PaginationResponseType } from '@/types/common.type';
import { MessageSelectSchemaType } from '@/types/schema.type';
import { insertMessageValidation } from '@/validations/conversation.validation';
import { z } from 'zod';

export type GetIndividualConversationResponseType = {
  id: number;
  chatId: number;
  userId: number;
  joinedAt: string;
  lastReadAt: string | null;
};

export type GetConversationMessagesResponseType = {
  results: MessageSelectSchemaType[];
  pagination: PaginationResponseType;
};

export type InsertMessageDataType = z.infer<typeof insertMessageValidation>;

export type CreateIndividualConversationDataType = {
  members: [number, number];
};
