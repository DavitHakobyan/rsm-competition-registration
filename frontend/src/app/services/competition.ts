import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

export interface Competition {
  id?: string;
  name: string;
  date: string;
  location: string;
  description: string;
  registrationFee: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {
  private competitionsCollection = collection(this.firestore, 'competitions');

  constructor(private firestore: Firestore) {}

  async getCompetitions(): Promise<Competition[]> {
    const q = query(this.competitionsCollection, orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Competition[];
  }

  getCompetitions$(): Observable<Competition[]> {
    return from(this.getCompetitions());
  }

  async addCompetition(competition: Omit<Competition, 'id'>): Promise<string> {
    const competitionData = {
      ...competition,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const docRef = await addDoc(this.competitionsCollection, competitionData);
    return docRef.id;
  }

  async updateCompetition(id: string, competition: Partial<Competition>): Promise<void> {
    const competitionRef = doc(this.firestore, 'competitions', id);
    await updateDoc(competitionRef, {
      ...competition,
      updatedAt: new Date()
    });
  }

  async deleteCompetition(id: string): Promise<void> {
    const competitionRef = doc(this.firestore, 'competitions', id);
    await deleteDoc(competitionRef);
  }
}
