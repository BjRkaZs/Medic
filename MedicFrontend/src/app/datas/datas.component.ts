import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-datas',
  templateUrl: './datas.component.html',
  styleUrls: ['./datas.component.css']
})
export class DatasComponent implements OnInit {
  admin: any = {};
  datas: any[] = [];
  isLoggedIn: boolean = false;
  addModel: any = {
    name: '',
    substance: ''
  };

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsLoggedUser();
    this.authService.getLoggedUser().subscribe(admin => {
      this.admin = admin;
    });
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
