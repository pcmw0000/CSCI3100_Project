// ==========================================
// Frontend Authentication Logic
// ==========================================

// 1. Login/Registration Form Handler
document.getElementById('auth-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Extract form data
  const formData = {
    username: e.target.username.value,
    password: e.target.password.value,
    licenseKey: e.target.licenseKey.value,
    role: e.target.role.value
  };

  try {
    // 2. Call Backend API
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    // 3. Handle Response
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('jwt', data.token); // Store JWT
      window.location.href = '/chat'; // Redirect to chat
    } else {
      alert(data.error || 'Authentication failed');
    }
  } catch (error) {
    console.error('Auth error:', error);
    alert('Network error - try again later');
  }
});