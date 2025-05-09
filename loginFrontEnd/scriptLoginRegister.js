const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');

registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
});

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            alert('Login successful!');
            window.location.href = 'worldmap.html'; // Redirect to worldmap.html
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Login error:', error);
    }
});

// Handle registration form submission
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const username = document.getElementById('registerUsername').value; 
    const password = document.getElementById('registerPassword').value; 
    const confirmPassword = document.getElementById('confirmPassword').value;
    const countryid = document.getElementById('countryId').value; 
    const role = document.getElementById('role').value; 

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, countryid, role })
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please log in.');
            wrapper.classList.remove('active'); // Switch to login form
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Registration error:', error);
    }
});
