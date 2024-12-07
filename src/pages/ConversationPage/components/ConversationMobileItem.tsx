import AvatarWithStatus from '@/pages/ConversationPage/components/AvatarWithStatus';
import { GetIndividualConversationResponseType } from '@/types/conservation.type';

interface ConversationMobileItemProps {
  data: GetIndividualConversationResponseType;
  selectedConversation: GetIndividualConversationResponseType | null;
}
const ConversationMobileItem = (props: ConversationMobileItemProps) => {
  const { selectedConversation } = props;
  const { userId, chatId } = props.data;

  return (
    <div
      className={`tw-flex tw-items-start tw-gap-2 hover:tw-bg-backgroundColor ${
        selectedConversation?.chatId === chatId ? 'tw-bg-backgroundColor' : ''
      } tw-rounded tw-cursor-pointer`}
    >
      <AvatarWithStatus size='md' userId={userId} />
    </div>
  );
};

export default ConversationMobileItem;
