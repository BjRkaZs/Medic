import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-datas',
  templateUrl: './datas.component.html',
  styleUrl: './datas.component.css'
})
export class DatasComponent implements OnInit {
  medications: any = [];
  newMedication: any = {
    id: 0,
    name: ''
  };

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

  }

}
