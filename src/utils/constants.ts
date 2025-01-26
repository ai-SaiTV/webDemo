export const API_BASE_URL = 'https://api.coze.cn/v3';
export const POLLING_INTERVAL = 1000; // 1 second as per API docs recommendation

export const CHAT_STATUS = {
  CREATED: 'created',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REQUIRES_ACTION: 'requires_action',
  CANCELED: 'canceled',
} as const;