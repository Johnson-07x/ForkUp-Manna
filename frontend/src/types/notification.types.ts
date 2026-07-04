export type NotificationType =
  | 'DONATION_CREATED'
  | 'DONATION_CLAIMED'
  | 'CLAIM_APPROVED'
  | 'CLAIM_REJECTED'
  | 'DELIVERY_ASSIGNED'
  | 'DELIVERY_COMPLETED'
  | 'SYSTEM';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  referenceId?: string;
  referenceType?: string;
  createdAt: string;
}

export interface NotificationPage {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
