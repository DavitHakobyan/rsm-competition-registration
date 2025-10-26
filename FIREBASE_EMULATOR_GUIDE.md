# Firebase Emulator Setup - Complete Guide

## Overview
This project includes a complete Firebase emulator setup for local development, allowing you to test Authentication, Firestore, and Hosting without affecting production data.

## Initial Setup

### 1. Install Dependencies
```bash
# Install Firebase CLI globally if not already installed
npm install -g firebase-tools

# Install project dependencies
cd frontend && npm install
```

### 2. Firebase Configuration
The project is already configured with:
- **Project ID**: `competition-registration-e8597`
- **Emulator Ports**:
  - Auth: 9099
  - Firestore: 8080
  - Hosting: 5002 (auto-assigned)
  - Emulator UI: 4000

## Quick Start

### Option 1: Using NPM Scripts (Recommended)
```bash
# Start emulators
npm run dev

# In another terminal, start Angular with emulator config
npm run serve:local
```

### Option 2: Manual Commands
```bash
# Terminal 1: Start Firebase emulators
firebase emulators:start

# Terminal 2: Start Angular app
cd frontend && npm run start:local
```

## Environment Configurations

### Development Environments
1. **Production** (`environment.prod.ts`): Live Firebase services
2. **Development** (`environment.ts`): Live Firebase services (default)
3. **Local** (`environment.local.ts`): Firebase emulators

### Environment Selection
- **Production build**: `ng build --configuration production`
- **Development**: `ng serve` (default)
- **Local with emulators**: `ng serve --configuration local`

## Features

### Authentication Emulator
- **URL**: http://localhost:9099
- **Features**:
  - Test user creation without real email accounts
  - Mock Google Sign-In flow
  - JWT token inspection
  - User management interface

### Firestore Emulator
- **URL**: http://localhost:8080
- **Features**:
  - Real-time data viewing and editing
  - Query debugging and performance monitoring
  - Security rules testing
  - Data export/import capabilities

### Hosting Emulator
- **URL**: http://localhost:5002
- **Features**:
  - Test production build locally
  - Verify routing and redirects
  - Test PWA features

### Emulator UI Dashboard
- **URL**: http://localhost:4000
- **Features**:
  - Unified dashboard for all emulators
  - Real-time logs and monitoring
  - Data management across services
  - Export/import data for testing scenarios

## Development Workflow

### 1. Starting Development Session
```bash
# Terminal 1: Start emulators
npm run dev

# Terminal 2: Start Angular app
npm run serve:local

# Access your app at: http://localhost:4200
# Access emulator UI at: http://localhost:4000
```

### 2. Testing Authentication
1. Open your app at http://localhost:4200
2. Click "Sign in with Google"
3. Use any email address (no real account needed)
4. View created users in Emulator UI

### 3. Database Development
1. View Firestore data in real-time at http://localhost:4000
2. Add/edit/delete data directly in the UI
3. Test security rules without affecting production
4. Export data for different test scenarios

### 4. Data Management
```bash
# Export current emulator data
firebase emulators:export ./emulator-data

# Start emulators with existing data
firebase emulators:start --import=./emulator-data
```

## Security Rules Testing

### Firestore Rules Location
- **File**: `firestore.rules`
- **Auto-deployed**: Rules are automatically applied to emulator

### Current Rules
```javascript
// Allow authenticated users to read/write their own data
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// Allow authenticated users to read competitions
match /competitions/{document} {
  allow read: if request.auth != null;
  allow write: if request.auth != null; // In production, restrict to admins
}

// Allow authenticated users to manage registrations
match /registrations/{document} {
  allow read, write: if request.auth != null;
}
```

## Debugging Common Issues

### Emulator Won't Start
1. **Port conflicts**: Check if ports 4000, 8080, 9099, 5002 are available
2. **Firebase CLI**: Update to latest version: `npm install -g firebase-tools@latest`
3. **Clear cache**: Delete `firebase-debug.log` and `.firebase/` folder

### App Won't Connect to Emulators
1. **Environment**: Ensure using `local` configuration: `ng serve --configuration local`
2. **Browser cache**: Clear browser storage and cookies
3. **CORS issues**: Emulators run on localhost, ensure no HTTPS mixed content

### Authentication Issues
1. **Test accounts**: Use any email format in auth emulator
2. **Token refresh**: Clear auth state in emulator UI if issues persist
3. **Network**: Ensure emulators are running before testing auth

## Production vs Emulator Differences

| Aspect | Production | Emulator |
|--------|------------|----------|
| Data Persistence | Permanent | Temporary (unless exported) |
| Authentication | Real OAuth | Test accounts |
| Performance | Real latency | Local (fast) |
| Billing | Counts toward quotas | Free |
| Security Rules | Enforced | Enforced (testable) |

## Best Practices

1. **Always develop with emulators** to avoid affecting production data
2. **Export test data** regularly to preserve testing scenarios
3. **Test security rules** thoroughly in emulator before production deployment
4. **Use realistic test data** that mirrors production scenarios
5. **Clear emulator data** between major feature development to ensure clean state

## Advanced Usage

### Custom Test Data
Create scripts in `scripts/` directory to populate emulator with specific test scenarios.

### CI/CD Integration
```bash
# Run tests against emulators
firebase emulators:exec --only firestore,auth "npm test"
```

### Multiple Project Support
```bash
# Switch between Firebase projects
firebase use --add  # Add new project alias
firebase use production  # Switch to production
firebase use staging     # Switch to staging
```

## Troubleshooting

### Common Commands
```bash
# Check emulator status
firebase emulators:start --help

# Clear all emulator data
rm -rf .firebase/emulators/

# View Firebase project info
firebase projects:list
firebase use

# Check Firebase CLI version
firebase --version
```

### Log Files
- **Firestore logs**: `firestore-debug.log`
- **General logs**: `firebase-debug.log`
- **UI logs**: Check browser console at http://localhost:4000

---

## Ready for Production

When ready to deploy:
1. Test thoroughly with emulators
2. Update security rules as needed
3. Build production version: `ng build --configuration production`
4. Deploy: `firebase deploy`

The emulator setup ensures your local development environment closely mirrors production while keeping your data safe and development fast!