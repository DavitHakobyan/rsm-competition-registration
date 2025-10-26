import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

export interface Registration {
  id?: string;
  parentId: string;
  competitionId: string;
  competitionName?: string; // Denormalized for easier display
  studentName: string;
  studentGrade: string;
  studentSchool?: string;
  studentAge?: number;
  parentPhone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  specialNeeds?: string;
  dietaryRestrictions?: string;
  paid: boolean;
  paymentId?: string;
  registrationDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private registrationsCollection = collection(this.firestore, 'registrations');

  constructor(private firestore: Firestore) {}

  async createRegistration(registration: Omit<Registration, 'id' | 'registrationDate' | 'status' | 'paid'>): Promise<string> {
    const registrationData: Omit<Registration, 'id'> = {
      ...registration,
      registrationDate: new Date(),
      status: 'pending',
      paid: false
    };

    const docRef = await addDoc(this.registrationsCollection, registrationData);
    return docRef.id;
  }

  async getRegistrationsByParent(parentId: string): Promise<Registration[]> {
    const q = query(
      this.registrationsCollection,
      where('parentId', '==', parentId),
      orderBy('registrationDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Registration[];
  }

  getRegistrationsByParent$(parentId: string): Observable<Registration[]> {
    return from(this.getRegistrationsByParent(parentId));
  }

  async getRegistrationsByCompetition(competitionId: string): Promise<Registration[]> {
    const q = query(
      this.registrationsCollection,
      where('competitionId', '==', competitionId),
      orderBy('registrationDate', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Registration[];
  }

  async updateRegistration(id: string, updates: Partial<Registration>): Promise<void> {
    const registrationRef = doc(this.firestore, 'registrations', id);
    await updateDoc(registrationRef, updates);
  }

  async cancelRegistration(id: string): Promise<void> {
    await this.updateRegistration(id, { status: 'cancelled' });
  }

  async confirmPayment(id: string, paymentId: string): Promise<void> {
    await this.updateRegistration(id, {
      paid: true,
      paymentId,
      status: 'confirmed'
    });
  }

  async deleteRegistration(id: string): Promise<void> {
    const registrationRef = doc(this.firestore, 'registrations', id);
    await deleteDoc(registrationRef);
  }
}
