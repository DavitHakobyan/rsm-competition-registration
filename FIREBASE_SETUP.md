# Firebase Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Project name: `rsm-competition-registration`
4. Enable Google Analytics (optional)

## 2. Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Add your domain to authorized domains (for production)

## 3. Set up Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Start in **test mode** (we'll add security rules later)
3. Choose a location (e.g., us-central1)

## 4. Get Web App Configuration

1. Go to **Project Settings** → **General** tab
2. Scroll down to "Your apps" section
3. Click **Web** icon (`</>`)
4. Register app: "Math Competition Registration"
5. Copy the `firebaseConfig` object

## 5. Update Environment Files

Replace the placeholder values in:
- `/frontend/src/environments/environment.ts`
- `/frontend/src/environments/environment.prod.ts`

## 6. Firestore Security Rules

Go to **Firestore Database** → **Rules** and update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own parent profile
    match /parents/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone authenticated can read competitions
    match /competitions/{competitionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // TODO: Restrict to admin users
    }
    
    // Users can read/write their own registrations
    match /registrations/{registrationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.parentId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.parentId;
    }
  }
}
```

## 7. Firebase Hosting Setup (Optional)

Run in terminal:
```bash
firebase login
firebase init hosting
```

Choose:
- Use existing project: rsm-competition-registration
- Public directory: `frontend/dist/math-competition-registration`
- Single page app: Yes
- Overwrite index.html: No

## 8. Test Configuration

After updating environment files, test by running:
```bash
cd frontend
ng serve
```

Navigate to `/login` and try Google Sign-In to verify setup.