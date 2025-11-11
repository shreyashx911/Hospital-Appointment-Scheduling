// Admin Appointments Management
let allAppointments = [];

// Initialize admin page
document.addEventListener('DOMContentLoaded', async function() {
    await loadAppointments();
    
    // Filter handlers
    document.getElementById('filterStatus').addEventListener('change', filterAppointments);
    document.getElementById('filterHospital').addEventListener('change', filterAppointments);
    document.getElementById('filterDate').addEventListener('change', filterAppointments);
});

async function loadAppointments() {
    const appointmentsList = document.getElementById('appointmentsList');
    appointmentsList.innerHTML = '<p class="info-text">Loading appointments...</p>';

    try {
        if (typeof firebaseAppointments !== 'undefined') {
            allAppointments = await firebaseAppointments.getAllAppointments();
        } else {
            allAppointments = JSON.parse(localStorage.getItem('bookedAppointments')) || [];
        }
        
        displayAppointments(allAppointments);
    } catch (error) {
        console.error('Error loading appointments:', error);
        appointmentsList.innerHTML = '<p class="info-text" style="color: var(--danger-color);">Error loading appointments. Please refresh the page.</p>';
    }
}

function displayAppointments(appointments) {
    const appointmentsList = document.getElementById('appointmentsList');
    
    if (appointments.length === 0) {
        appointmentsList.innerHTML = '<p class="info-text">No appointments found.</p>';
        return;
    }

    appointmentsList.innerHTML = '';

    appointments.forEach(appointment => {
        const appointmentCard = createAppointmentCard(appointment);
        appointmentsList.appendChild(appointmentCard);
    });
}

function createAppointmentCard(appointment) {
    const card = document.createElement('div');
    card.className = 'appointment-card';
    
    const dateObj = new Date(appointment.date);
    const formattedDate = dateObj.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const statusClass = appointment.status || 'confirmed';
    const statusText = (appointment.status || 'confirmed').charAt(0).toUpperCase() + (appointment.status || 'confirmed').slice(1);

    card.innerHTML = `
        <div class="appointment-card-header">
            <div>
                <h3>${appointment.patientName}</h3>
                <span class="appointment-status status-${statusClass}">${statusText}</span>
            </div>
            <div class="appointment-id">ID: ${appointment.id}</div>
        </div>
        <div class="appointment-card-body">
            <div class="appointment-details-grid">
                <div class="appointment-detail">
                    <strong>Hospital:</strong> ${appointment.hospitalName || 'N/A'}
                </div>
                <div class="appointment-detail">
                    <strong>Doctor:</strong> ${appointment.doctorName || 'N/A'}
                </div>
                <div class="appointment-detail">
                    <strong>Condition:</strong> ${appointment.illnessName || 'N/A'}
                </div>
                <div class="appointment-detail">
                    <strong>Date:</strong> ${formattedDate}
                </div>
                <div class="appointment-detail">
                    <strong>Time:</strong> ${appointment.time || 'N/A'}
                </div>
                <div class="appointment-detail">
                    <strong>Email:</strong> ${appointment.patientEmail || 'N/A'}
                </div>
                <div class="appointment-detail">
                    <strong>Phone:</strong> ${appointment.patientPhone || 'N/A'}
                </div>
                <div class="appointment-detail">
                    <strong>Age:</strong> ${appointment.patientAge || 'N/A'}
                </div>
                ${appointment.notes ? `
                <div class="appointment-detail full-width">
                    <strong>Notes:</strong> ${appointment.notes}
                </div>
                ` : ''}
            </div>
            <div class="appointment-actions">
                ${appointment.status !== 'cancelled' ? `
                <button class="btn-secondary btn-small" onclick="cancelAppointment('${appointment.id}')">Cancel</button>
                ` : ''}
                <button class="btn-primary btn-small" onclick="deleteAppointment('${appointment.id}')">Delete</button>
            </div>
        </div>
    `;

    return card;
}

async function cancelAppointment(appointmentId) {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
        return;
    }

    try {
        if (typeof firebaseAppointments !== 'undefined') {
            await firebaseAppointments.updateAppointmentStatus(appointmentId, 'cancelled');
        } else {
            // Update in localStorage
            let appointments = JSON.parse(localStorage.getItem('bookedAppointments')) || [];
            appointments = appointments.map(apt => {
                if (apt.id === appointmentId) {
                    apt.status = 'cancelled';
                }
                return apt;
            });
            localStorage.setItem('bookedAppointments', JSON.stringify(appointments));
        }
        
        await loadAppointments();
        alert('Appointment cancelled successfully');
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('Error cancelling appointment. Please try again.');
    }
}

async function deleteAppointment(appointmentId) {
    if (!confirm('Are you sure you want to delete this appointment? This action cannot be undone.')) {
        return;
    }

    try {
        if (typeof firebaseAppointments !== 'undefined') {
            await firebaseAppointments.deleteAppointment(appointmentId);
        } else {
            // Delete from localStorage
            let appointments = JSON.parse(localStorage.getItem('bookedAppointments')) || [];
            appointments = appointments.filter(apt => apt.id !== appointmentId);
            localStorage.setItem('bookedAppointments', JSON.stringify(appointments));
        }
        
        await loadAppointments();
        alert('Appointment deleted successfully');
    } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Error deleting appointment. Please try again.');
    }
}

function filterAppointments() {
    const statusFilter = document.getElementById('filterStatus').value;
    const hospitalFilter = document.getElementById('filterHospital').value;
    const dateFilter = document.getElementById('filterDate').value;

    let filtered = [...allAppointments];

    if (statusFilter) {
        filtered = filtered.filter(apt => (apt.status || 'confirmed') === statusFilter);
    }

    if (hospitalFilter) {
        filtered = filtered.filter(apt => apt.hospital === hospitalFilter);
    }

    if (dateFilter) {
        filtered = filtered.filter(apt => apt.date === dateFilter);
    }

    displayAppointments(filtered);
}

async function refreshAppointments() {
    await loadAppointments();
}

