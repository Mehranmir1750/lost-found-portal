   // ── Hamburger toggle ──
        function toggleMenu() {
            var menu   = document.getElementById('mobileMenu');
            var burger = document.getElementById('hamburger');
            var isOpen = menu.classList.contains('open');

            if (isOpen) {
                menu.classList.remove('open');
                burger.classList.remove('active');
            } else {
                menu.classList.add('open');
                burger.classList.add('active');
            }
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            var menu   = document.getElementById('mobileMenu');
            var burger = document.getElementById('hamburger');
            if (!menu.contains(e.target) && !burger.contains(e.target)) {
                menu.classList.remove('open');
                burger.classList.remove('active');
            }
        });

        // ── Filter items (Lost / Found / All) ──
        function filterItems(clickedBtn) {
            var filter = clickedBtn.getAttribute('data-filter');

            // update active tab
            var tabs = document.querySelectorAll('.tab');
            for (var i = 0; i < tabs.length; i++) {
                tabs[i].classList.remove('active');
            }
            clickedBtn.classList.add('active');

            // show / hide cards
            var cards = document.querySelectorAll('.item-card');
            for (var j = 0; j < cards.length; j++) {
                var cardType = cards[j].getAttribute('data-type');
                if (filter === 'all' || cardType === filter) {
                    cards[j].style.display = 'flex';
                } else {
                    cards[j].style.display = 'none';
                }
            }
        }