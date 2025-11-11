// Doctor data based on hospitals - derived from doctorsData
const hospitalDoctors = {
    'city-general': [
        { id: 'dr-smith', name: 'Dr. Sarah Smith', specialties: ['general-checkup', 'cardiology'] },
        { id: 'dr-johnson', name: 'Dr. Michael Johnson', specialties: ['orthopedics', 'general-checkup'] },
        { id: 'dr-williams', name: 'Dr. Emily Williams', specialties: ['pediatrics', 'general-checkup'] },
        { id: 'dr-brown', name: 'Dr. David Brown', specialties: ['dermatology'] }
    ],
    'metro-medical': [
        { id: 'dr-davis', name: 'Dr. Jennifer Davis', specialties: ['cardiology', 'general-checkup'] },
        { id: 'dr-miller', name: 'Dr. Robert Miller', specialties: ['neurology', 'psychiatry'] },
        { id: 'dr-wilson', name: 'Dr. Lisa Wilson', specialties: ['gastroenterology', 'general-checkup'] },
        { id: 'dr-moore', name: 'Dr. James Moore', specialties: ['ophthalmology'] }
    ],
    'community-health': [
        { id: 'dr-taylor', name: 'Dr. Patricia Taylor', specialties: ['general-checkup', 'pediatrics'] },
        { id: 'dr-anderson', name: 'Dr. Mark Anderson', specialties: ['orthopedics', 'general-checkup'] },
        { id: 'dr-thomas', name: 'Dr. Susan Thomas', specialties: ['dermatology', 'general-checkup'] }
    ],
    'university-hospital': [
        { id: 'dr-jackson', name: 'Dr. Christopher Jackson', specialties: ['cardiology', 'neurology'] },
        { id: 'dr-white', name: 'Dr. Amanda White', specialties: ['pediatrics', 'general-checkup'] },
        { id: 'dr-harris', name: 'Dr. Daniel Harris', specialties: ['orthopedics', 'emergency'] },
        { id: 'dr-martin', name: 'Dr. Michelle Martin', specialties: ['gastroenterology', 'general-checkup'] },
        { id: 'dr-thompson', name: 'Dr. Kevin Thompson', specialties: ['psychiatry', 'neurology'] }
    ],
    'regional-medical': [
        { id: 'dr-garcia', name: 'Dr. Maria Garcia', specialties: ['general-checkup', 'cardiology'] },
        { id: 'dr-martinez', name: 'Dr. Carlos Martinez', specialties: ['orthopedics', 'emergency'] },
        { id: 'dr-robinson', name: 'Dr. Linda Robinson', specialties: ['pediatrics', 'general-checkup'] },
        { id: 'dr-clark', name: 'Dr. Steven Clark', specialties: ['ophthalmology', 'general-checkup'] }
    ]
};

// Available time slots
const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

// Store booked appointments - will use Firebase if available, otherwise localStorage
let bookedAppointments = JSON.parse(localStorage.getItem('bookedAppointments')) || [];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    // Hospital change handler
    const hospitalSelect = document.getElementById('hospital');
    hospitalSelect.addEventListener('change', handleHospitalChange);

    // Illness change handler
    const illnessSelect = document.getElementById('illness');
    illnessSelect.addEventListener('change', handleIllnessChange);

    // Date change handler
    dateInput.addEventListener('change', handleDateChange);

    // Form submission handler
    const form = document.getElementById('appointmentForm');
    form.addEventListener('submit', handleFormSubmit);

    // Modal close handlers
    const modal = document.getElementById('appointmentModal');
    const closeBtn = document.querySelector('.close');
    const bookAnotherBtn = document.getElementById('bookAnotherBtn');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    bookAnotherBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        form.reset();
        resetForm();
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

function handleHospitalChange() {
    const hospitalSelect = document.getElementById('hospital');
    const doctorSelect = document.getElementById('doctor');
    const selectedHospital = hospitalSelect.value;

    // Reset doctor selection
    doctorSelect.innerHTML = '<option value="">First select a hospital...</option>';
    doctorSelect.disabled = !selectedHospital;

    if (selectedHospital) {
        const doctors = hospitalDoctors[selectedHospital] || [];
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = doctor.name;
            doctorSelect.appendChild(option);
        });
    }

    // Update time slots if date is selected
    const dateInput = document.getElementById('date');
    if (dateInput.value) {
        handleDateChange(); // This is now async but we don't need to await it
    }
}

function handleIllnessChange() {
    const hospitalSelect = document.getElementById('hospital');
    const doctorSelect = document.getElementById('doctor');
    const illnessSelect = document.getElementById('illness');
    
    const selectedHospital = hospitalSelect.value;
    const selectedIllness = illnessSelect.value;

    if (!selectedHospital || !selectedIllness) {
        return;
    }

    // Filter doctors based on illness/specialty
    const doctors = hospitalDoctors[selectedHospital] || [];
    const filteredDoctors = doctors.filter(doctor => 
        doctor.specialties.includes(selectedIllness)
    );

    // Update doctor dropdown
    doctorSelect.innerHTML = '<option value="">Select a doctor...</option>';
    
    if (filteredDoctors.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No doctors available for this condition';
        doctorSelect.appendChild(option);
        doctorSelect.disabled = true;
    } else {
        filteredDoctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = doctor.name;
            doctorSelect.appendChild(option);
        });
        doctorSelect.disabled = false;
    }
}

async function handleDateChange() {
    const dateInput = document.getElementById('date');
    const selectedDate = dateInput.value;
    const timeSlotsContainer = document.getElementById('timeSlots');

    if (!selectedDate) {
        timeSlotsContainer.innerHTML = '<p class="info-text">Please select a date to see available time slots</p>';
        return;
    }

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(selectedDate);
    
    if (selected < today) {
        timeSlotsContainer.innerHTML = '<p class="info-text" style="color: var(--danger-color);">Please select a future date</p>';
        return;
    }

    // Get booked slots for this date, hospital, and doctor
    const hospitalSelect = document.getElementById('hospital');
    const doctorSelect = document.getElementById('doctor');
    const selectedHospital = hospitalSelect.value;
    const selectedDoctor = doctorSelect.value;

    // Show loading state
    timeSlotsContainer.innerHTML = '<p class="info-text">Loading available slots...</p>';

    const bookedSlots = await getBookedSlots(selectedDate, selectedHospital, selectedDoctor);

    // Generate time slot buttons
    timeSlotsContainer.innerHTML = '';
    
    if (timeSlots.length === 0) {
        timeSlotsContainer.innerHTML = '<p class="info-text">No time slots available</p>';
        return;
    }

    timeSlots.forEach(slot => {
        const isBooked = bookedSlots.includes(slot);
        const slotButton = document.createElement('button');
        slotButton.type = 'button';
        slotButton.className = `time-slot ${isBooked ? 'disabled' : ''}`;
        slotButton.textContent = slot;
        slotButton.dataset.time = slot;
        
        if (!isBooked) {
            slotButton.addEventListener('click', () => selectTimeSlot(slotButton));
        }

        timeSlotsContainer.appendChild(slotButton);
    });
}

function selectTimeSlot(button) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Add selection to clicked button
    button.classList.add('selected');
    
    // Store selected time in a hidden input or data attribute
    const form = document.getElementById('appointmentForm');
    if (!form.querySelector('input[name="selectedTime"]')) {
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'selectedTime';
        form.appendChild(hiddenInput);
    }
    form.querySelector('input[name="selectedTime"]').value = button.dataset.time;
}

async function getBookedSlots(date, hospital, doctor) {
    // Use Firebase if available, otherwise use localStorage
    if (typeof firebaseAppointments !== 'undefined') {
        return await firebaseAppointments.getBookedSlots(date, hospital, doctor);
    }
    
    return bookedAppointments
        .filter(apt => 
            apt.date === date && 
            apt.hospital === hospital && 
            apt.doctor === doctor &&
            apt.status !== 'cancelled'
        )
        .map(apt => apt.time);
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    
    // Get selected time slot
    const selectedTimeButton = document.querySelector('.time-slot.selected');
    if (!selectedTimeButton) {
        alert('Please select a time slot');
        return;
    }

    const selectedTime = selectedTimeButton.dataset.time;

    // Validate all required fields
    const hospital = formData.get('hospital');
    const doctor = formData.get('doctor');
    const illness = formData.get('illness');
    const date = formData.get('date');
    const patientName = formData.get('patientName');
    const patientEmail = formData.get('patientEmail');
    const patientPhone = formData.get('patientPhone');
    const patientAge = formData.get('patientAge');

    if (!hospital || !doctor || !illness || !date || !patientName || !patientEmail || !patientPhone || !patientAge) {
        alert('Please fill in all required fields');
        return;
    }

    // Check if slot is still available
    const bookedSlots = await getBookedSlots(date, hospital, doctor);
    if (bookedSlots.includes(selectedTime)) {
        alert('This time slot has been booked. Please select another time.');
        handleDateChange(); // Refresh time slots
        return;
    }

    // Create appointment object
    const appointment = {
        id: Date.now().toString(),
        hospital: hospital,
        doctor: doctor,
        doctorName: document.getElementById('doctor').selectedOptions[0].textContent,
        hospitalName: document.getElementById('hospital').selectedOptions[0].textContent,
        illness: illness,
        illnessName: document.getElementById('illness').selectedOptions[0].textContent,
        date: date,
        time: selectedTime,
        patientName: patientName,
        patientEmail: patientEmail,
        patientPhone: patientPhone,
        patientAge: patientAge,
        notes: formData.get('notes') || '',
        createdAt: new Date().toISOString(),
        status: 'confirmed'
    };

    // Disable submit button and show loading
    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    // Save appointment to Firebase or localStorage
    if (typeof firebaseAppointments !== 'undefined') {
        try {
            const result = await firebaseAppointments.saveAppointment(appointment);
            if (result.success) {
                // Update appointment ID if Firebase generated one
                if (result.id) {
                    appointment.id = result.id;
                }
                // Also save to localStorage as backup
                bookedAppointments.push(appointment);
                localStorage.setItem('bookedAppointments', JSON.stringify(bookedAppointments));
                
                // Show confirmation modal
                showAppointmentSummary(appointment);
            } else {
                alert('Error saving appointment. Please try again.');
            }
        } catch (error) {
            console.error('Error saving appointment:', error);
            alert('Error saving appointment. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    } else {
        // Fallback to localStorage
        bookedAppointments.push(appointment);
        localStorage.setItem('bookedAppointments', JSON.stringify(bookedAppointments));
        showAppointmentSummary(appointment);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
}

function showAppointmentSummary(appointment) {
    const modal = document.getElementById('appointmentModal');
    const summaryDiv = document.getElementById('appointmentSummary');

    // Format date for display
    const dateObj = new Date(appointment.date);
    const formattedDate = dateObj.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    summaryDiv.innerHTML = `
        <div class="summary-item">
            <span class="summary-label">Appointment ID:</span>
            <span class="summary-value">${appointment.id}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Hospital:</span>
            <span class="summary-value">${appointment.hospitalName}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Doctor:</span>
            <span class="summary-value">${appointment.doctorName}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Condition:</span>
            <span class="summary-value">${appointment.illnessName}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Date:</span>
            <span class="summary-value">${formattedDate}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Time:</span>
            <span class="summary-value">${appointment.time}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Patient Name:</span>
            <span class="summary-value">${appointment.patientName}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Email:</span>
            <span class="summary-value">${appointment.patientEmail}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Phone:</span>
            <span class="summary-value">${appointment.patientPhone}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Age:</span>
            <span class="summary-value">${appointment.patientAge}</span>
        </div>
        ${appointment.notes ? `
        <div class="summary-item">
            <span class="summary-label">Notes:</span>
            <span class="summary-value">${appointment.notes}</span>
        </div>
        ` : ''}
    `;

    modal.classList.add('show');
}

function resetForm() {
    const doctorSelect = document.getElementById('doctor');
    doctorSelect.innerHTML = '<option value="">First select a hospital...</option>';
    doctorSelect.disabled = true;

    const timeSlotsContainer = document.getElementById('timeSlots');
    timeSlotsContainer.innerHTML = '<p class="info-text">Please select a date to see available time slots</p>';

    // Remove hidden time input if exists
    const hiddenTimeInput = document.querySelector('input[name="selectedTime"]');
    if (hiddenTimeInput) {
        hiddenTimeInput.remove();
    }
}

