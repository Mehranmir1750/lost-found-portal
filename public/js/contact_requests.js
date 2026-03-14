 // Calculate and display stats
        function updateStats() {
            const cards = document.querySelectorAll('.request-card');
            const total = cards.length;
            let pending = 0, approved = 0, rejected = 0;

            cards.forEach(card => {
                const status = card.dataset.status;
                if (status === 'pending') pending++;
                else if (status === 'approved') approved++;
                else if (status === 'rejected') rejected++;
            });

            document.getElementById('totalRequests').textContent = total;
            document.getElementById('pendingRequests').textContent = pending;
            document.getElementById('approvedRequests').textContent = approved;
            document.getElementById('rejectedRequests').textContent = rejected;
        }

        // Filter requests
        function filterRequests(status) {
            // Update active tab
            document.querySelectorAll('.filter-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');

            // Filter cards
            const cards = document.querySelectorAll('.request-card');
            cards.forEach(card => {
                if (status === 'all' || card.dataset.status === status) {
                    card.style.display = 'block';
                    // Trigger re-animation
                    card.style.animation = 'none';
                    setTimeout(() => {
                        card.style.animation = 'fadeInUp 0.5s ease-out';
                    }, 10);
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Show toast notification
        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = `toast ${type} show`;
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // Approve request
        async function approveRequest(id, button) {
            const card = button.closest('.request-card');
            const buttons = card.querySelectorAll('.btn');
            
            // Disable buttons and show loading
            buttons.forEach(btn => {
                btn.disabled = true;
                if (btn === button) {
                    btn.innerHTML = '<span class="loading"></span>';
                }
            });

            try {
                const response = await fetch(`/contact-requests/${id}/approve`, { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    showToast('Request approved! Contact information is now visible.', 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    throw new Error('Failed to approve request');
                }
            } catch (error) {
                showToast('Failed to approve request. Please try again.', 'error');
                buttons.forEach(btn => btn.disabled = false);
                button.innerHTML = '<span>✓</span><span>Approve</span>';
            }
        }

        // Reject request
        async function rejectRequest(id, button) {
            const card = button.closest('.request-card');
            const buttons = card.querySelectorAll('.btn');
            
            // Disable buttons and show loading
            buttons.forEach(btn => {
                btn.disabled = true;
                if (btn === button) {
                    btn.innerHTML = '<span class="loading"></span>';
                }
            });

            try {
                const response = await fetch(`/contact-requests/${id}/reject`, { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    showToast('Request rejected.', 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    throw new Error('Failed to reject request');
                }
            } catch (error) {
                showToast('Failed to reject request. Please try again.', 'error');
                buttons.forEach(btn => btn.disabled = false);
                button.innerHTML = '<span>✗</span><span>Reject</span>';
            }
        }

        // Initialize stats on page load
        document.addEventListener('DOMContentLoaded', () => {
            updateStats();
        });