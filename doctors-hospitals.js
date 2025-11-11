// Load and display hospitals and doctors
document.addEventListener('DOMContentLoaded', function() {
    // Check for specialty parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const specialtyParam = urlParams.get('specialty');

    loadHospitals(specialtyParam);
    loadDoctors();

    // Filter handlers
    const hospitalFilter = document.getElementById('hospitalFilter');
    const specialtyFilter = document.getElementById('specialtyFilter');

    // Set specialty filter if parameter exists
    if (specialtyParam) {
        specialtyFilter.value = specialtyParam;
        // Scroll to doctors section after page loads
        setTimeout(() => {
            const doctorsSection = document.querySelectorAll('.section')[1];
            if (doctorsSection) {
                doctorsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 300);
    }

    hospitalFilter.addEventListener('change', filterDoctors);
    specialtyFilter.addEventListener('change', filterDoctors);

    // Apply initial filter if specialty parameter exists
    if (specialtyParam) {
        filterDoctors();
        filterHospitals(specialtyParam);
    }
});

function loadHospitals(specialtyFilter = null) {
    const container = document.getElementById('hospitalsContainer');
    container.innerHTML = '';

    Object.keys(hospitalsData).forEach(hospitalId => {
        const hospital = hospitalsData[hospitalId];
        
        // Filter hospitals by specialty if provided
        if (specialtyFilter) {
            const specialtyMatch = hospital.specialties.some(spec => {
                const normalizedSpec = spec.toLowerCase().replace(/\s+/g, '-');
                const normalizedFilter = specialtyFilter.toLowerCase();
                // Handle "General Medicine" -> "general-checkup" mapping
                if (normalizedSpec === 'general-medicine' && normalizedFilter === 'general-checkup') {
                    return true;
                }
                return normalizedSpec === normalizedFilter;
            });
            if (!specialtyMatch) {
                return; // Skip this hospital if it doesn't offer the specialty
            }
        }
        
        const hospitalCard = createHospitalCard(hospital, hospitalId);
        container.appendChild(hospitalCard);
    });
}

function filterHospitals(specialtyFilter) {
    const hospitalCards = document.querySelectorAll('.hospital-card');
    
    hospitalCards.forEach(card => {
        const hospitalId = card.dataset.hospitalId;
        if (!hospitalId) return;
        
        const hospital = hospitalsData[hospitalId];
        if (!hospital) return;
        
        const specialtyMatch = hospital.specialties.some(spec => {
            const normalizedSpec = spec.toLowerCase().replace(/\s+/g, '-');
            const normalizedFilter = specialtyFilter.toLowerCase();
            // Handle "General Medicine" -> "general-checkup" mapping
            if (normalizedSpec === 'general-medicine' && normalizedFilter === 'general-checkup') {
                return true;
            }
            return normalizedSpec === normalizedFilter;
        });
        
        card.style.display = specialtyMatch ? 'block' : 'none';
    });
}

function createHospitalCard(hospital, hospitalId) {
    const card = document.createElement('div');
    card.className = 'hospital-card';
    card.dataset.hospitalId = hospitalId;
    
    const specialtiesList = hospital.specialties.join(', ');
    const stars = '⭐'.repeat(Math.floor(hospital.rating));

    const hospitalImages = {
        'city-general': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=250&fit=crop',
        'metro-medical': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=250&fit=crop',
        'community-health': 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=250&fit=crop',
        'university-hospital': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop',
        'regional-medical': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
    };

    card.innerHTML = `
        <div class="hospital-image-container">
            <img src="${hospitalImages[hospitalId] || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=250&fit=crop'}" alt="${hospital.name}" loading="lazy">
        </div>
        <div class="hospital-header">
            <div class="hospital-icon">${hospital.image}</div>
            <div>
                <h3>${hospital.name}</h3>
                <div class="rating">${stars} ${hospital.rating}</div>
            </div>
        </div>
        <div class="hospital-body">
            <p class="hospital-description">${hospital.description}</p>
            <div class="hospital-details">
                <div class="detail-item">
                    <strong>📍 Address:</strong> ${hospital.address}
                </div>
                <div class="detail-item">
                    <strong>📞 Phone:</strong> ${hospital.phone}
                </div>
                <div class="detail-item">
                    <strong>📧 Email:</strong> ${hospital.email}
                </div>
                <div class="detail-item">
                    <strong>🏛️ Established:</strong> ${hospital.established}
                </div>
                <div class="detail-item">
                    <strong>🛏️ Beds:</strong> ${hospital.beds}
                </div>
                <div class="detail-item">
                    <strong>🏥 Specialties:</strong> ${specialtiesList}
                </div>
            </div>
            <a href="appointment.html" class="btn-primary btn-small">Book Appointment</a>
        </div>
    `;

    return card;
}

function loadDoctors() {
    const container = document.getElementById('doctorsContainer');
    container.innerHTML = '';

    Object.keys(doctorsData).forEach(doctorId => {
        const doctor = doctorsData[doctorId];
        const doctorCard = createDoctorCard(doctor, doctorId);
        container.appendChild(doctorCard);
    });
}

function createDoctorCard(doctor, doctorId) {
    const card = document.createElement('div');
    card.className = 'doctor-card';
    card.dataset.hospital = doctor.hospital;
    card.dataset.specialties = doctor.specialties.map(s => s.toLowerCase().replace(' ', '-')).join(',');
    
    const hospitalName = hospitalsData[doctor.hospital]?.name || 'Unknown Hospital';
    const specialtiesList = doctor.specialties.join(', ');
    const stars = '⭐'.repeat(Math.floor(doctor.rating));

    const doctorImages = [
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=300&h=300&fit=crop',
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop'
    ];
    const imageIndex = Math.abs(doctorId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % doctorImages.length;

    card.innerHTML = `
        <div class="doctor-image-container">
            <img src="${doctorImages[imageIndex]}" alt="${doctor.name}" loading="lazy">
        </div>
        <div class="doctor-header">
            <div class="doctor-icon">${doctor.image}</div>
            <div>
                <h3>${doctor.name}</h3>
                <div class="rating">${stars} ${doctor.rating}</div>
            </div>
        </div>
        <div class="doctor-body">
            <div class="doctor-info">
                <p><strong>🏥 Hospital:</strong> ${hospitalName}</p>
                <p><strong>🎓 Education:</strong> ${doctor.education}</p>
                <p><strong>⏱️ Experience:</strong> ${doctor.experience}</p>
                <p><strong>🏥 Specialties:</strong> ${specialtiesList}</p>
            </div>
            <p class="doctor-bio">${doctor.bio}</p>
            <a href="appointment.html" class="btn-primary btn-small">Book Appointment</a>
        </div>
    `;

    return card;
}

function filterDoctors() {
    const hospitalFilter = document.getElementById('hospitalFilter').value;
    const specialtyFilter = document.getElementById('specialtyFilter').value.toLowerCase();
    const doctorCards = document.querySelectorAll('.doctor-card');

    doctorCards.forEach(card => {
        const cardHospital = card.dataset.hospital;
        const cardSpecialties = card.dataset.specialties;

        let show = true;

        if (hospitalFilter && cardHospital !== hospitalFilter) {
            show = false;
        }

        if (specialtyFilter && !cardSpecialties.includes(specialtyFilter)) {
            show = false;
        }

        card.style.display = show ? 'block' : 'none';
    });

    // Also filter hospitals based on specialty
    if (specialtyFilter) {
        filterHospitals(specialtyFilter);
    } else {
        // Show all hospitals if no specialty filter
        const hospitalCards = document.querySelectorAll('.hospital-card');
        hospitalCards.forEach(card => {
            card.style.display = 'block';
        });
    }
}

