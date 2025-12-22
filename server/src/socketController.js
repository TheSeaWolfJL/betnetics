export const socketController = (socket, io) => {
    const emit = (event, data) => io.emit(event, data);
    socket.on(events.beginPath, (data) => broadcast(events.beganPath, data));
}