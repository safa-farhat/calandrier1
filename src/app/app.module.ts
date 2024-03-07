import { Component } from '@angular/core';

@Component({
  selector: 'app-infrastructure',
  templateUrl: './infrastructure.component.html',
  styleUrls: ['./infrastructure.component.css']
})
export class infrastructureComponent {
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth();
  selectedDay: number = -1; // Valeur par défaut pour le jour sélectionné
  title = 'Mon application';
  frenchMonths: string[] = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  days: string[] = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']; // Reorder days as per your requirement
  years: number[] = this.getYears();
  calendar: { day: number, blocked: boolean, past: boolean, date: Date, isWeekend: boolean }[][] = [];
  availableHours: string[] = []; // Utilisez des chaînes de caractères pour les heures disponibles
  events: Set<string> = new Set(); // Set to store special event dates
  holidays: Set<string> = new Set(); // Set to store holiday dates
  workHours: number[] = [9, 10, 11, 12, 14, 15, 16]; // Work hours with breaks

  constructor() {
    this.generateCalendar(this.selectedYear, this.selectedMonth);
    this.addHolidays();
    this.generateAvailableHours();
  }

  getYears(): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, index) => currentYear - 5 + index);
  }

  generateCalendar(year: number, month: number): void {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
    const calendarData: { day: number, blocked: boolean, past: boolean, date: Date, isWeekend: boolean }[][] = [];

    let currentDate = 1;

    // Décalage pour commencer le mois à un vendredi
    let offset = (firstDayOfMonth + 6) % 7;
    
    for (let i = 0; i < 6; i++) {
      const week: { day: number, blocked: boolean, past: boolean, date: Date, isWeekend: boolean }[] = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < offset) {
          week.push({ day: 0, blocked: true, past: false, date: new Date(), isWeekend: false }); // Placeholder for days before the month starts
        } else if (currentDate > lastDateOfMonth) {
          week.push({ day: 0, blocked: true, past: false, date: new Date(), isWeekend: false }); // Placeholder for days after the month ends
        } else {
          const date = new Date(year, month, currentDate);
          week.push({ day: currentDate, blocked: this.isBlocked(date), past: this.isPastDate(date), date: date, isWeekend: this.isWeekend(date) });
          currentDate++;
        }
      }
      calendarData.push(week);
    }

    this.calendar = calendarData;
  }

  onYearChange(): void {
    this.generateCalendar(this.selectedYear, this.selectedMonth);
  }

  onMonthChange(): void {
    this.generateCalendar(this.selectedYear, this.selectedMonth);
  }

  onDateSelected(day: number): void {
    if (day !== 0) { // Vérifiez si le jour n'est pas bloqué
      this.selectedDay = day;
      this.generateAvailableHours();
    }
  }

  generateAvailableHours(): void {
    if (this.selectedDay !== -1) { // Vérifiez si un jour est sélectionné
      const selectedDate = new Date(this.selectedYear, this.selectedMonth, this.selectedDay);
      const desiredDate = new Date(2024, 2, 3); // 3 mars 2024

      if (selectedDate.getTime() === desiredDate.getTime()) {
        // Ajoutez les heures spécifiques disponibles pour le 3 mars 2024
        this.availableHours = ['9', '10', '11', '12', '14', '15', '16']; // Supprimez les heures après 18:00 et appliquez le temps de pause
      } else {
        // Par défaut, supposons que toutes les heures sont disponibles
        this.availableHours = Array.from({ length: 24 }, (_, index) => index.toString()).filter(hour => parseInt(hour) >= 8 && parseInt(hour) <= 18);
      }
    }
  }

  // Toggle event status for a specific date
  toggleEvent(day: number): void {
    const eventKey = `${this.selectedYear}-${this.selectedMonth}-${day}`;
    if (this.events.has(eventKey)) {
      this.events.delete(eventKey);
    } else {
      this.events.add(eventKey);
    }
  }

  // Check if a date is marked as an event
  isEvent(day: number): boolean {
    const eventKey = `${this.selectedYear}-${this.selectedMonth}-${day}`;
    return this.events.has(eventKey);
  }

  // Check if a date is a weekend (Saturday or Sunday)
  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  // Check if a date is a holiday
  isHoliday(date: Date): boolean {
    const formattedDate = this.formatDate(date);
    return this.holidays.has(formattedDate);
  }

  // Check if a date is in the past
  isPastDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Remove time part
    return date < today;
  }

  // Format date as yyyy-mm-dd
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  // Method to add holiday dates to the holidays set
  addHolidays(): void {
    // Ajoutez les dates des jours fériés ici, format: 'yyyy-mm-dd'
    const holidaysList = [
      '2024-01-01', // Nouvel An
      '2024-03-20', // Fête de l'Indépendance
      '2024-05-01', // Fête du Travail
      '2024-07-25', // Fête de la République
      '2024-08-13', // Fête de la Femme
      // Ajoutez d'autres dates de jours fériés ici
    ];

    holidaysList.forEach(date => this.holidays.add(date));
  }

  // Method to navigate to the previous month
  previousMonth(): void {
    if (this.selectedMonth === 0) {
      this.selectedMonth = 11;
      this.selectedYear--;
    } else {
      this.selectedMonth--;
    }
    this.generateCalendar(this.selectedYear, this.selectedMonth);
  }

  // Method to navigate to the next month
  nextMonth(): void {
    if (this.selectedMonth === 11) {
      this.selectedMonth = 0;
      this.selectedYear++;
    } else {
      this.selectedMonth++;
    }
    this.generateCalendar(this.selectedYear, this.selectedMonth);
  }

  // Méthode pour vérifier si un jour est bloqué
  isBlocked(date: Date): boolean {
    return this.isWeekend(date) || this.isHoliday(date) || this.isPastDate(date);
  }

  // Fonction pour sélectionner l'heure
  onHourSelected(hour: string): void {
    const appointmentDate = new Date(this.selectedYear, this.selectedMonth, this.selectedDay);
    const formattedDate = this.formatDate(appointmentDate);
    // Afficher un message d'alerte confirmant le rendez-vous
    const confirmation = confirm(`Votre rendez-vous le ${formattedDate} à ${hour}h est confirmé.`);
    if (confirmation) {
      // Si confirmé, implémentez ici la logique pour traiter le rendez-vous
      console.log(`Rendez-vous confirmé le ${formattedDate} à ${hour}h.`);
    } else {
      // Si annulé, implémentez ici la logique pour annuler le rendez-vous
      console.log('Rendez-vous annulé.');
    }
  }
}
