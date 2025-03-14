import { Component, HostListener, OnInit } from '@angular/core';
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
            this.searchResults = [{ name: 'Medication not available' }];
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
    console.log("Selected Medicine:", medicine);
    this.showSearchResults = false;
  }

  loadMedications(): void {
    this.auth.getMedications().subscribe({
      next: (response: any) => {
        console.log('Raw response:', response);
        if (response.data) {
          console.log('Raw response:', response.data);
          this.medications = response.data;
        } else if (Array.isArray(response)) {
          this.medications = response;
        } else {
          this.medications = [];
        }
        console.log('Processed medications:', this.medications);
      },
      error: (error) => {
        console.error('Error loading medications:', error);
        this.medications = [];
      }
    });
  }

}