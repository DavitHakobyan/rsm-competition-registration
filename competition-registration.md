Perfect — welcome back! 🙌

Let’s build a **complete development plan** for your Firebase-based Angular app that helps parents register kids for math competitions.

We’ll structure it into **6 main sections**, each with clear steps and implementation details (ready for Cursor AI or any co-pilot to execute).


Treat this file as a living document, and log our progress steps.

---

## 🧩 Project Overview

**Goal:**
A Firebase-powered Angular web app (hosted entirely on Firebase) that allows parents to:

* Log in with Google Authentication
* View available math competitions
* Register their kids and pay online
* Store all data in Firestore
* Export registration data to Excel/CSV
* (Optional) Send email notifications

**Tech Stack:**

* **Frontend:** Angular + Angular Material
* **Backend:** Firebase (Firestore, Functions, Hosting, Auth)
* **Database:** Firestore (NoSQL)
* **Auth:** Firebase Authentication (Google sign-in)
* **Payments:** Payment Gateway (Stripe recommended)
* **Deployment:** Firebase Hosting

---

## ⚙️ Phase 1: Project Setup

1. **Initialize Angular project**

   ```bash
   ng new math-competition-registration --routing --style=scss
   cd math-competition-registration
   ```

2. **Add Angular Material**

   ```bash
   ng add @angular/material
   ```

   * Choose a light theme (e.g., Indigo/Pink)
   * Enable global typography and animations

3. **Initialize Firebase**

   ```bash
   npm install firebase @angular/fire
   ng add @angular/fire
   ```

   * Connect to your Firebase project
   * Select Firestore, Auth, Hosting during setup

4. **Set up environment variables**

   * Add your Firebase config to `environment.ts` and `environment.prod.ts`

---

## 🔐 Phase 2: Authentication Flow

**Pages:**

1. `/login` — Google Sign-In
2. `/dashboard` — Main parent area (protected route)
3. `/logout` — Redirects to login

**Implementation:**

* Use `AngularFireAuth` for login/logout
* Use route guards (`AuthGuard`) for protected pages
* Store user profile in Firestore under `/parents/{uid}`

---

## 🗂️ Phase 3: Competition Management

**Collections:**

```
competitions/
  {competitionId}
    name: string
    date: string
    location: string
    description: string
    registrationFee: number
```

**Features:**

* Admin view (optional) to add/edit competitions
* Parent view to browse and select competitions
* Use Angular Material table or cards to display competitions

---

## 👨‍👩‍👧 Phase 4: Student Registration

**Collection Structure:**

```
registrations/
  {registrationId}
    parentId: string
    studentName: string
    grade: string
    competitionId: string
    paid: boolean
    paymentId?: string
```

**Flow:**

1. Parent selects a competition
2. Fills out student details (dynamic form)
3. Proceeds to payment (next phase)
4. On success → mark registration as `paid: true`

---

## 💳 Phase 5: Payment Gateway Integration

**Recommendation:** Use **Stripe Checkout** with Firebase Cloud Functions.

**Steps:**

1. Install Stripe:

   ```bash
   npm install stripe
   ```
2. Create a Firebase Cloud Function:

   ```bash
   firebase functions:config:set stripe.secret="YOUR_SECRET_KEY"
   ```
3. Implement endpoint:

   * Create checkout session
   * Return Stripe Checkout URL to Angular frontend
   * Redirect parent for payment
4. Webhook listener updates Firestore `registrations` collection upon payment success.

---

## 📊 Phase 6: Data Export (CSV/Excel)

**Options:**

* **Option 1:** Client-side export with `xlsx` package:

  ```bash
  npm install xlsx file-saver
  ```

  Generate and download Excel directly from Angular.

* **Option 2:** Admin export via Firebase Cloud Function that returns CSV.

**Columns:**

* Student Name, Grade, Competition, Parent Email, Paid Status, Payment Date

---

## 📧 (Optional) Phase 7: Email Notifications

* Use Firebase Functions with **SendGrid** or **Mailgun**.
* Triggers:

  * New registration → send confirmation email
  * Payment success → send receipt

---

## 🚀 Phase 8: Deployment

1. Build:

   ```bash
   ng build --prod
   ```
2. Deploy to Firebase Hosting:

   ```bash
   firebase deploy
   ```

---

## ✅ Deliverables Summary

| Feature             | Tool                              | Status      |
| ------------------- | --------------------------------- | ----------- |
| Firebase Setup      | Firebase Console                  | ✅           |
| Auth (Google Login) | Firebase Auth + AngularFire       | ⏳           |
| Firestore DB        | competitions + registrations      | ⏳           |
| Payment             | Stripe Checkout + Cloud Functions | ⏳           |
| Data Export         | XLSX or CSV                       | ⏳           |
| Hosting             | Firebase Hosting                  | ⏳           |
| Email Notifications | SendGrid (optional)               | 🔄 Optional |

---

Would you like me to now generate **two ready-to-use Cursor AI compatible plans** (one frontend, one backend with example API requests in Postman format)?
That way, you can drop them directly into Cursor and start coding right away.
