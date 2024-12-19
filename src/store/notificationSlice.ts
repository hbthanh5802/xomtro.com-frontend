import { StateCreator } from 'zustand';

type notificationState = {
  openNotificationPopover: boolean;
};

type notificationActions = {
  setOpenNotificationPopover: (isOpen: boolean) => void;
  resetNotificationState: () => void;
};

const initialState: notificationState = {
  openNotificationPopover: false,
};

export type notificationSlice = notificationState & notificationActions;

type zustandMiddlewares = [['zustand/immer', never], ['zustand/devtools', never]];

export const createNotificationSlice: StateCreator<notificationSlice, zustandMiddlewares, [], notificationSlice> = (
  set,
) => ({
  ...initialState,
  setOpenNotificationPopover: (isOpen) =>
    set((state) => {
      state.openNotificationPopover = isOpen;
    }),
  resetNotificationState: () => set(initialState),
});
