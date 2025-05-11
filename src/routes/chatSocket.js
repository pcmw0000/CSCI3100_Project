const jwt = require('jsonwebtoken');
const User = require('../models/User');
const License = require('../models/License');
const Message = require('../models/Message');

module.exports = function(io) {
  // Middleware for Socket.io connections to authenticate and authorize
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;  // expecting the token from client handshake (e.g., io.connect with auth)
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      // Verify JWT and get user ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return next(new Error('User not found'));
      }
      // Check that the user's license is valid (similar to licenseCheck middleware)
      const license = await License.findOne({ where: { key: user.licenseKey } });
      if (!license || license.isUsed === false) {
        return next(new Error('Invalid license'));
      }
      if (
        license.type === 'subscription' && 
        license.expirationDate && 
        new Date(license.expirationDate) < new Date()
      ) {
        return next(new Error('License expired'));
      }

      // Attach the user object to the socket for later use and proceed
      socket.user = user;
      return next();
    } catch (err) {
      return next(new Error('Invalid token'));
    }
  });

  // Handle socket connections and events
  io.on('connection', (socket) => {
    console.log(`User ${socket.user.username} connected via WebSocket`);
    // Example event: receiving a chat message
    socket.on('message', async (msg) => {
      if (!msg.content || !msg.content.trim()) {
        return socket.emit('error', 'Message cannot be empty');
      }
      try {
        // Save the message to the database (with reference to the user)
        const newMessage = await Message.create({
          content: msg.content,
          userId: socket.user.id   // assume Message model has a userId foreign key
        });
        // Broadcast the message to all connected clients
        io.emit('message', newMessage);
      } catch (error) {
        console.error('Message send failed:', error);
        socket.emit('error', 'Failed to send message');
      }
    });
  });
};
