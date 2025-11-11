// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('contactSuccess');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const contactData = {
            name: formData.get('contactName'),
            email: formData.get('contactEmail'),
            phone: formData.get('contactPhone'),
            subject: formData.get('contactSubject'),
            message: formData.get('contactMessage'),
            timestamp: new Date().toISOString()
        };

        // Save to localStorage (in a real app, this would be sent to a server)
        let contacts = JSON.parse(localStorage.getItem('contactMessages')) || [];
        contacts.push(contactData);
        localStorage.setItem('contactMessages', JSON.stringify(contacts));

        // Show success message
        contactForm.style.display = 'none';
        successMessage.style.display = 'block';

        // Reset form after 3 seconds
        setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = 'block';
            successMessage.style.display = 'none';
        }, 5000);
    });
});

