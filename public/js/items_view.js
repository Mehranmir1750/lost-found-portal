// Read item ID from data attribute — avoids inline script CSP issue
var ITEM_ID = document.getElementById('itemData').getAttribute('data-item-id');

// ─── Toast ───
function showToast(msg, icon) {
    icon = icon || '✔️';
    document.getElementById('toastMsg').textContent  = msg;
    document.getElementById('toastIcon').textContent = icon;
    var toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, 2800);
}

// ─── Delete modal ───
function openDeleteModal()  { document.getElementById('deleteModal').classList.add('active'); }
function closeDeleteModal() { document.getElementById('deleteModal').classList.remove('active'); }

document.getElementById('deleteModal').addEventListener('click', function(e) {
    if (e.target === this) closeDeleteModal();
});

function confirmDelete() {
    closeDeleteModal();
    fetch('/items/' + ITEM_ID + '/delete', {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
    .then(function(res) {
        if (res.ok) {
            showToast('Listing deleted', '🗑️');
            setTimeout(function() { window.location.href = '/my-posts'; }, 1600);
        } else {
            showToast('Failed. Try again.', '⚠️');
        }
    })
    .catch(function() { showToast('Something went wrong.', '⚠️'); });
}

// ─── Close item ───
function closeItem() {
    fetch('/items/' + ITEM_ID + '/close', {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
    .then(function(res) {
        if (res.ok) {
            showToast('Marked as Closed', '✔️');
            setTimeout(function() { location.reload(); }, 1600);
        } else {
            showToast('Failed. Try again.', '⚠️');
        }
    })
    .catch(function() { showToast('Something went wrong.', '⚠️'); });
}

// ─── Report ───
function reportItem() {
    showToast('Report submitted for review', '⚑');
}

// ─── Send claim request ───
function sendClaimRequest() {
    var message = document.getElementById('claimMessage').value.trim();

    if (!message) {
        showToast('Please add a short explanation', '⚠️');
        return;
    }

    fetch('/items/' + ITEM_ID + '/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'message=' + encodeURIComponent(message)
    })
    .then(function(res) {
        if (res.ok) {
            showToast('Request sent to the owner', '✔️');
            document.getElementById('claimMessage').value = '';
        } else if (res.status === 400) {
            showToast('You already sent a request for this item', '⚠️');
        } else {
            showToast('Failed to send request', '⚠️');
        }
    })
    .catch(function() { showToast('Server error', '⚠️'); });
}