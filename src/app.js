const express = require('express');
const http = require('http');
const cors = require('cors');
const cron = require('node-cron');
const sequelize = require('./config/database'); // Add this
const initChat = require('./routes/chatSocket');
const authRoutes = require('./routes/auth');
const countryRoutes = require('./routes/countries');
const chatRoutes = require('./routes/chat');
const purgeMessages = require('./cron/purgeMessages');
const rateLimit = require('./middlewares/rateLimit');

const app = express();
const server = http.createServer(app);

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
app.use('/api/countries', countryRoutes);
app.use('/api/chat', chatRoutes);

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

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 CORS allowed origin: ${process.env.CLIENT_URL}`);
});
