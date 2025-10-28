import { Injectable } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, user, User } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;
  private googleProvider = new GoogleAuthProvider();

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.user$ = user(this.auth);
  }

  async signInWithGoogle(): Promise<void> {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      if (result.user) {
        // Show Google account information in an alert after successful sign-in

        const u = result.user;
        /*
        const info = `Signed in as:\nName: ${u.displayName || 'N/A'}\nEmail: ${u.email || 'N/A'}\nUID: ${u.uid}\nPhoto: ${u.photoURL || 'N/A'}`;
        // Use window.alert to make it clear this is a user-facing notification
        window.alert(info);
         */

        // Check if a parent profile already exists for this email
        const email = u.email;
        debugger;
        if (email) {
          const parentsCol = collection(this.firestore, 'parents');
          const q = query(parentsCol, where('email', '==', email));
          const snapshot = await getDocs(q);

          if (snapshot.empty) {
            // No parent with this email — create a new parent profile using Google info
            const parentRef = doc(this.firestore, `parents/${u.uid}`);
            await setDoc(parentRef, {
              uid: u.uid,
              displayName: u.displayName || null,
              email: u.email || null,
              photoURL: u.photoURL || null,
              createdAt: new Date(),
              lastLoginAt: new Date()
            });
          } else {
            // Parent profile(s) found for this email — merge/update the first one with latest info
            const existingDoc = snapshot.docs[0];
            const existingRef = doc(this.firestore, `parents/${existingDoc.id}`);
            await setDoc(existingRef, {
              uid: u.uid,
              displayName: u.displayName || (existingDoc.data() as any)['displayName'] || null,
              photoURL: u.photoURL || (existingDoc.data() as any)['photoURL'] || null,
              lastLoginAt: new Date()
            }, { merge: true });
          }
        } else {
          // Fallback: no email from provider — fallback to uid-based save
          await this.saveUserProfile(result.user);
        }

        // After successful login/profile handling, redirect to the dashboard
        this.router.navigate(['/dashboard']);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  private async saveUserProfile(user: User): Promise<void> {
    const userRef = doc(this.firestore, `parents/${user.uid}`);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date(),
        lastLoginAt: new Date()
      });
    } else {
      await setDoc(userRef, {
        lastLoginAt: new Date()
      }, { merge: true });
    }
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }
}
