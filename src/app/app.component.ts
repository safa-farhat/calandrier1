import { Component } from '@angular/core';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedDate: Date | null = new Date();
  availableTimeSlots: string[] = [];
  availableTimeSlotsByDate: { [date: string]: string[] } = {};

  constructor(private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('fr');

    // Initialisation de availableTimeSlotsByDate (exemple)
    const currentDate = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      const dateString = this.dateAdapter.format(date, 'yyyy-MM-dd');
      this.availableTimeSlotsByDate[dateString] = this.getAvailableTimeSlots(date);
    }
  }

  onDateSelected(date: Date | null) {
    if (date !== null) {
      const dateString = this.dateAdapter.format(date, 'yyyy-MM-dd');
      this.selectedDate = date;

      // Vérifier si des heures sont disponibles pour la date sélectionnée
      if (this.availableTimeSlotsByDate[dateString]) {
        this.availableTimeSlots = this.availableTimeSlotsByDate[dateString];
      } else {
        this.availableTimeSlots = []; // Aucune heure disponible
      }
    }
  }

  // Méthode de récupération des plages horaires disponibles pour une date donnée (exemple)
  getAvailableTimeSlots(date: Date): string[] {
    // Implementez votre logique pour obtenir les plages horaires disponibles ici
    // Par exemple, vous pouvez renvoyer des plages horaires statiques pour les jours de la semaine
    const selectedDay = date.getDay();
    if (selectedDay === 0 || selectedDay === 6) {
      return []; // Weekends are closed
    } else {
      return ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM']; // Example time slots
    }
  }

  dateClass(date: Date): string {
    if (date instanceof Date) {
      // Convertir la date en une chaîne au format yyyy-MM-dd
      const dateString = this.dateAdapter.format(date, 'yyyy-MM-dd');
      
      // Vérifier si la date est un jour de week-end
      if (date.getDay() === 0 || date.getDay() === 6) {
        return 'weekend'; // Appliquer la classe CSS pour les week-ends
      } else {
        return ''; // Pas de classe CSS spécifique pour les jours de semaine
      }
    } else {
      // Si la date n'est pas une instance de Date, ne pas appliquer de classe CSS
      return '';
    }
  }

  scheduleAppointment(timeSlot: string) {
    alert(`Rendez-vous prévu le ${this.selectedDate?.toLocaleDateString()} à ${timeSlot}`);
    this.selectedDate = null;
  }
}
