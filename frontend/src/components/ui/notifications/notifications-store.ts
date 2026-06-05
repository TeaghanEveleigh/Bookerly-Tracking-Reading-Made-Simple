import { nanoid, ZodNanoID } from "zod";
import { create } from 'zustand'

export type Notification = {
    id: ZodNanoID;
    type: 'info' | 'warning' | 'success' | 'error';
    title: string;
    message?: string;
}
type NotificationStore = {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    dismissNotification: (id: ZodNanoID) => void;
}

export const useNotifications = create<NotificationStore>()((set) => ({
    notifications: [],
    addNotification: (notification) =>
        set((state) => ({
            notifications: [
                ...state.notifications,
                { id: nanoid(), ...notification }
            ]
        })),
    dismissNotification: (id) =>
        set((state) => ({
            notifications: [
                ...state.notifications.filter(
                    (notification) =>
                        notification.id === id)
            ]
        }))
}));