import { CompetitionService } from './services/competition';

export async function seedSampleData(competitionService: CompetitionService) {
  try {
    console.log('Seeding sample competition data...');
    
    const sampleCompetitions = [
      {
        name: 'Regional Math Olympiad 2024',
        date: '2024-11-15',
        location: 'City Convention Center',
        description: 'Annual regional mathematics competition featuring algebra, geometry, and problem-solving challenges for high school students.',
        registrationFee: 25.00
      },
      {
        name: 'State Calculus Championship',
        date: '2024-12-05',
        location: 'University Mathematics Hall',
        description: 'Advanced calculus competition for senior students. Topics include differential and integral calculus, series, and applications.',
        registrationFee: 35.00
      },
      {
        name: 'Junior Math Contest',
        date: '2024-11-28',
        location: 'Lincoln Middle School',
        description: 'Mathematics competition designed for middle school students covering arithmetic, basic algebra, and geometry.',
        registrationFee: 15.00
      },
      {
        name: 'International Math Challenge',
        date: '2025-01-20',
        location: 'Grand Conference Center',
        description: 'Prestigious international mathematics competition featuring complex problem-solving across multiple mathematical disciplines.',
        registrationFee: 50.00
      }
    ];

    for (const competition of sampleCompetitions) {
      const id = await competitionService.addCompetition(competition);
      console.log(`Created competition: ${competition.name} with ID: ${id}`);
    }
    
    console.log('Sample data seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding sample data:', error);
  }
}