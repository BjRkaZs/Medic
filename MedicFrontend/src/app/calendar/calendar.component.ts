import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Medication {
  id: number;
  name: string;
  description: string;
  stock: number;
  dosage: number;
  startDate: string;
  endDate?: string;
  reminderTime: string;
  restockReminder: string;
  repeat: number;
  reminders: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  today: number = new Date().getDate();
  displayedDays: (number | null)[] = [];
  selectedDay: number | null = null;
  showForm: boolean = false;
  medications: Medication[] = [];
  medicationForm: FormGroup;
  user: any = {};
  admin: any = {};
  reminders: any[] = [];

  isLoggedIn : boolean = false;
  selectedMedication: Medication | null = null;

  constructor(private auth: AuthService, private fb: FormBuilder) {
    this.medicationForm = this.fb.group({
      name: ['', Validators.required],
      form: [''],
      description: [''],
      stock: [0, Validators.required],
      dosage: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reminderTime: [''],
      restockReminder: ['', Validators.required],
      repeat: [1],
      medicationName: [0, [Validators.min(0)]]

    });
    
  }

  ngOnInit(): void {
    this.isLoggedIn = this.auth.getIsLoggedUser();
    this.updateCalendar();
    this.loadMedications();
  }

  updateCalendar(): void {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    this.displayedDays = [];

    for (let i = 0; i < offset; i++) {
      this.displayedDays.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      this.displayedDays.push(day);
    }
  }

  changeMonth(offset: number): void {
    this.currentMonth += offset;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.updateCalendar();
  }

  selectDay(day: number): void {
    if (day !== null) {
      this.selectedDay = day;
      this.showForm = true;

      const medication = this.getMedicationsForDay(day)[0];

      if (medication) {
        this.medicationForm.patchValue({
          name: medication.name,
          description: medication.description,
          stock: medication.stock,
          dosage: medication.dosage,
          startDate: medication.startDate,
          endDate: medication.endDate,
          reminderTime: medication.reminderTime,
          restockReminder: medication.restockReminder,
          repeat: medication.repeat
        });
      } else {
        this.medicationForm.reset({
          startDate: `${this.currentYear}-${this.currentMonth + 1}-${day}`,
          repeat: 1
        });
      }
    }
  }

  isToday(day: number): boolean {
    const now = new Date();
    return this.currentYear === now.getFullYear() && this.currentMonth === now.getMonth() && day === now.getDate();
  }

  addMedication(): void {
    if (this.selectedMedication) {
      Object.assign(this.selectedMedication, this.medicationForm.value);
    } else {
      const newMedication: Medication = {
        id: this.medications.length + 1,
        ...this.medicationForm.value
      };
      this.medications.push(newMedication);
    }
    
    this.saveMedications();
    this.showForm = false;
    this.selectedMedication = null;
  }
  

  getMedicationsForDay(day: number): Medication[] {
    return this.medications.filter(med => {
      const medicationDate = new Date(med.startDate);
      return medicationDate.getDate() === day &&
             medicationDate.getMonth() === this.currentMonth &&
             medicationDate.getFullYear() === this.currentYear;
    });
  }

  deleteMedication(medicationId: number): void {
    const index = this.medications.findIndex(med => med.id === medicationId);
    if (index !== -1) {
      this.medications.splice(index, 1);
    }
    this.saveMedications();
  }
  

  loadMedications(): void {
    const storedMedications = localStorage.getItem('medications');
    if (storedMedications) {
      this.medications = JSON.parse(storedMedications);
    }
  }

  saveMedications(): void {
    localStorage.setItem('medications', JSON.stringify(this.medications));
  }

  weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  getDayName(day: number | null): string {
    if (day === null) return '';
    this.showForm = true;
    const date = new Date(this.currentYear, this.currentMonth, day);
    return date.toLocaleDateString('en-US', { weekday: 'long' }).slice(0, 10);
  }

  getMedNames(day: number): string[] {
    return this.medications
      .filter(med => {
        const medicationDate = new Date(med.startDate);
        return medicationDate.getDate() === day &&
               medicationDate.getMonth() === this.currentMonth &&
               medicationDate.getFullYear() === this.currentYear;
      })
      .map(med => med.name);
  }
  isNewMedication: boolean = false;
  newPopup(day: number): void {
    this.selectedDay = day;
    this.isNewMedication = true;
    this.medicationForm.reset({
      startDate: `${this.currentYear}-${this.currentMonth + 1}-${day}`,
      repeat: 1,
    });
    this.showForm = true;
  }


  openPopup(medication: Medication): void {
    this.selectedMedication = medication;
    this.isNewMedication = false;
    this.medicationForm.patchValue({
      name: medication.name,
      description: medication.description,
      stock: medication.stock,
      dosage: medication.dosage,
      startDate: medication.startDate,
      endDate: medication.endDate,
      reminderTime: medication.reminderTime,
      restockReminder: medication.restockReminder,
      repeat: medication.repeat,
    });
    this.showForm = true;
  }
  

  selectedRole: string = 'No repeat';
  setRole(role: string) {
    this.selectedRole = role;
  }
  addReminder(): void {
    const reminderTime = this.medicationForm.get('reminderTime')?.value;
    if (reminderTime && this.selectedMedication) {
      if (!this.selectedMedication.reminders) {
        this.reminders = [];
      }
      this.reminders.push({ reminderTime });
      this.medicationForm.patchValue({ reminderTime: '' });
    }
  }
  

  removeName(day: number, medication: Medication): void {
    this.medications = this.medications.filter(med => {
      const medDate = new Date(med.startDate);
      return !(medDate.getDate() === day &&
               medDate.getMonth() === this.currentMonth &&
               medDate.getFullYear() === this.currentYear &&
               med.id === medication.id);
    });
    this.saveMedications();
  }

  removeReminder(index: number): void {
    this.reminders.splice(index, 1);
  }

  signOut(): void {
    this.auth.signOut();
    this.isLoggedIn = false;
  }
}
