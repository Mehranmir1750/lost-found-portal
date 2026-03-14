 // Filter notifications
  function filterNotifications(type) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notif => {
      if (type === 'all') {
        notif.style.display = 'block';
      } else if (type === 'unread') {
        notif.style.display = notif.classList.contains('unread') ? 'block' : 'none';
      } else {
        notif.style.display = notif.dataset.type === type ? 'block' : 'none';
      }
    });
  }

  // Mark all as read
  function markAllRead() {
    const notifications = document.querySelectorAll('.notification.unread');
    notifications.forEach(notif => {
      notif.classList.remove('unread');
    });
    
    // You would also make an API call here to update the backend
    console.log('Marked all notifications as read');
  }

  // Dismiss notification
  function dismissNotification(button) {
    const notification = button.closest('.notification');
    notification.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      notification.remove();
    }, 300);
    
    // You would also make an API call here to delete/dismiss the notification
    console.log('Dismissed notification');
  }

  // Add fade out animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeOut {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(20px);
      }
    }
  `;
  document.head.appendChild(style);

  // Mark notification as read when clicked
  document.addEventListener('DOMContentLoaded', () => {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notif => {
      notif.addEventListener('click', function(e) {
        // Don't mark as read if clicking a button
        if (!e.target.classList.contains('btn')) {
          this.classList.remove('unread');
          // You would also make an API call here
        }
      });
    });
  });