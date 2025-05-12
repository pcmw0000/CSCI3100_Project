const express = require('express');
const http = require('http');
const cors = require('cors');
const cron = require('node-cron');
const sequelize = require('./config/database');
const { Server } = require('socket.io');
const initChat = require('./routes/chatSocket');
const authRoutes = require('./routes/auth');
const countryRoutes = require('./routes/countries');
const chatRoutes = require('./routes/chat');
const licenseRoutes = require('./routes/license');
const purgeMessages = require('./cron/purgeMessages');
const rateLimit = require('./middlewares/rateLimit');
const licenseCheck = require('./middlewares/licenseCheck');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Chat Services
// 1. Configure EJS templates
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// 2. Serve static files from public/
app.use(express.static(path.join(__dirname, '../public')));

// 3. Chat room management (moved from chat/server.js)
const rooms = {};

// 4. Add chat-specific routes
app.get('/chat', (req, res) => {
  res.render('index', { rooms });
});

app.post('/chat/room', (req, res) => {
  if (rooms[req.body.room]) return res.redirect('/chat');
  rooms[req.body.room] = { users: {} };
  io.emit('room-created', req.body.room); // Socket.IO integration
  res.redirect(`/chat/${req.body.room}`);
});

app.get('/chat/:room', (req, res) => {
  if (!rooms[req.params.room]) return res.redirect('/chat');
  res.render('chatroom', { roomName: req.params.room });
});

// Single CORS configuration
// In CORS configuration
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Add fallback
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting FIRST
app.use('/api/auth', rateLimit);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/countries', authenticateToken, licenseCheck, countryRoutes);
app.use('/api/chat', authenticateToken, licenseCheck, chatRoutes);

// Database connection check
sequelize.sync()
  .then(() => console.log('✅ Database synchronized'))
  .catch(err => console.error('❌ Database sync error:', err));

// Error handler
app.use((err, req, res, next) => {
  console.error('🚨 Global error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Cron job
cron.schedule('0 * * * *', () => {
  console.log('⏰ Running message purge');
  purgeMessages().catch(console.error);
});

// Socket.IO
initChat(server);
io.on('connection', (socket) => {
  // Original chat server logic
  socket.on('new-user', (room, name) => {
    socket.join(room);
    rooms[room].users[socket.id] = name;
    socket.to(room).emit('user-connected', name);
  });

  socket.on('send-chat-message', (room, message) => {
    socket.to(room).emit('chat-message', { 
      message, 
      name: rooms[room].users[socket.id] 
    });
  });

  socket.on('disconnect', () => {
    getUserRooms(socket).forEach(room => {
      socket.to(room).emit('user-disconnected', rooms[room].users[socket.id]);
      delete rooms[room].users[socket.id];
    });
  });
});

// Helper function from chat server
function getUserRooms(socket) {
  return Object.entries(rooms).reduce((names, [name, room]) => {
    if (room.users[socket.id]) names.push(name);
    return names;
  }, []);
}



// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 CORS allowed origin: ${process.env.CLIENT_URL}`);
});
