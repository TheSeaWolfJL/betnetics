import getSocket from '../socket';

interface NotifyPayload {
  type?: 'success' | 'error' | 'info';
  message?: string;
  room?: string;
  meta?: any;
}

export function notifyServerAfterApi(payload: NotifyPayload) {
  const socket = getSocket();
  if (!socket) return;
  try {
    socket.emit('requestNotification', payload);
  } catch (err) {
    console.error('failed to emit requestNotification', err);
  }
}

export default notifyServerAfterApi;
