// modal.js
function showModal(message) {
    const modal = document.getElementById('notification-modal');
    const modalMessage = document.getElementById('modal-message');

    modalMessage.textContent = message;
    modal.classList.add('show');

    setTimeout(() => {
        modal.classList.remove('show');
    }, 4000); // Hide after 3 seconds
}
