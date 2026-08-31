document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor hash links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElem = document.querySelector(targetId);
                if (targetElem) {
                    e.preventDefault();
                    targetElem.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Modal management
    const modal8Page = document.getElementById('modal-8-page');
    const openInstructionsLink = document.getElementById('open-instructions-link');
    const openInstructionsBtn = document.getElementById('open-instructions-btn');

    function openModal() {
        if (modal8Page) modal8Page.style.display = 'block';
    }

    function closeModal() {
        if (modal8Page) modal8Page.style.display = 'none';
    }

    if (openInstructionsLink) {
        openInstructionsLink.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    if (openInstructionsBtn) {
        openInstructionsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    document.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal();
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
});
