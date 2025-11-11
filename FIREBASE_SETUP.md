# Firebase Setup Instructions

This guide will help you connect your healthcare appointment website to Firebase for storing and retrieving appointments.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Enter your project name (e.g., "healthcare-connect")
4. Follow the setup wizard (you can disable Google Analytics if you don't need it)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project, go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Select **Start in test mode** (for development) or **Start in production mode** (for production)
4. Choose a location for your database (select the closest to your users)
5. Click **Enable**

## Step 3: Get Your Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select **Project settings**
3. Scroll down to **Your apps** section
4. Click the **Web** icon (`</>`) to add a web app
5. Register your app with a nickname (e.g., "Healthcare Connect Web")
6. Copy the Firebase configuration object

## Step 4: Update firebase-config.js

1. Open `firebase-config.js` in your project
2. Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

## Step 5: Set Up Firestore Security Rules (Important!)

1. Go to **Firestore Database** → **Rules** tab
2. For development/testing, you can use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appointments/{appointmentId} {
      // Allow read and write for now (for testing)
      // In production, add proper authentication and rules
      allow read, write: if true;
    }
  }
}
```

3. Click **Publish**

**⚠️ Security Note:** The above rules allow anyone to read/write. For production, implement proper authentication and restrict access.

## Step 6: Test the Integration

1. Open `appointment.html` in your browser
2. Book a test appointment
3. Check Firebase Console → Firestore Database to see if the appointment was saved
4. Open `admin-appointments.html` to view all appointments

## Step 7: Firestore Indexes (if needed)

If you see errors about missing indexes when filtering appointments:
1. Firebase will provide a link to create the index
2. Click the link and create the index
3. Wait for the index to build (usually takes a few minutes)

## Features Included

✅ **Save Appointments** - Appointments are saved to Firestore
✅ **Real-time Availability** - Checks Firebase for booked slots
✅ **Admin Dashboard** - View all appointments at `admin-appointments.html`
✅ **Filter Appointments** - Filter by status, hospital, or date
✅ **Cancel/Delete** - Manage appointments from admin panel
✅ **Fallback Support** - Falls back to localStorage if Firebase is unavailable

## Firebase SDK Versions

The code uses Firebase v9 (modular SDK). If you need to use a different version, update the script tags in:
- `appointment.html`
- `admin-appointments.html`

## Troubleshooting

**Issue: "Firebase is not defined"**
- Make sure Firebase SDK scripts are loaded before `firebase-config.js`
- Check browser console for errors

**Issue: "Permission denied"**
- Check Firestore security rules
- Make sure rules allow read/write operations

**Issue: "Missing index"**
- Create the index as suggested by Firebase
- Wait for index to build

**Issue: Appointments not showing**
- Check browser console for errors
- Verify Firebase configuration is correct
- Check Firestore database in Firebase Console

## Production Considerations

1. **Authentication**: Add Firebase Authentication for secure access
2. **Security Rules**: Implement proper Firestore security rules
3. **Error Handling**: Add comprehensive error handling
4. **Backup**: Set up regular backups of your Firestore database
5. **Monitoring**: Enable Firebase monitoring and alerts

## Support

For more information, visit:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)

