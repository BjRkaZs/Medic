import { Component, HostListener, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertService } from '../alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mymeds',
  standalone: false,
  templateUrl: './mymeds.component.html',
  styleUrls: ['./mymeds.component.css']
})
export class MymedsComponent implements OnInit {
  isLoggedIn: boolean = false;
  displayedMedications: any[] = [];
  searchResults: any[] = [];
  medications: any[] = [];
  showSearchResults: boolean = false;
  medSearchForm: FormGroup;
  showForm: boolean = false;
  selectedMedicine: any = null;

  constructor(private http: HttpClient, private auth: AuthService, private fb: FormBuilder, private alertService: AlertService, private translate: TranslateService) {
    this.medSearchForm = this.fb.group({
      name: ['']
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.auth.getIsLoggedUser();
    this.loadMedications();
  }

  @HostListener('document:click')
  hideSearchResults() {
    this.showSearchResults = false;
  }

  onSearchContainerClick(event: Event) {
    event.stopPropagation();
  }

  searchMedicine(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm.length > 0) {
      const localMatches = this.medications.filter(med => 
        med.medicine?.name.toLowerCase().includes(searchTerm)
      );

      if (localMatches.length === 0) {
        this.searchResults = [{ name: 'Medication not available' }];
      } else {
        this.searchResults = localMatches;
      }

      this.showSearchResults = true;
    } else {
      this.searchResults = [];
      this.showSearchResults = false;
    }
  }

  selectMedicine(medicine: any) {
    this.selectedMedicine = medicine;
    this.showSearchResults = false;

    this.scrollToMedicine(medicine.id);
  }

  scrollToMedicine(medicationId: number): void {
    const medElement = document.getElementById(`med-${medicationId}`);
    if (medElement) {
      medElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  loadMedications(): void {
    this.auth.getMedications().subscribe({
      next: (response: any) => {
        if (response.data) {
          this.medications = response.data;
        } else if (Array.isArray(response)) {
          this.medications = response;
        } else {
          this.medications = [];
        }
      },
      error: (error) => {
        console.error('Error loading medications:', error);
        this.medications = [];
      }
    });
  }

  deleteMedication(medicationId: number): void {
    if (confirm('Are you sure you want to delete this medication entry?')) {
      const token = localStorage.getItem('token');
      const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      };

      this.http.delete(`http://localhost:8000/api/deletecalendar/${medicationId}`, { headers })
      .subscribe({
          next: (response: any) => {
              if (response.success) {
                  this.medications = this.medications.filter(med => med.id !== medicationId);
                  this.alertService.show(this.translate.instant('alerts.mymeds.deletesuccess'));
              }
          },
          error: (error) => {
              console.error('Error deleting medication:', error);
              this.alertService.show(error.error?.message || this.translate.instant('alerts.mymeds.deletefail'));
          }
      });
    }
}
}
