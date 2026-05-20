import { auth, provider } from "./firebase.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Password toggle (Attached to window because this is a module script)
window.togglePassword = function() {
    const field = document.getElementById('password');
    const toggle = event.target;
    
    if (field.type === 'password') {
        field.type = 'text';
        toggle.textContent = '🙈';
    } else {
        field.type = 'password';
        toggle.textContent = '👁️';
    }
}

// Form validation (Traditional Email/Password Form)
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    
    // Hide previous messages
    errorMessage.classList.remove('show');
    successMessage.classList.remove('show');
    errorMessage.style.display = 'none';
    
    // Validation
    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return;
    }
    
    // If all validations pass, submit the form
    this.submit();
});

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = '⚠️ ' + message;
    errorMessage.style.display = 'block';
    errorMessage.classList.add('show');
}

function showSuccess(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = '✓ ' + message;
    successMessage.classList.add('show');
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Google Login Authentication Handling
const googleBtn = document.getElementById("google-login");

googleBtn.addEventListener("click", async () => {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.classList.remove('show');
    errorMessage.style.display = 'none';

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        console.log(user);

        const response = await fetch("/google-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // body: JSON.stringify({
            //     name: user.displayName,
            //     email: user.email
            // })

            body: JSON.stringify({

    google_id: user.uid,

    name: user.displayName,

    email: user.email

})

        });


        const data = await response.json();

        if (data.success) {
            window.location.href = "/login_dashboard";
        } else {
            showError(data.message || "Backend login verification failed.");
        }

    } catch (error) {
        console.error("Auth Error details:", error);

        // Check specifically for user closing the popup window
        if (error.code === 'auth/popup-closed-by-user') {
            showError("Sign-in window was closed before completion. Please try again.");
        } else if (error.code === 'auth/cancelled-popup-request') {
            showError("Sign-in request was cancelled. Only open one login tab at a time.");
        } else {
            showError(error.message);
        }
    }
});

// Initialize features on load
createParticles();
