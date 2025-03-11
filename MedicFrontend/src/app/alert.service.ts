import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  show(message: string) {
    Swal.fire({
      title: 'Medicine App',
      html: message.replace(/\n/g, '<br>'),
      icon: 'info'
    });
  }
}