module.exports = function (io) {
  io.on('connection', (socket) => {
    // Fixed socket connection logging
    console.log(`🟢 New socket connected: ${socket.id}`);
    
    socket.on('message', async (msg) => {
      try {
        console.log(`📨 Message from ${socket.id}:`, msg);
        io.emit('message', {
          ...msg,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Message handling error:', error);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`🔴 Socket disconnected: ${socket.id} (${reason})`);
    });
  });
};