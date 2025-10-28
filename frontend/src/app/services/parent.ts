import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy } from '@angular/fire/firestore';

export interface ParentProfile {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  phone?: string | null;
  photoURL?: string | null;
  createdAt?: any;
  lastUpdatedAt?: any;
}

export interface ChildProfile {
  id?: string;
  name: string;
  grade: string;
  age?: number;
  createdAt?: any;
}

@Injectable({ providedIn: 'root' })
export class ParentService {
  constructor(private firestore: Firestore) {}

  async getParent(uid: string): Promise<ParentProfile | null> {
    const ref = doc(this.firestore, `parents/${uid}`);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { uid: snap.id, ...snap.data() } as ParentProfile;
    }
    return null;
  }

  async updateParent(uid: string, updates: Partial<ParentProfile>): Promise<void> {
    const ref = doc(this.firestore, `parents/${uid}`);
    await setDoc(ref, { ...updates, lastUpdatedAt: new Date() }, { merge: true });
  }

  // Children subcollection CRUD
  private childrenCollectionPath(uid: string) {
    return collection(this.firestore, `parents/${uid}/children`);
  }

  async getChildren(uid: string): Promise<ChildProfile[]> {
    const q = query(this.childrenCollectionPath(uid), orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as ChildProfile[];
  }

  async addChild(uid: string, child: Omit<ChildProfile, 'id' | 'createdAt'>): Promise<string> {
    const ref = this.childrenCollectionPath(uid);
    const docRef = await addDoc(ref, { ...child, createdAt: new Date() });
    return docRef.id;
  }

  async updateChild(uid: string, childId: string, updates: Partial<ChildProfile>): Promise<void> {
    const childRef = doc(this.firestore, `parents/${uid}/children/${childId}`);
    await updateDoc(childRef, updates);
  }

  async deleteChild(uid: string, childId: string): Promise<void> {
    const childRef = doc(this.firestore, `parents/${uid}/children/${childId}`);
    await deleteDoc(childRef);
  }
}

