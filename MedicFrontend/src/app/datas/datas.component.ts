import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datas',
  templateUrl: './datas.component.html',
  styleUrls: ['./datas.component.css']
})
export class DatasComponent implements OnInit {
  
  constructor(private auth: AuthService, private router: Router) { }
  
  admin: any = {};
  datas: any[] = [];
  isLoggedIn: boolean = false;
  addModel: any = {
    name: '',
    substance: '',
    form: ''
  };


  ngOnInit(): void {
    this.isLoggedIn = this.auth.getIsLoggedUser();
    this.auth.getLoggedUser().subscribe(admin => {
      this.admin = admin;
    });
  }

  signOut(): void {
    this.auth.signOut();
    this.router.navigate(['/signin']);
  }

  loadData(): void {

  }

  addData(): void {

  }

  updateData(data:any): void {

  }

  deleteData(data:any): void {

  }
}
