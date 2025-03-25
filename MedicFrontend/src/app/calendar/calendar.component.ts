import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { AlertService } from '../alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone: false
})
export class CalendarComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  today: number = new Date().getDate();
  displayedDays: (number | null)[] = [];
  selectedDay: number | null = null;
  showForm: boolean = false;
  showMedicationForm: boolean = false;
  showDoctorForm: boolean = false;
  medicationForm: FormGroup;
  doctorForm: FormGroup;
  reminders: string[] = [];
  medicines: any[] = [];
  searchResults: any[] = [];
  showSearchResults: boolean = false;
  medicineForms: any[] = [];
  showForms: boolean = false;
  calendarEntries: any[] = [];
  currentEditId: number | null = null;
  entries: { description: string; appointment: string }[] = [];
  isLoggedIn: boolean = false;
  weekDays: string[] = [];

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private http: HttpClient,
    private alertService: AlertService,
    private translate: TranslateService
  ) {
    this.medicationForm = this.fb.group({
      name: '',
      form: '',
      medicine_id: [''],
      description: '',
      stock: '',
      dosage: 'db',
      startDate: '',
      endDate: '',
      reminderTime: '',
      restock: '',
      restockReminder: '',
      repeat: [0, [Validators.min(0)]]
    });

    this.doctorForm = this.fb.group({
      doctorname: ['', Validators.required],
      category: ['', Validators.required],
      description2: ['', Validators.required],
      appointment: ['', Validators.required]
    });

    this.medicationForm.get('startDate')?.valueChanges.subscribe(() => this.calculateRestockDate());
    this.medicationForm.get('stock')?.valueChanges.subscribe(() => this.calculateRestockDate());
    this.medicationForm.get('repeat')?.valueChanges.subscribe(() => this.calculateRestockDate());
  }

  ngOnInit(): void {
    this.isLoggedIn = this.auth.getIsLoggedUser();
    this.updateCalendar();
    this.loadCalendarEntries();
    this.weekDays = this.translate.instant('calendar.weekDays');
    console.log('Weekdays:', this.weekDays);
  }

  newPopup(): void {
    this.showForm = true;
    this.showMedicationForm = false;
    this.showDoctorForm = false;
  }

  openMedsForm(): void {
    this.showForm = false;
    this.showMedicationForm = true;
    this.showDoctorForm = false;
    this.medicationForm.reset();
    this.reminders = [];
    this.currentEditId = null;
  }

  openDoctorForm(): void {
    this.showForm = false;
    this.showMedicationForm = false;
    this.showDoctorForm = true;
    this.doctorForm.reset();
    this.reminders = [];
    this.currentEditId = null;
  }

  closeForm(): void {
    this.showForm = false;
    this.showMedicationForm = false;
    this.showDoctorForm = false;
  }

  saveMeds(): void {
    if (this.currentEditId) {
      this.updateCalendarEntry();
    } else {
      this.addCalendarEntry();
    }
  }

  saveDoctor(): void {
    if (this.doctorForm.valid) {
      const formData = this.doctorForm.value;
      console.log('Saving doctor appointment:', formData);

      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });

      this.http.post('http://localhost:8000/api/appointments', formData, { headers }).subscribe({
        next: (response) => {
          console.log('Appointment saved successfully:', response);
          this.closeForm();
        },
        error: (error) => {
          console.error('Error saving appointment:', error);
          this.alertService.show('Failed to save appointment.');
        },
      });
    } else {
      console.error('Form is invalid');
      this.alertService.show('Please fill in all required fields.');
    }
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
        const month = (this.currentMonth + 1).toString().padStart(2, '0');
        const formattedDay = day.toString().padStart(2, '0');
        
        const entries = this.getEntriesForDay(day);
        if (entries.length > 0) {
            const entry = entries[0];
            this.medicationForm.patchValue({
                medicine_id: entry.medicine_id,
                name: entry.medicine.name,
                form: entry.medicine.form,
                description: entry.description,
                stock: entry.stock,
                dosage: entry.dosage,
                startDate: entry.start_date,
                endDate: entry.end_date,
                restock: entry.restock,
                restockReminder: entry.restock_reminder,
                repeat: entry.repeat,

                doctorname: entry.doctorname,
                category: entry.category,
                description2: entry.description2,
                appointment: entry.appointment,
            });
            this.reminders = [];
            for (let i = 1; i <= 5; i++) {
                if (entry[`reminder_time${i}`]) {
                    this.reminders.push(entry[`reminder_time${i}`]);
                }
            }
        } else {

            this.medicationForm.reset();
            this.medicationForm.patchValue({ 
                startDate: `${this.currentYear}-${month}-${formattedDay}`,
                dosage: 'db',
                stock: 0,
                repeat: 1
            });
            this.reminders = [];
        }
    }
}


  isToday(day: number): boolean {
    const now = new Date();
    return this.currentYear === now.getFullYear() && this.currentMonth === now.getMonth() && day === now.getDate();
  }

  @HostListener('document:click')
  hideSearchResults() {
    this.showSearchResults = false;
  }

  onSearchContainerClick(event: Event) {
    event.stopPropagation();
  }

  searchMedicine(event: any) {
    const searchTerm = event.target.value;
    if (searchTerm.length > 0) {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      this.http.get(`http://localhost:8000/api/searchmedname?name=${searchTerm}`, { headers })
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              this.searchResults = response.data;
              this.showSearchResults = true;
            }
          },
          error: (error) => {
            this.searchResults = [{name: 'Medication not available'}];
            this.showSearchResults = true;
            console.error('Error searching medicines:', error);
          }
        });
    } else {
      this.searchResults = [];
      this.showSearchResults = false;
    }
  }

  selectMedicine(medicine: any) {
    this.medicationForm.patchValue({
      name: medicine.name
    });
    this.showSearchResults = false;
    
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    this.http.get(`http://localhost:8000/api/medforms?name=${medicine.name}`, { headers })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.medicineForms = response.data;
            this.showForms = true;
          }
        },
        error: (error) => {
          console.error('Error fetching medicine forms:', error);
          this.medicineForms = [];
          this.showForms = false;
        }
      });
  }

  selectForm(form: any) {
    this.medicationForm.patchValue({
      form: form.form,
      medicine_id: form.id
    });
    this.showForms = false;
  }

  addCalendar(): void {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (!this.medicationForm.get('medicine_id')?.value) {
      this.alertService.show('Please select a medicine first');
      return;
    }

    console.log('Form values:', this.medicationForm.value);
    console.log('Reminders:', this.reminders);
    
    const requiredFields = ['medicine_id', 'stock', 'dosage', 'startDate', 'endDate'];
    const missingFields = requiredFields.filter(field => 
      !this.medicationForm.get(field)?.value
    );
  
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      this.alertService.show(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }
  
    if (this.reminders.length === 0) {
      this.alertService.show('At least one reminder time is required');
      return;
    }

    const reminderFields: any = {};

    for (let i = 0; i < 5; i++) {
      reminderFields[`reminder_time${i + 1}`] = 
          this.reminders[i] || null;
    }
  
    const formData = {
      medicine_id: this.medicationForm.get('medicine_id')?.value,
      description: this.medicationForm.get('description')?.value,
      stock: this.medicationForm.get('stock')?.value,
      dosage: this.medicationForm.get('dosage')?.value,
      start_date: this.medicationForm.get('startDate')?.value,
      end_date: this.medicationForm.get('endDate')?.value,
      restock: this.medicationForm.get('restock')?.value,
      restock_reminder: this.medicationForm.get('restockReminder')?.value,
      repeat: this.medicationForm.get('repeat')?.value,
      ...reminderFields
    };

    console.log('Sending data:', formData);
    console.log('Token:', token); 
  
    this.http.post('http://localhost:8000/api/calendar', formData, { headers, observe: 'response' })
      .subscribe({
        next: (response: any) => {
          console.log('Full response:', response);
          if (response.body?.success) {
              this.showForm = false;
              this.loadCalendarEntries();
              this.medicationForm.reset();
              this.reminders = [];
          } else {
              console.error('Response indicates failure:', response.body);
              this.alertService.show('Failed to save calendar entry');
          }
      },
      error: (error) => {
          console.error('Network error details:', {
              status: error.status,
              statusText: error.statusText,
              error: error.error,
              headers: error.headers?.keys()
          });
          this.alertService.show(`Error: ${error.error?.message || 'Failed to save calendar entry'}`);
      }
      });
      
  }

  updateCalendarEntry(): void {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const reminderFields: any = {};
    for (let i = 0; i < 5; i++) {
      reminderFields[`reminder_time${i + 1}`] = this.reminders[i] || null;
    }

    const formData = {
      medicine_id: this.medicationForm.get('medicine_id')?.value,
      description: this.medicationForm.get('description')?.value,
      stock: this.medicationForm.get('stock')?.value,
      dosage: this.medicationForm.get('dosage')?.value,
      start_date: this.medicationForm.get('startDate')?.value,
      end_date: this.medicationForm.get('endDate')?.value,
      restock: this.medicationForm.get('restock')?.value,
      restock_reminder: this.medicationForm.get('restockReminder')?.value,
      repeat: this.medicationForm.get('repeat')?.value,
      ...reminderFields
    };

    this.http.put(`http://localhost:8000/api/editcalendar/${this.currentEditId}`, formData, { headers })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.showForm = false;
            this.loadCalendarEntries();
            this.medicationForm.reset();
            this.reminders = [];
            this.currentEditId = null;
            this.alertService.show('Calendar entry updated successfully');
          }
        },
        error: (error) => {
          console.error('Error updating calendar entry:', error);
          this.alertService.show(error.error?.message || 'Failed to update calendar entry');
        }
      });
  }

  loadCalendarEntries(): void {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    this.http.get('http://localhost:8000/api/calendar', { headers })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.calendarEntries = response.data;
            console.log('Calendar entries loaded:', this.calendarEntries);
          }
        },
        error: (error) => {
          console.error('Error loading calendar entries:', error);
        }
      });
  }
  

  calculateRestockDate(): void {
    const startDate = this.medicationForm.get('startDate')?.value;
    const stock = this.medicationForm.get('stock')?.value;
    const repeat = this.medicationForm.get('repeat')?.value;
    const reminderCount = this.reminders.length;
  
    if (startDate && stock && reminderCount > 0) {
      const dailyDoses = reminderCount;
      const daysUntilRestock = Math.floor((stock / dailyDoses) * repeat);
      
      const restockDate = new Date(startDate);
      restockDate.setDate(restockDate.getDate() + daysUntilRestock);
      
      const formattedDate = restockDate.toISOString().split('T')[0];
      
      this.medicationForm.patchValue({
        restock: formattedDate
      });
    }
  }

  getDatesBetween(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);
  
    while (currentDate <= lastDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dates;
  }

  getEntriesForDay(day: number): any[] {
    if (!this.calendarEntries) return [];
  
    const currentDate = new Date(this.currentYear, this.currentMonth, day).toISOString().split('T')[0];
  
    return this.calendarEntries.filter(entry => {
      const dates = this.getDatesBetween(entry.start_date, entry.end_date);
      return dates.includes(currentDate);
    });
  }
  


  getDayName(day: number | null): string {
    if (day === null) return '';
    this.showForm = true;
    const date = new Date(this.currentYear, this.currentMonth, day);
    return date.toLocaleDateString('en-US', { weekday: 'long' }).slice(0, 10);
  }


  selectedDosageUnit: string = '';
  setDosageUnit(unit: string): void {
    this.selectedDosageUnit = unit;
    
    this.translate.get(`calendar.${unit}`).subscribe(translatedUnit => {
      this.selectedDosageUnit = translatedUnit;
      console.log('Selected dosage unit:', translatedUnit);
    });
    
  }


  selectedRole: string = 'No repeat';
  setRole(role: string) {
    this.selectedRole = role;
  }

  addReminder(): void {
    const reminderTime = this.medicationForm.get('reminderTime')?.value;
    
    if (this.reminders.length < 5 && reminderTime) {
      this.reminders.push(reminderTime);
      this.medicationForm.patchValue({ reminderTime: '' });
      this.calculateRestockDate();
    } else if (this.reminders.length >= 5) {
      alert('Maximum 5 reminders can be added.');
    }
  }
  
  
  removeReminder(index: number): void {
    this.reminders.splice(index, 1);
    this.calculateRestockDate();
  }

  addCalendarEntry(): void {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    if (!this.medicationForm.get('medicine_id')?.value) {
      this.alertService.show('Please select a medicine first');
      return;
    }

    console.log('Form values:', this.medicationForm.value);
    console.log('Reminders:', this.reminders);
    
    const requiredFields = ['medicine_id', 'stock', 'dosage', 'startDate', 'endDate'];
    const missingFields = requiredFields.filter(field => 
      !this.medicationForm.get(field)?.value
    );

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      this.alertService.show(`Please fill in: ${missingFields.join(', ')}`);
      return;
    }
  
    if (this.reminders.length === 0) {
      this.alertService.show('At least one reminder time is required');
      return;
    }

    const reminderFields: any = {};

    for (let i = 0; i < 5; i++) {
      reminderFields[`reminder_time${i + 1}`] = 
          this.reminders[i] || null;
    }
  
    const formData = {
      medicine_id: this.medicationForm.get('medicine_id')?.value,
      description: this.medicationForm.get('description')?.value,
      stock: this.medicationForm.get('stock')?.value,
      dosage: this.medicationForm.get('dosage')?.value,
      start_date: this.medicationForm.get('startDate')?.value,
      end_date: this.medicationForm.get('endDate')?.value,
      restock: this.medicationForm.get('restock')?.value,
      restock_reminder: this.medicationForm.get('restockReminder')?.value,
      repeat: this.medicationForm.get('repeat')?.value,
      appointment: this.medicationForm.get('appointment')?.value,
      ...reminderFields
    };

    this.http.post('http://localhost:8000/api/calendar', formData, { headers, observe: 'response' })
      .subscribe({
        next: (response: any) => {
          console.log('Full response:', response);
          if (response.body?.success) {
              this.showForm = false;
              this.loadCalendarEntries();
              this.medicationForm.reset();
              this.reminders = [];
          } else {
              console.error('Response indicates failure:', response.body);
              this.alertService.show('Failed to save calendar entry');
          }
      },
      error: (error) => {
          console.error('Network error details:', {
              status: error.status,
              statusText: error.statusText,
              error: error.error,
              headers: error.headers?.keys()
          });
          this.alertService.show('Failed to save calendar entry');
      }
    });
  }

  editMedicine(entry: any): void {
    this.showMedicationForm = true;
    this.currentEditId = entry.id;
    this.medicationForm.patchValue({
      medicine_id: entry.medicine_id,
      name: entry.medicine.name,
      form: entry.medicine.form,
      description: entry.description,
      stock: entry.stock,
      dosage: entry.dosage,
      startDate: entry.start_date,
      endDate: entry.end_date,
      restock: entry.restock,
      restockReminder: entry.restock_reminder,
      repeat: entry.repeat,
    });
  
    this.reminders = [];
    for (let i = 1; i <= 5; i++) {
      if (entry[`reminder_time${i}`]) {
        this.reminders.push(entry[`reminder_time${i}`]);
      }
    }
  }
}