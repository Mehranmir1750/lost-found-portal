  // Create floating particles
        function createParticles() {
            const particlesContainer = document.getElementById('particles');
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Password toggle
        function togglePassword(fieldId, toggle) {
    const field = document.getElementById(fieldId);

    if (field.type === "password") {
        field.type = "text";
        toggle.textContent = "🙈";
    } else {
        field.type = "password";
        toggle.textContent = "👁️";
    }
}

        // Password strength checker
        const passwordInput = document.getElementById('password');
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');

        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;

            if (password.length >= 6) strength += 25;
            if (password.length >= 10) strength += 25;
            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
            if (/[0-9]/.test(password)) strength += 15;
            if (/[^a-zA-Z0-9]/.test(password)) strength += 10;

            strengthBar.style.width = strength + '%';

            if (strength < 40) {
                strengthBar.style.background = '#f5a5a5';
                strengthText.textContent = 'Weak password';
                strengthText.style.color = '#d94f4f';
            } else if (strength < 70) {
                strengthBar.style.background = '#f5d87a';
                strengthText.textContent = 'Medium password';
                strengthText.style.color = '#b8962e';
            } else {
                strengthBar.style.background = '#7dd9a8';
                strengthText.textContent = 'Strong password';
                strengthText.style.color = '#2e9e66';
            }
        });

        // Form validation
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const first_name = document.getElementById('first_name').value;
            const last_name = document.getElementById('last_name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;

            const errorMessage = document.getElementById('errorMessage');
            const successMessage = document.getElementById('successMessage');

            errorMessage.classList.remove('show');
            successMessage.classList.remove('show');

            if (first_name.trim().length < 2) { showError('First name must be at least 2 characters long'); return; }
            if (last_name.trim().length < 2) { showError('Last name must be at least 2 characters long'); return; }
            if (!isValidEmail(email)) { showError('Please enter a valid email address'); return; }
            if (phone.trim().length < 10) { showError('Please enter a valid phone number'); return; }
            if (password.length < 6) { showError('Password must be at least 6 characters long'); return; }
            if (password !== confirmPassword) { showError('Passwords do not match'); return; }
            if (!terms) { showError('Please accept the terms and conditions'); return; }

            this.submit();
        });

        function showError(message) {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = '⚠️ ' + message;
            errorMessage.classList.add('show');
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        function showSuccess(message) {
            const successMessage = document.getElementById('successMessage');
            successMessage.textContent = '✓ ' + message;
            successMessage.classList.add('show');
        }

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }

        createParticles();

        function toggleMenu() {
            document.getElementById('navLinks').classList.toggle('open');
        }