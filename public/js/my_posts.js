  // Toggle inline edit form
        function toggleEdit(id) {
            const form = document.getElementById('edit-' + id);
            form.style.display = form.style.display === 'block' ? 'none' : 'block';
        }

        // Filter posts by type or status
        function filterPosts(filter) {
            const cards = document.querySelectorAll('.post-card');
            const tabs = document.querySelectorAll('.filter-tab');

            tabs.forEach(t => t.classList.remove('active'));
            event.target.classList.add('active');

            cards.forEach(card => {
                const type   = card.dataset.type;
                const status = card.dataset.status;

                if (filter === 'all')    card.style.display = 'flex';
                else if (filter === 'lost')   card.style.display = type === 'lost'     ? 'flex' : 'none';
                else if (filter === 'found')  card.style.display = type === 'found'    ? 'flex' : 'none';
                else if (filter === 'active') card.style.display = status === 'active' ? 'flex' : 'none';
                else if (filter === 'closed') card.style.display = status === 'closed' ? 'flex' : 'none';
            });
        }

        // Sort posts
        function sortPosts(value) {
            const grid  = document.querySelector('.posts-grid');
            const cards = Array.from(document.querySelectorAll('.post-card'));

            cards.sort((a, b) => {
                const dateA = new Date(a.querySelector('.post-date').textContent.replace('Posted on ', ''));
                const dateB = new Date(b.querySelector('.post-date').textContent.replace('Posted on ', ''));
                if (value === 'newest') return dateB - dateA;
                if (value === 'oldest') return dateA - dateB;
                return 0;
            });

            cards.forEach(card => grid.appendChild(card));
        }