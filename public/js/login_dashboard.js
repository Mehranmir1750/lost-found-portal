 let currentView = 'all';
        let currentFilter = 'all';

        function initializePage() {
            document.getElementById('userName').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
            document.getElementById('welcomeMsg').textContent = `Welcome back, ${currentUser.firstName} ${currentUser.lastName}! 👋`;
            renderItems();
        }


function filterItems(filter){

    const cards = document.querySelectorAll('.item-card');
    const buttons = document.querySelectorAll('.filter-btn');

    // remove active class
    buttons.forEach(btn => btn.classList.remove('active'));

    // add active class to clicked button
    event.target.classList.add('active');

    cards.forEach(card=>{
        const type = card.dataset.type;
        const status = card.dataset.status;

        if (filter === "all") {
            card.style.display = "block";
        }

        else if (filter === "lost") {
            card.style.display = type === "lost" ? "block" : "none";
        }

        else if (filter === "found") {
            card.style.display = type === "found" ? "block" : "none";
        }

        else if (filter === "Open") {
            card.style.display = status === "Open" ? "block" : "none";
        }

        else if (filter === "closed") {
            card.style.display = status === "closed" ? "block" : "none";
        }
    })
}

        
        initializePage();
