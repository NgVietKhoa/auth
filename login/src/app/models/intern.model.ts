export interface Intern {
  id: number;
  name: string;
  dateOfBirth: string;
  gender: number;
  startDate: string;
  nextReviewDate: string;
}

export interface InternWorkSchedule {
  id: number;
  intern: Intern;
  availableHoursPerWeek: number;
  startDate: string;
  endDate: string;
}