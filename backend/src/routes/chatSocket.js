const jwt = require('jsonwebtoken');
const User = require('../models/User');
const License = require('../models/License');
const Message = require('../models/Message');

module.exports = function (io) {
  // Enhanced authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Verify user permissions
      const user = await User.findByPk(decoded.id);
      if (!user) return next(new Error('User not found'));
      
      // License verification (reuse existing middleware logic)
      const license = await License.findOne({ 
        where: { key: user.licenseKey } 
      });
      if (!license || license.isUsed === false) {
        return next(new Error('Invalid license'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  // Message handling (integrated with database)
  io.on('connection', (socket) => {
    socket.on('message', async (content) => {
      try {
        // Save message to database
        const message = await Message.create({
          content,
          userId: socket.user.userid
        });
        
        // Broadcast standardized message format
        io.emit('message', {
          ...message.toJSON(),
          username: socket.user.username
        });
      } catch (error) {
        console.error('Message save failed:', error);
      }
    });
  });
};
