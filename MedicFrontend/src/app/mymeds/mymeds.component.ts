import { Component, HostListener, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  constructor(private http: HttpClient, private auth: AuthService, private fb: FormBuilder) {
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
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    this.http.delete(`http://localhost:8000/api/calendar/deletemedicine`, {
      headers,
      body: { medicine_id: medicationId }
    }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.medications = this.medications.filter(med => med.id !== medicationId);
        }
      },
      error: (error) => {
        console.error('Error deleting medication:', error);
      }
    });
  }
}
