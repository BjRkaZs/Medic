import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

interface Medication{
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
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
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
  reminders: string[] = [];

  isLoggedIn : boolean = false;
  constructor(private auth: AuthService, private fb: FormBuilder) {
    this.medicationForm = this.fb.group({
      name: '',
      form: '',
      description: '',
      stock: 0,
      dosage: 'db',      
      startDate: '',
      endDate: '',
      reminderTime: '',
      restockReminder: '',
      repeat: 1
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
      this.medicationForm.patchValue({ startDate: `${this.currentYear}-${this.currentMonth + 1}-${day}` });
    }
  }

  isToday(day: number): boolean {
    const now = new Date();
    return this.currentYear === now.getFullYear() && this.currentMonth === now.getMonth() && day === now.getDate();
  }

  addMedication(): void {
    const newMedication: Medication = {
      id: this.medications.length + 1,
      ...this.medicationForm.value
    };
    this.medications.push(newMedication);
    this.saveMedications();
    this.showForm = false;
  }

  getMedicationForDay(day: number): Medication | null {
    return this.medications.find(med => {
      if (!med.startDate) return false;
      const medicationDate = new Date(med.startDate);
      return medicationDate.getDate() === day &&
             medicationDate.getMonth() === this.currentMonth &&
             medicationDate.getFullYear() === this.currentYear;
    }) || null;
  }

  deleteMedication(medicationId: number): void {
    this.medications = this.medications.filter(med => med.id !== medicationId);
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



  weekDays: string[] = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  getDayName(day: number | null): string {
    if (day === null) return '';
    this.showForm = true;
    const date = new Date(this.currentYear, this.currentMonth, day);
    return date.toLocaleDateString('en-US', { weekday: 'long' }).slice(0, 10);
  }

  selectedRole: string = 'No repeat';
  setRole(role: string) {
    this.selectedRole = role;
  }

  addReminder(): void {
    const reminderTime = this.medicationForm.get('reminderTime')?.value;
    if (reminderTime) {
      this.reminders.push(reminderTime);
      this.medicationForm.patchValue({ reminderTime: '' });
    }
  }
  
  removeReminder(index: number): void {
    this.reminders.splice(index, 1);
  }
  
  
  signOut(): void {
    this.auth.signOut();
    this.isLoggedIn = false;
  }
}
