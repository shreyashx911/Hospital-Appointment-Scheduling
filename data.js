// Comprehensive hospital and doctor data
const hospitalsData = {
    'city-general': {
        name: 'City General Hospital',
        address: '123 Medical Center Road, Connaught Place, New Delhi - 110001',
        phone: '+91 11 2345 6789',
        email: 'info@citygeneral.in',
        established: '1985',
        beds: '350',
        specialties: ['Cardiology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'General Medicine'],
        description: 'A leading healthcare facility providing comprehensive medical services with state-of-the-art technology and experienced medical professionals.',
        rating: 4.8,
        image: '🏥'
    },
    'metro-medical': {
        name: 'Metro Medical Center',
        address: '456 Health Boulevard, Bandra West, Mumbai - 400050',
        phone: '+91 22 2345 6789',
        email: 'contact@metromedical.in',
        established: '1992',
        beds: '500',
        specialties: ['Cardiology', 'Neurology', 'Gastroenterology', 'Ophthalmology', 'General Medicine'],
        description: 'A premier medical center known for excellence in specialized care and innovative treatment approaches.',
        rating: 4.9,
        image: '🏨'
    },
    'community-health': {
        name: 'Community Health Clinic',
        address: '789 Wellness Street, Koramangala, Bangalore - 560095',
        phone: '+91 80 2345 6789',
        email: 'hello@communityhealth.in',
        established: '2000',
        beds: '150',
        specialties: ['Pediatrics', 'Orthopedics', 'Dermatology', 'General Medicine'],
        description: 'Dedicated to providing accessible, affordable healthcare to our community with a focus on preventive care.',
        rating: 4.7,
        image: '🏩'
    },
    'university-hospital': {
        name: 'University Hospital',
        address: '321 Academic Avenue, Jadavpur, Kolkata - 700032',
        phone: '+91 33 2345 6789',
        email: 'info@universityhospital.in',
        established: '1975',
        beds: '600',
        specialties: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Gastroenterology', 'Psychiatry', 'Emergency'],
        description: 'A teaching hospital combining cutting-edge research with exceptional patient care and medical education.',
        rating: 4.9,
        image: '🎓'
    },
    'regional-medical': {
        name: 'Regional Medical Center',
        address: '654 Regional Parkway, Banjara Hills, Hyderabad - 500034',
        phone: '+91 40 2345 6789',
        email: 'contact@regionalmedical.in',
        established: '1988',
        beds: '450',
        specialties: ['Cardiology', 'Orthopedics', 'Pediatrics', 'Ophthalmology', 'Emergency', 'General Medicine'],
        description: 'Serving the region with comprehensive medical services and a commitment to patient-centered care.',
        rating: 4.8,
        image: '🏛️'
    }
};

const doctorsData = {
    'dr-smith': {
        name: 'Dr. Sarah Smith',
        hospital: 'city-general',
        specialties: ['General Checkup', 'Cardiology'],
        experience: '15 years',
        education: 'MD, AIIMS New Delhi',
        bio: 'Board-certified cardiologist with extensive experience in preventive cardiology and heart disease management.',
        rating: 4.9,
        image: '👩‍⚕️'
    },
    'dr-johnson': {
        name: 'Dr. Michael Johnson',
        hospital: 'city-general',
        specialties: ['Orthopedics', 'General Checkup'],
        experience: '12 years',
        education: 'MD, PGIMER Chandigarh',
        bio: 'Specialized in sports medicine and joint replacement surgery, helping patients regain mobility and quality of life.',
        rating: 4.8,
        image: '👨‍⚕️'
    },
    'dr-williams': {
        name: 'Dr. Emily Williams',
        hospital: 'city-general',
        specialties: ['Pediatrics', 'General Checkup'],
        experience: '10 years',
        education: 'MD, CMC Vellore',
        bio: 'Dedicated pediatrician with a passion for child health and development, providing compassionate care to young patients.',
        rating: 4.9,
        image: '👩‍⚕️'
    },
    'dr-brown': {
        name: 'Dr. David Brown',
        hospital: 'city-general',
        specialties: ['Dermatology'],
        experience: '18 years',
        education: 'MD, Tata Memorial Hospital',
        bio: 'Expert dermatologist specializing in skin cancer detection, cosmetic dermatology, and complex skin conditions.',
        rating: 4.7,
        image: '👨‍⚕️'
    },
    'dr-davis': {
        name: 'Dr. Jennifer Davis',
        hospital: 'metro-medical',
        specialties: ['Cardiology', 'General Checkup'],
        experience: '20 years',
        education: 'MD, AIIMS New Delhi',
        bio: 'Renowned cardiologist with expertise in interventional cardiology and cardiac rehabilitation programs.',
        rating: 5.0,
        image: '👩‍⚕️'
    },
    'dr-miller': {
        name: 'Dr. Robert Miller',
        hospital: 'metro-medical',
        specialties: ['Neurology', 'Psychiatry'],
        experience: '16 years',
        education: 'MD, NIMHANS Bangalore',
        bio: 'Dual-certified neurologist and psychiatrist specializing in neuropsychiatric disorders and cognitive health.',
        rating: 4.8,
        image: '👨‍⚕️'
    },
    'dr-wilson': {
        name: 'Dr. Lisa Wilson',
        hospital: 'metro-medical',
        specialties: ['Gastroenterology', 'General Checkup'],
        experience: '14 years',
        education: 'MD, KEM Hospital Mumbai',
        bio: 'Gastroenterologist focused on digestive health, endoscopy procedures, and inflammatory bowel disease management.',
        rating: 4.9,
        image: '👩‍⚕️'
    },
    'dr-moore': {
        name: 'Dr. James Moore',
        hospital: 'metro-medical',
        specialties: ['Ophthalmology'],
        experience: '22 years',
        education: 'MD, LV Prasad Eye Institute',
        bio: 'Experienced ophthalmologist specializing in cataract surgery, retinal diseases, and vision correction procedures.',
        rating: 4.8,
        image: '👨‍⚕️'
    },
    'dr-taylor': {
        name: 'Dr. Patricia Taylor',
        hospital: 'community-health',
        specialties: ['General Checkup', 'Pediatrics'],
        experience: '11 years',
        education: 'MD, St. John\'s Medical College',
        bio: 'Family medicine physician and pediatrician providing comprehensive primary care for all ages.',
        rating: 4.7,
        image: '👩‍⚕️'
    },
    'dr-anderson': {
        name: 'Dr. Mark Anderson',
        hospital: 'community-health',
        specialties: ['Orthopedics', 'General Checkup'],
        experience: '13 years',
        education: 'MD, Apollo Hospitals',
        bio: 'Orthopedic surgeon specializing in minimally invasive procedures and fracture management.',
        rating: 4.8,
        image: '👨‍⚕️'
    },
    'dr-thomas': {
        name: 'Dr. Susan Thomas',
        hospital: 'community-health',
        specialties: ['Dermatology', 'General Checkup'],
        experience: '9 years',
        education: 'MD, Manipal Hospitals',
        bio: 'Dermatologist providing comprehensive skin care services including medical and cosmetic treatments.',
        rating: 4.6,
        image: '👩‍⚕️'
    },
    'dr-jackson': {
        name: 'Dr. Christopher Jackson',
        hospital: 'university-hospital',
        specialties: ['Cardiology', 'Neurology'],
        experience: '19 years',
        education: 'MD, AIIMS New Delhi',
        bio: 'Cardiologist and neurologist with expertise in cardiovascular neurology and stroke prevention.',
        rating: 4.9,
        image: '👨‍⚕️'
    },
    'dr-white': {
        name: 'Dr. Amanda White',
        hospital: 'university-hospital',
        specialties: ['Pediatrics', 'General Checkup'],
        experience: '8 years',
        education: 'MD, CMC Vellore',
        bio: 'Pediatrician specializing in adolescent medicine and preventive care for children and teens.',
        rating: 4.8,
        image: '👩‍⚕️'
    },
    'dr-harris': {
        name: 'Dr. Daniel Harris',
        hospital: 'university-hospital',
        specialties: ['Orthopedics', 'Emergency'],
        experience: '15 years',
        education: 'MD, PGIMER Chandigarh',
        bio: 'Emergency medicine and orthopedic specialist providing urgent care and trauma management.',
        rating: 4.9,
        image: '👨‍⚕️'
    },
    'dr-martin': {
        name: 'Dr. Michelle Martin',
        hospital: 'university-hospital',
        specialties: ['Gastroenterology', 'General Checkup'],
        experience: '12 years',
        education: 'MD, Fortis Hospitals',
        bio: 'Gastroenterologist with expertise in liver diseases, endoscopy, and digestive health optimization.',
        rating: 4.7,
        image: '👩‍⚕️'
    },
    'dr-thompson': {
        name: 'Dr. Kevin Thompson',
        hospital: 'university-hospital',
        specialties: ['Psychiatry', 'Neurology'],
        experience: '17 years',
        education: 'MD, AIIMS New Delhi',
        bio: 'Psychiatrist and neurologist specializing in mood disorders, anxiety, and neurological conditions.',
        rating: 4.8,
        image: '👨‍⚕️'
    },
    'dr-garcia': {
        name: 'Dr. Maria Garcia',
        hospital: 'regional-medical',
        specialties: ['General Checkup', 'Cardiology'],
        experience: '14 years',
        education: 'MD, AIIMS New Delhi',
        bio: 'Cardiologist and primary care physician providing comprehensive heart health and preventive care.',
        rating: 4.8,
        image: '👩‍⚕️'
    },
    'dr-martinez': {
        name: 'Dr. Carlos Martinez',
        hospital: 'regional-medical',
        specialties: ['Orthopedics', 'Emergency'],
        experience: '16 years',
        education: 'MD, Apollo Hospitals',
        bio: 'Orthopedic surgeon and emergency medicine specialist with expertise in trauma and sports injuries.',
        rating: 4.9,
        image: '👨‍⚕️'
    },
    'dr-robinson': {
        name: 'Dr. Linda Robinson',
        hospital: 'regional-medical',
        specialties: ['Pediatrics', 'General Checkup'],
        experience: '11 years',
        education: 'MD, Rainbow Children\'s Hospital',
        bio: 'Pediatrician dedicated to providing compassionate care and supporting healthy child development.',
        rating: 4.7,
        image: '👩‍⚕️'
    },
    'dr-clark': {
        name: 'Dr. Steven Clark',
        hospital: 'regional-medical',
        specialties: ['Ophthalmology', 'General Checkup'],
        experience: '20 years',
        education: 'MD, Sankara Eye Care',
        bio: 'Ophthalmologist providing comprehensive eye care including surgical procedures and vision correction.',
        rating: 4.8,
        image: '👨‍⚕️'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { hospitalsData, doctorsData };
}

