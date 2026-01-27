import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket() {
  if (typeof window === 'undefined') return null;
  if (!socket) {
    const url = (process.env.NEXT_PUBLIC_WS_URL as string) || 'http://localhost:4000';
    socket = io(url, {
      transports: ['websocket'],
      autoConnect: true,
    });
  }
  return socket;
}

export default getSocket;
