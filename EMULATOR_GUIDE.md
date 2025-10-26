# Firebase Emulator Development Guide

## Quick Start with Emulators

### 1. Start Firebase Emulators
```bash
# From project root
npm run dev
# or
firebase emulators:start
```

### 2. Start Angular App with Emulator Configuration
```bash
# From project root
npm run serve:local
# or from frontend directory
cd frontend && npm run start:local
```

### 3. Access Services

- **App**: http://localhost:4200 (Angular dev server)
- **Emulator UI**: http://localhost:4000 (Firebase Emulator UI)
- **Firestore Emulator**: http://localhost:8080
- **Auth Emulator**: http://localhost:9099
- **Hosting Emulator**: http://localhost:5002 (auto-assigned if 5001 is taken)

## Development Workflow

### Environment Configurations

1. **Production**: Uses live Firebase services
   - `environment.prod.ts`
   - `ng serve --configuration production`

2. **Development**: Uses live Firebase services (default)
   - `environment.ts`
   - `ng serve`

3. **Local**: Uses Firebase emulators
   - `environment.local.ts`
   - `ng serve --configuration local`

### Testing Authentication

When using the Auth emulator:
- No real Google accounts needed
- Use test email addresses
- Auth emulator provides a simple UI for creating test users

### Data Management

#### Export Emulator Data
```bash
firebase emulators:export ./emulator-data
```

#### Import Emulator Data
```bash
firebase emulators:start --import=./emulator-data
```

#### Seed Sample Data
```bash
./scripts/seed-emulator.sh
```

## Debugging Features

### 1. Firestore Emulator
- View all collections and documents
- Add/edit/delete data in real-time
- See all queries and writes
- Export/import data for testing scenarios

### 2. Auth Emulator
- Create test users without real email accounts
- Test sign-in flows
- View JWT tokens
- Clear all users for fresh testing

### 3. Emulator UI Dashboard
- Monitor all emulator activity
- View logs and debugging information
- Manage data across all services

## Common Debugging Scenarios

### 1. Authentication Issues
- Check Auth emulator UI for user creation
- Verify environment configuration
- Test with demo users

### 2. Firestore Issues
- View real-time data changes in emulator
- Check Firestore rules
- Monitor query performance

### 3. Hosting Issues
- Test routing and redirects locally
- Verify build output
- Check for CORS issues

## Production vs Emulator Differences

| Feature | Production | Emulator |
|---------|------------|----------|
| Authentication | Real Google OAuth | Test accounts |
| Data Persistence | Permanent | Temporary (unless exported) |
| Performance | Real network latency | Local (fast) |
| Billing | Counts against quotas | Free |
| Security Rules | Enforced | Enforced (testable) |

## Tips

1. **Always use emulators for development** to avoid affecting production data
2. **Export emulator data** before stopping to preserve test scenarios
3. **Use environment.local.ts** to easily switch between emulators and production
4. **Test security rules** thoroughly in emulator before deploying
5. **Create test data scenarios** for different user types and edge cases

## Troubleshooting

### Emulator won't start
- Check if ports are available (8080, 9099, 5000, 4000)
- Ensure Firebase CLI is installed and updated
- Clear emulator data: `firebase emulators:export ./backup && rm -rf firebase-debug.log`

### App won't connect to emulators
- Verify environment.local.ts is being used
- Check browser console for connection errors
- Ensure emulators are running before starting Angular app

### Auth emulator issues
- Clear browser storage/cookies
- Check emulator UI for user creation
- Verify localhost URLs (no HTTPS needed)