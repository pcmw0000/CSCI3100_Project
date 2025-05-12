// Connect to backend WebSocket (using environment variables)
const socket = io({
  path: "/socket.io",
  auth: {
    token: jwtToken // JWT injected from EJS
  }
});

// Message sending logic (integrated with backend API)
document.getElementById('message-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const content = document.getElementById('message-input').value.trim();
  
  if (!content) {
    alert("Message cannot be empty!");
    return;
  }

  try {
    // Call backend API to send message
    const response = await fetch('/api/chat/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify({ content })
    });
    
    if (!response.ok) throw new Error('Message rejected');
    document.getElementById('message-input').value = '';
  } catch (error) {
    console.error('Send message failed:', error);
    alert("Message blocked: License validation failed");
  }
});

// Real-time message reception (via WebSocket)
socket.on('message', (message) => {
  appendMessage(message);
});

// Load historical messages (via REST API)
window.addEventListener('load', async () => {
  try {
    const response = await fetch('/api/chat/messages', {
      headers: { 'Authorization': `Bearer ${jwtToken}` }
    });
    const messages = await response.json();
    messages.forEach(appendMessage);
  } catch (error) {
    console.error('Failed to load messages:', error);
  }
});

function appendMessage({ content, username, createdAt }) {
  const div = document.createElement('div');
  div.innerHTML = `
    <span class="username">${username}</span>
    <span class="timestamp">[${new Date(createdAt).toLocaleTimeString()}]:</span>
    <span class="content">${content}</span>
  `;
  document.getElementById('message-container').appendChild(div);
}