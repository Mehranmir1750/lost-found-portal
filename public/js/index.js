document.addEventListener('DOMContentLoaded', function () {

    var burger   = document.getElementById('hamburger');
    var dropdown = document.getElementById('mobileDropdown');

    // ── Hamburger toggle ──
    if (burger && dropdown) {
        burger.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = dropdown.classList.contains('open');
            if (isOpen) {
                dropdown.classList.remove('open');
                burger.classList.remove('active');
            } else {
                dropdown.classList.add('open');
                burger.classList.add('active');
            }
        });

        // Close when clicking anywhere outside
        document.addEventListener('click', function (e) {
            if (!dropdown.contains(e.target) && !burger.contains(e.target)) {
                dropdown.classList.remove('open');
                burger.classList.remove('active');
            }
        });
    }

    // ── Filter tabs ──
    var tabs = document.querySelectorAll('.tab');
    tabs.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var filter = this.getAttribute('data-filter');

            // update active state
            tabs.forEach(function (t) { t.classList.remove('active'); });
            btn.classList.add('active');

            // show / hide cards
            var cards = document.querySelectorAll('.item-card');
            cards.forEach(function (card) {
                var type = card.getAttribute('data-type');
                card.style.display = (filter === 'all' || type === filter) ? 'flex' : 'none';
            });
        });
    });

});