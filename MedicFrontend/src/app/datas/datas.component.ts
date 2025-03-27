import { Component, HostListener, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../alert.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-datas',
  templateUrl: './datas.component.html',
  styleUrls: ['./datas.component.css'],
  standalone: false
})
export class DatasComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('dataTable') dataTable!: ElementRef;

  constructor(private auth: AuthService, private router: Router, private http: HttpClient, private alertService: AlertService, private translate: TranslateService) {}

  admin: any = {};
  datas: any[] = [];
  searchResults: any[] = [];
  showSearchResults: boolean = false;
  filteredDatas: any[] = [];
  searchTerm: string = '';
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isSuper: boolean = false;
  addModel: any = {
    name: '',
    form: '',
    substance: ''
  };
  editingData: any = null;

  ngOnInit(): void {
    this.isLoggedIn = this.auth.getIsLoggedUser();
    const role = parseInt(sessionStorage.getItem('role') || '0');
    this.isAdmin = role >= 1;  
    this.isSuper = role === 2; 
    this.loadData();
  }

  signOut(): void {
    this.auth.signOut();
    this.router.navigate(['/signin']);
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


  filterTable(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    console.log('Search term:', searchTerm);
    this.filteredDatas = this.datas.filter((data) =>
      data.name.toLowerCase().includes(searchTerm)
    );
    console.log('Filtered data:', this.filteredDatas);
  }

  loadData(): void {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    this.http.get('http://localhost:8000/api/allmedicine', { headers }).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.datas = response.data;
          this.filteredDatas = [...this.datas];
        }
      },
      error: (error) => {
        console.error('Error loading medicines:', error);
        if (error.status === 401) {
          this.router.navigate(['/signin']);
        }
      }
    });
  }

  addMedicine(): void {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    this.http.post('http://localhost:8000/api/addmedicine', this.addModel, { headers })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            console.log('Medicine added:', response.data);
            this.addModel = {
              name: '',
              form: '',
              substance: ''
            };
            this.loadData();
            this.alertService.show(this.translate.instant('alerts.datas.medsuccess'));
          }
        },
        error: (error) => {
          console.error('Error adding medicine:', error);
          this.alertService.show(error.error.message || this.translate.instant('alerts.datas.medfail'));
        }
      });
  }

  updateMedicine(data: any): void {
    this.editingData = { ...data };
  }

  saveMedicine(data: any): void {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    this.http.put('http://localhost:8000/api/modifymedicine', this.editingData, { headers })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            console.log('Medicine updated:', response.data);
            this.editingData = null;
            this.loadData();
            this.alertService.show(this.translate.instant('alerts.datas.medupdatesuccess'));
          }
        },
        error: (error) => {
          console.error('Error updating medicine:', error);
          this.alertService.show(error.error.message || this.translate.instant('alerts.datas.medupdatefail'));
        }
      });
  }

  cancelEdit(): void {
    this.editingData = null;
  }

  deleteMedicine(data: any): void {
    if (confirm('Are you sure you want to delete this medicine?')) {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const body = { id: data.id };
      this.http.delete('http://localhost:8000/api/deletemedicine', { headers, body }).subscribe({
        next: (response: any) => {
          if (response.success) {
            console.log('Medicine deleted:', response.data);
            this.loadData();
            this.alertService.show(this.translate.instant('alerts.datas.meddeletesuccess'));
          }
        },
        error: (error) => {
          console.error('Error deleting medicine:', error);
          this.alertService.show(error.error.message || this.translate.instant('alerts.datas.meddeletefail'));
        }
      });
    }
  }
}