import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { AlertService } from '../alert.service';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

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
  showAppointmentForm: boolean = false;
  medicationForm: FormGroup;
  appointmentForm: FormGroup;
  reminders: string[] = [];
  medicines: any[] = [];
  searchResults: any[] = [];
  showSearchResults: boolean = false;
  medicineForms: any[] = [];
  showForms: boolean = false;
  calendarEntries: any[] = [];
  currentEditId: number | null = null;
  currentAppointmentId: number | null = null;
  isSlide1Visible: boolean = true;
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
      dosage: [1, [Validators.min(1)]],
      dosage_unit: '',
      startDate: '',
      endDate: '',
      reminderTime: '',
      restock: '',
      restockReminder: '',
      repeat: [0, [Validators.min(0)]],
    });

    this.appointmentForm = this.fb.group({
      doctorname: [''],
      specialty: ['', Validators.required], 
      description2: [''],
      appointment: ['', Validators.required]
    });

    this.medicationForm.get('startDate')?.valueChanges.subscribe(() => this.calculateRestockDate());
    this.medicationForm.get('stock')?.valueChanges.subscribe(() => this.calculateRestockDate());
    this.medicationForm.get('dosage')?.valueChanges.subscribe(() => this.calculateRestockDate());
    this.medicationForm.get('repeat')?.valueChanges.subscribe(() => this.calculateRestockDate());
  }

  ngOnInit(): void {
    this.isLoggedIn = this.auth.getIsLoggedUser();
    this.updateCalendar();
    this.loadCalendarEntries();
    this.weekDays = this.translate.instant('calendar.weekDays');
    console.log('Weekdays:', this.weekDays);
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  openMedsForm(): void {
    const startDate = this.medicationForm.get('startDate')?.value;
    this.showForm = false;
    this.showMedicationForm = true;
    this.showAppointmentForm = false;
    this.medicationForm.patchValue({
      startDate: startDate,
      dosage: 'db',
      stock: 0,
      repeat: 1
    });
    this.reminders = [];
    this.currentEditId = null;
  }

  openAppointmentForm(): void {
    const formattedDateTime = `${this.medicationForm.get('startDate')?.value}T00:00`;
    this.showForm = false;
    this.showMedicationForm = false;
    this.showAppointmentForm = true;
    this.appointmentForm.patchValue({
      appointment: formattedDateTime
    });
    this.reminders = [];
    this.currentAppointmentId = null;
  }

  closeForm(): void {
    this.showForm = false;
    this.showMedicationForm = false;
    this.showAppointmentForm = false;
  }

  saveMeds(): void {
    if (this.currentEditId) {
      this.updateCalendarEntry();
    } else {
      this.addCalendarEntry();
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
                dosage_unit: entry.dosage_unit,
                startDate: entry.start_date,
                endDate: entry.end_date,
                restock: entry.restock,
                restockReminder: entry.restock_reminder,
                repeat: entry.repeat,

                doctorname: entry.doctorname,
                specialty: entry.specialty,
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
    this.showForms = false; 
  }

  onSearchContainerClick(event: Event) {
    event.stopPropagation();
  }

  onFormContainerClick(event: Event) {
    event.stopPropagation();
  }

  searchMedicine(event: any) {
    const searchTerm = event.target.value;
    this.medicationForm.patchValue({
      form: '',
      medicine_id: ''
    });
    this.medicineForms = [];
    this.showForms = false;

    if (searchTerm.length > 0) {
      const headers = this.getAuthHeaders();
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
      name: medicine.name,
      form: '',
      medicine_id: ''
    });
    this.showSearchResults = false;
    this.medicineForms = [];
    
    const headers = this.getAuthHeaders();

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

  updateCalendarEntry(): void {
    const headers = this.getAuthHeaders();

    const reminderFields: any = {};
    for (let i = 0; i < 5; i++) {
      reminderFields[`reminder_time${i + 1}`] = this.reminders[i] || null;
    }

    const formData = {
      medicine_id: this.medicationForm.get('medicine_id')?.value,
      description: this.medicationForm.get('description')?.value,
      stock: this.medicationForm.get('stock')?.value,
      dosage: this.medicationForm.get('dosage')?.value,
      dosage_unit: this.selectedDosageUnit,
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
            this.showMedicationForm = false;
            this.loadCalendarEntries();
            this.medicationForm.reset();
            this.reminders = [];
            this.currentEditId = null;
            this.alertService.show(this.translate.instant('alerts.calendar.updatesuccess'));
          } else {
            console.error('Response indicates failure:', response.body);
            this.alertService.show(this.translate.instant('alerts.calendar.updatefail'));
          }
        },
        error: (error) => {
          console.error('Error updating calendar entry:', error);
          this.alertService.show(error.error?.message || this.translate.instant('alerts.calendar.updatefail'));
        }
      });
  }

  loadCalendarEntries(): void {
    const headers = this.getAuthHeaders();

    forkJoin({
      medicines: this.http.get('http://localhost:8000/api/calendar', { headers }),
      appointments: this.http.get('http://localhost:8000/api/getappointment', { headers })
    }).subscribe({
      next: (response: any) => {
        const medicines = response.medicines.success ? response.medicines.data : [];
        const appointments = response.appointments.success ? 
        response.appointments.data.map((appointment: any) => ({
            ...appointment,
            isAppointment: true
        })) : [];
        
        this.calendarEntries = [...medicines, ...appointments];
        console.log('All entries loaded:', this.calendarEntries);
      },
      error: (error) => {
        console.error('Error loading entries:', error);
        this.alertService.show(this.translate.instant('alerts.calendar.loadfail'));
      }
    });
  }

  calculateRestockDate(): void {
    const startDate = this.medicationForm.get('startDate')?.value;
    const stock = this.medicationForm.get('stock')?.value;
    const dosage = this.medicationForm.get('dosage')?.value;
    const repeat = this.medicationForm.get('repeat')?.value;
    const reminderCount = this.reminders.length;
  
    if (startDate && stock && reminderCount > 0) {
      const dailyDoses = reminderCount * dosage;
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
  
    const currentDate = new Date(this.currentYear, this.currentMonth, day);
    currentDate.setHours(0, 0, 0, 0);
    const formattedDate = currentDate.toISOString().split('T')[0];
  
    return this.calendarEntries.filter(entry => {
      if (entry.isAppointment) {
        const appointmentDate = new Date(entry.date);
        appointmentDate.setHours(0, 0, 0, 0);
        const appointmentDateString = appointmentDate.toISOString().split('T')[0];
        return appointmentDateString === formattedDate;
      } else {
        const startDate = new Date(entry.start_date);
        const endDate = new Date(entry.end_date);
        const repeatInterval = entry.repeat || 1;
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        if (startDate.getTime() === currentDate.getTime()) {
          return true;
        }
        if (currentDate < startDate || currentDate > endDate) {
          return false;
        }
        const diffInDays = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        return diffInDays % repeatInterval === 0;
      }
    });
  }

  getDayName(day: number | null): string {
    if (day === null) return '';
    this.showForm = true;
    const date = new Date(this.currentYear, this.currentMonth, day);
    return date.toLocaleDateString('en-US', { weekday: 'long' }).slice(0, 10);
  }

  selectedStockUnit: string = '';
  displayStockUnit:string = '';
  setStockUnit(unit: string): void {
    this.selectedStockUnit = unit;
    this.translate.get(`calendar.${unit}`).subscribe(translatedUnit => {
      this.displayStockUnit = translatedUnit;
    });
  }

  selectedDosageUnit: string = '';
  displayDosageUnit:string = '';
  setDosageUnit(unit: string): void {
    this.selectedDosageUnit = unit;
    this.translate.get(`calendar.${unit}`).subscribe(translatedUnit => {
      this.displayDosageUnit = translatedUnit;
    });
    this.setStockUnit(unit);
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
      this.alertService.show(this.translate.instant('alerts.calendar.maxrem'));
    }
  }
  
  removeReminder(index: number): void {
    this.reminders.splice(index, 1);
    this.calculateRestockDate();
  }

  newPopup(selectedDay: number): void {
    this.medicationForm.reset();
    this.appointmentForm.reset();
    this.reminders = [];
    this.showForm = true;
    this.showMedicationForm = false;
    this.showAppointmentForm = false;
    this.currentEditId = null;
    this.currentAppointmentId = null;

    const month = (this.currentMonth + 1).toString().padStart(2, '0');
    const day = selectedDay.toString().padStart(2, '0');
    const formattedDate = `${this.currentYear}-${month}-${day}`;

    this.medicationForm.patchValue({
        startDate: formattedDate,
    });
  }

  addCalendarEntry(): void {
    const headers = this.getAuthHeaders();
    console.log('Form values:', this.medicationForm.value);
    console.log('Reminders:', this.reminders);
    
    const requiredFields = ['medicine_id', 'stock', 'dosage', 'dosage_unit', 'startDate', 'endDate', "restock", "restockReminder", "repeat"];
    const missingFields = requiredFields.filter(field => {
      const value = field === 'dosage_unit' 
          ? this.selectedDosageUnit 
          : this.medicationForm.get(field)?.value;
      return !value && value !== 0;
    });
    const stock = this.medicationForm.get('stock')?.value;
    const dosage = this.medicationForm.get('dosage')?.value;
    const repeat = Number(this.medicationForm.get('repeat')?.value);
    const reminderCount = this.reminders.length;
    const dailyDoses = reminderCount * dosage;
    const startDate = new Date(this.medicationForm.get('startDate')?.value);
    const endDate = new Date(this.medicationForm.get('endDate')?.value);

    if (!this.medicationForm.get('medicine_id')?.value) {
      this.alertService.show(this.translate.instant('alerts.calendar.missmed'));
      return;
    }

    if (stock <= 0) {
      this.alertService.show(this.translate.instant('alerts.calendar.stocknotzero'));
      return;
    }
    
    if (dosage <= 0) {
      this.alertService.show(this.translate.instant('alerts.calendar.dosagenotzero'));
      return;
    }
    
    if (repeat <= 0) {
      this.alertService.show(this.translate.instant('alerts.calendar.repeatnotzero'));
      return;
    }

    if (endDate < startDate) {
      this.alertService.show(this.translate.instant('alerts.calendar.enddatecheck'));
      return;
    }

    if (dailyDoses > stock) {
      this.alertService.show(this.translate.instant('alerts.calendar.dosagetoohigh'));
      return;
    }

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      this.alertService.show(this.translate.instant('alerts.calendar.missfields', {fields: missingFields.join(', ')}));
      return;
    }
  
    if (this.reminders.length === 0) {
      this.alertService.show(this.translate.instant('alerts.calendar.reminder'));
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
      dosage_unit: this.selectedDosageUnit || 'pieces',
      start_date: this.medicationForm.get('startDate')?.value,
      end_date: this.medicationForm.get('endDate')?.value,
      restock: this.medicationForm.get('restock')?.value,
      restock_reminder: this.medicationForm.get('restockReminder')?.value,
      repeat: this.medicationForm.get('repeat')?.value,
      ...reminderFields
    };

    console.log('Sending data:', formData);

    this.http.post('http://localhost:8000/api/calendar', formData, { headers, observe: 'response' })
      .subscribe({
        next: (response: any) => {
          console.log('Full response:', response);
          if (response.body?.success) {
              this.showForm = false;
              this.showMedicationForm = false; 
              this.loadCalendarEntries();
              this.medicationForm.reset();
              this.reminders = [];
              this.alertService.show(this.translate.instant('alerts.calendar.success'));
          } else {
              console.error('Response indicates failure:', response.body);
              this.alertService.show(this.translate.instant('alerts.calendar.entryfail'));
          }
      },
      error: (error) => {
          console.error('Network error details:', {
              status: error.status,
              statusText: error.statusText,
              error: error.error,
              headers: error.headers?.keys()
          });
          this.alertService.show(this.translate.instant('alerts.calendar.entryfail'));
      }
    });
  }

  editMedicine(medicine: any): void {
    this.showForm = false;
    this.showMedicationForm = true;
    this.currentEditId = medicine.id;
    this.currentAppointmentId = null;

    const dosage = medicine.dosage > 0 ? medicine.dosage : 1;
    this.medicationForm.patchValue({
      medicine_id: medicine.medicine_id,
      name: medicine.medicine.name,
      form: medicine.medicine.form,
      description: medicine.description,
      stock: medicine.stock,
      dosage: dosage,
      dosage_unit: medicine.dosage_unit,
      startDate: medicine.start_date,
      endDate: medicine.end_date,
      restock: medicine.restock,
      restockReminder: medicine.restock_reminder,
      repeat: medicine.repeat,
    });

    this.reminders = [];
    for (let i = 1; i <= 5; i++) {
      if (medicine[`reminder_time${i}`]) {
        this.reminders.push(medicine[`reminder_time${i}`]);
      }
    }
  }

  saveAppointment(): void {
    if (this.appointmentForm.valid) {
      if (this.currentAppointmentId) {
          this.updateAppointment();
      } else {
          this.addAppointment();
      }
    } else {
        this.alertService.show(this.translate.instant('alerts.calendar.reqfields'));
    } 
  }

  addAppointment(): void {
    if (this.appointmentForm.valid) {
      const headers = this.getAuthHeaders();

      const formData = {
        name: this.appointmentForm.get('doctorname')?.value,
        specialty: this.appointmentForm.get('specialty')?.value,
        description: this.appointmentForm.get('description2')?.value,
        date: this.appointmentForm.get('appointment')?.value
      };
  
      console.log('Saving doctor appointment:', formData);
  
      this.http.post('http://localhost:8000/api/addappointment', formData, { headers })
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              console.log('Appointment saved successfully:', response);
              this.showForm = false;
              this.showAppointmentForm = false;
              this.appointmentForm.reset();
              this.loadCalendarEntries();
              this.alertService.show(this.translate.instant('alerts.calendar.appsuccess'));
            }
          },
          error: (error) => {
            console.error('Error saving appointment:', error);
            this.alertService.show(error.error?.message || this.translate.instant('alerts.calendar.appfail'));
          }
        });
    } else {
      this.alertService.show(this.translate.instant('alerts.calendar.reqfields'));
    }
  }

  getAppointment(): void {
    const headers = this.getAuthHeaders();

    this.http.get('http://localhost:8000/api/getappointment', { headers })
    .subscribe({
      next: (response: any) => {
        if (response.success) {
            this.calendarEntries = response.data.map((appointment: any) => ({
                ...appointment,
                isAppointment: true
            }));
          console.log('Appointments loaded:', this.calendarEntries);
        }
      },
      error: (error) => {
          console.error('Error loading appointments:', error);
          this.alertService.show(this.translate.instant('alerts.calendar.loadfail'));
      }
    });
}

  updateAppointment(): void {
    const headers = this.getAuthHeaders();

    const formData = {
      name: this.appointmentForm.get('doctorname')?.value,
      specialty: this.appointmentForm.get('specialty')?.value,
      description: this.appointmentForm.get('description2')?.value,
      date: this.appointmentForm.get('appointment')?.value
    };

    this.http.put(`http://localhost:8000/api/editappointment/${this.currentAppointmentId}`, formData, { headers })
    .subscribe({
        next: (response: any) => {
            if (response.success) {
                this.showForm = false;
                this.showAppointmentForm = false;
                this.appointmentForm.reset();
                this.loadCalendarEntries();
                this.currentEditId = null;
                this.alertService.show(this.translate.instant('alerts.calendar.appdatesuccess'));
            }
        },
        error: (error) => {
            console.error('Error updating appointment:', error);
            this.alertService.show(error.error?.message || this.translate.instant('alerts.calendar.appdatefail'));
        }
    });
  }

  deleteAppointment(): void {
    this.alertService.showConfirm(this.translate.instant('alerts.calendar.deleteconfirm'))
    .then((confirmed) => {
      if (confirmed) {
        const headers = this.getAuthHeaders();

      this.http.delete(`http://localhost:8000/api/deleteappointment/${this.currentAppointmentId}`, { headers })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.showForm = false;
            this.showAppointmentForm = false;
            this.appointmentForm.reset();
            this.loadCalendarEntries();
            this.currentAppointmentId = null;
            this.alertService.show(this.translate.instant('alerts.calendar.deletesuccess'));
          }
        },
        error: (error) => {
          console.error('Error deleting appointment:', error);
          this.alertService.show(error.error?.message || this.translate.instant('alerts.calendar.deletefail'));
        }
      });
      }
    });
}

  editAppointment(appointment: any): void {
    this.showForm = false;
    this.showMedicationForm = false;
    this.showAppointmentForm = true;
    this.currentAppointmentId = appointment.id;
    this.currentEditId = null;
    
    this.appointmentForm.patchValue({
        doctorname: appointment.name,
        specialty: appointment.specialty,
        description2: appointment.description,
        appointment: appointment.date
    });
}

toggleSlide(slideNumber: number): void {
  this.isSlide1Visible = slideNumber === 1;
}
}
