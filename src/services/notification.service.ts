import { axiosAuthRequest } from '@/configs/axios.config';
import { PaginationType } from '@/store/postFilterSlice';
import { PaginationResponseType } from '@/types/common.type';
import { NotificationSelectSchemaType } from '@/types/schema.type';

export type GetNotificationDataType = {
  whereConditions: {
    type?: 'chat' | 'post' | 'account' | 'general';
    isRead?: boolean;
    postId?: number;
  };
  orderConditions: {
    updatedAt?: 'asc' | 'desc';
    createdAt?: 'asc' | 'desc';
  };
  pagination: PaginationType;
};

export type GetUserNotificationResponseType = {
  results: NotificationSelectSchemaType[];
  pagination: PaginationResponseType;
};

class notificationServices {
  getUserNotifications(conditions: GetNotificationDataType) {
    return axiosAuthRequest<GetUserNotificationResponseType>({
      method: 'POST',
      url: '/notifications/me',
      data: conditions,
    });
  }

  setReadNotifications(notificationIds: number[]) {
    return axiosAuthRequest({
      method: 'PUT',
      url: '/notifications/read',
      params: {
        ids: notificationIds,
      },
    });
  }

  setReadAllNotifications() {
    return axiosAuthRequest({
      method: 'PUT',
      url: '/notifications/read/all',
    });
  }
}

export default new notificationServices();
