import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../alert.service';

@Component({
    selector: 'app-datas',
    templateUrl: './datas.component.html',
    styleUrls: ['./datas.component.css'],
    standalone: false
})
export class DatasComponent implements OnInit {
  
  constructor(private auth: AuthService, private router: Router, private http: HttpClient, private alertService: AlertService) { }
  
  admin: any = {};
  datas: any[] = [];
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

  loadData(): void {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    this.http.get('http://localhost:8000/api/allmedicine' , { headers })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.datas = response.data;
            console.log('Medicines loaded:', this.datas);
          }
        },
        error: (error) => {
          console.error('Error loading medicines:', error);
          if (error.status === 401) {
            console.log('Token:', token);
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
            this.alertService.show('Medicine added successfully');
          }
        },
        error: (error) => {
          console.error('Error adding medicine:', error);
          this.alertService.show(error.error.message || 'Error adding medicine');
        }
      });
  }

  updateMedicine(data: any): void {
    this.editingData = {...data};
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
            this.alertService.show('Medicine updated successfully');
          }
        },
        error: (error) => {
          console.error('Error updating medicine:', error);
          this.alertService.show(error.error.message || 'Error updating medicine');
        }
      });
  }

  cancelEdit(): void {
    this.editingData = null;
  }


  deleteMedicine(data:any): void {
    if (confirm('Are you sure you want to delete this medicine?')) {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      const body = { id: data.id };
      this.http.delete('http://localhost:8000/api/deletemedicine',{headers, body}).subscribe({
        next: (response: any) => {
          if (response.success) {
            console.log('Medicine deleted:', response.data);
            this.loadData();
            this.alertService.show('Medicine deleted successfully');
          }
        },
        error: (error) => {
          console.error('Error deleting medicine:', error);
          this.alertService.show(error.error.message || 'Error deleting medicine');
        }
      });
    }
  }
}
