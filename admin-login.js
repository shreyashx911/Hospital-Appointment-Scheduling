// Admin Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('adminLoginForm');
    const errorMessage = document.getElementById('errorMessage');
    
    // Admin credentials
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'pass@123';
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Hide previous error messages
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
        
        // Validate credentials
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // Successful login - redirect to admin appointments page
            window.location.href = 'admin-appointments.html';
        } else {
            // Show error message
            errorMessage.textContent = 'Invalid username or password. Please try again.';
            errorMessage.style.display = 'block';
            
            // Clear password field
            document.getElementById('password').value = '';
            
            // Add shake animation to form
            loginForm.style.animation = 'shake 0.5s';
            setTimeout(() => {
                loginForm.style.animation = '';
            }, 500);
        }
    });
});

// Add shake animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    
    .error-message {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 20px;
        border: 1px solid rgba(239, 68, 68, 0.3);
        font-size: 0.95rem;
    }
    
    [data-theme="dark"] .error-message {
        background: rgba(239, 68, 68, 0.2);
        border-color: rgba(239, 68, 68, 0.4);
    }
`;
document.head.appendChild(style);

