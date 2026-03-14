  // ─── Toast ───
    function showToast(msg, icon = '✔️') {
        document.getElementById('toastMsg').textContent  = msg;
        document.getElementById('toastIcon').textContent = icon;
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2800);
    }

    // ─── Delete modal ───
    function openDeleteModal()  { document.getElementById('deleteModal').classList.add('active'); }
    function closeDeleteModal() { document.getElementById('deleteModal').classList.remove('active'); }

    document.getElementById('deleteModal').addEventListener('click', function(e) {
        if (e.target === this) closeDeleteModal();
    });

    function confirmDelete() {
        closeDeleteModal();
        fetch('/items/<%= item.id %>', {
            method: 'DELETE',
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then(res => {
            if (res.ok) {
                showToast('Listing deleted', '🗑️');
                setTimeout(() => window.location.href = '/dashboard', 1600);
            } else {
                showToast('Failed. Try again.', '⚠️');
            }
        })
        .catch(() => showToast('Something went wrong.', '⚠️'));
    }

    // ─── Close item ───
    function closeItem() {
        fetch('/items/<%= item.id %>/close', {
            method: 'POST',
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then(res => {
            if (res.ok) {
                showToast('Marked as Closed', '✔️');
                setTimeout(() => location.reload(), 1600);
            } else {
                showToast('Failed. Try again.', '⚠️');
            }
        })
        .catch(() => showToast('Something went wrong.', '⚠️'));
    }

    // ─── Report ───
    function reportItem() {
        showToast('Report submitted for review', '⚑');
    }



    function sendClaimRequest() {
    const message = document.getElementById("claimMessage").value.trim();

    if (!message) {
      showToast("Please add a short explanation", "⚠️");
      return;
    }

    fetch("/items/<%= item.id %>/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "message=" + encodeURIComponent(message)
    })
    .then(res => {
      if (res.ok) {
        showToast("Request sent to the owner", "✔️");
        document.getElementById("claimMessage").value = "";
      } else {
        showToast("Failed to send request", "⚠️");
      }
    })
    .catch(() => showToast("Server error", "⚠️"));
  }