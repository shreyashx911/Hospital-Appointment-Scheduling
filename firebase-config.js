// Firebase Configuration
// Replace these values with your Firebase project configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (make sure to include Firebase SDK in HTML)
// For Firestore Database
let db;
let appointmentsCollection;

// Check if Firebase is available
if (typeof firebase !== 'undefined') {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    // Initialize Firestore
    db = firebase.firestore();
    appointmentsCollection = db.collection('appointments');
    
    console.log('Firebase initialized successfully');
} else {
    console.warn('Firebase SDK not loaded. Using localStorage as fallback.');
}

// Firebase Functions
const firebaseAppointments = {
    // Save appointment to Firebase
    async saveAppointment(appointment) {
        if (!appointmentsCollection) {
            // Fallback to localStorage if Firebase is not available
            return this.saveToLocalStorage(appointment);
        }
        
        try {
            const docRef = await appointmentsCollection.add({
                ...appointment,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'confirmed'
            });
            console.log('Appointment saved with ID: ', docRef.id);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Error saving appointment: ', error);
            // Fallback to localStorage
            return this.saveToLocalStorage(appointment);
        }
    },
    
    // Get all appointments
    async getAllAppointments() {
        if (!appointmentsCollection) {
            return this.getFromLocalStorage();
        }
        
        try {
            const snapshot = await appointmentsCollection
                .orderBy('createdAt', 'desc')
                .get();
            
            const appointments = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                appointments.push({
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
                });
            });
            return appointments;
        } catch (error) {
            console.error('Error getting appointments: ', error);
            return this.getFromLocalStorage();
        }
    },
    
    // Get appointments by date, hospital, and doctor
    async getBookedSlots(date, hospital, doctor) {
        if (!appointmentsCollection) {
            return this.getBookedSlotsFromLocalStorage(date, hospital, doctor);
        }
        
        try {
            const snapshot = await appointmentsCollection
                .where('date', '==', date)
                .where('hospital', '==', hospital)
                .where('doctor', '==', doctor)
                .where('status', '==', 'confirmed')
                .get();
            
            const bookedSlots = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.time) {
                    bookedSlots.push(data.time);
                }
            });
            return bookedSlots;
        } catch (error) {
            console.error('Error getting booked slots: ', error);
            return this.getBookedSlotsFromLocalStorage(date, hospital, doctor);
        }
    },
    
    // Delete appointment
    async deleteAppointment(appointmentId) {
        if (!appointmentsCollection) {
            return this.deleteFromLocalStorage(appointmentId);
        }
        
        try {
            await appointmentsCollection.doc(appointmentId).delete();
            console.log('Appointment deleted: ', appointmentId);
            return { success: true };
        } catch (error) {
            console.error('Error deleting appointment: ', error);
            return { success: false, error: error.message };
        }
    },
    
    // Update appointment status
    async updateAppointmentStatus(appointmentId, status) {
        if (!appointmentsCollection) {
            return { success: false, error: 'Firebase not available' };
        }
        
        try {
            await appointmentsCollection.doc(appointmentId).update({
                status: status,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error('Error updating appointment: ', error);
            return { success: false, error: error.message };
        }
    },
    
    // Fallback to localStorage methods
    saveToLocalStorage(appointment) {
        let appointments = JSON.parse(localStorage.getItem('bookedAppointments')) || [];
        appointments.push(appointment);
        localStorage.setItem('bookedAppointments', JSON.stringify(appointments));
        return { success: true, id: appointment.id };
    },
    
    getFromLocalStorage() {
        return JSON.parse(localStorage.getItem('bookedAppointments')) || [];
    },
    
    getBookedSlotsFromLocalStorage(date, hospital, doctor) {
        const appointments = this.getFromLocalStorage();
        return appointments
            .filter(apt => 
                apt.date === date && 
                apt.hospital === hospital && 
                apt.doctor === doctor &&
                apt.status !== 'cancelled'
            )
            .map(apt => apt.time);
    },
    
    deleteFromLocalStorage(appointmentId) {
        let appointments = this.getFromLocalStorage();
        appointments = appointments.filter(apt => apt.id !== appointmentId);
        localStorage.setItem('bookedAppointments', JSON.stringify(appointments));
        return { success: true };
    }
};
