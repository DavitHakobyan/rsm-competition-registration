import { Injectable } from '@angular/core';
import { CompetitionService } from './competition';

@Injectable({
  providedIn: 'root'
})
export class DataSeedService {
  
  constructor(private competitionService: CompetitionService) {}

  async seedCompetitions(): Promise<void> {
    const sampleCompetitions = [
      {
        name: 'Math Olympiad 2025',
        date: '2025-12-15',
        location: 'Central High School',
        description: 'Annual math competition for high school students. Test your skills in algebra, geometry, and calculus.',
        registrationFee: 25.00
      },
      {
        name: 'Elementary Math Challenge',
        date: '2025-11-20',
        location: 'Community Center',
        description: 'Fun math competition for elementary students grades 3-6. Focus on problem-solving and logical thinking.',
        registrationFee: 15.00
      },
      {
        name: 'Regional Mathematics Contest',
        date: '2026-01-10',
        location: 'University Auditorium',
        description: 'Regional competition for middle and high school students. Scholarships available for top performers.',
        registrationFee: 35.00
      },
      {
        name: 'Spring Math Festival',
        date: '2025-03-22',
        location: 'Learning Academy',
        description: 'Celebrate mathematics with team competitions, individual challenges, and mathematical games.',
        registrationFee: 20.00
      }
    ];

    try {
      for (const competition of sampleCompetitions) {
        await this.competitionService.addCompetition(competition);
      }
      console.log('Sample competitions added successfully!');
    } catch (error) {
      console.error('Error seeding competitions:', error);
    }
  }
}