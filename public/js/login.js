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
        function togglePassword() {
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

        // Form validation
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const errorMessage = document.getElementById('errorMessage');
            const successMessage = document.getElementById('successMessage');
            
            // Hide previous messages
            errorMessage.classList.remove('show');
            successMessage.classList.remove('show');
            
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
            
            // Or show success message (uncomment when backend is ready)
            // showSuccess('Login successful! Redirecting...');
            // setTimeout(() => {
            //     window.location.href = '/dashboard';
            // }, 1500);
        });
        
        function showError(message) {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = '⚠️ ' + message;
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