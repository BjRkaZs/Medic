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

  showConfirm(message: string): Promise<boolean> {
    return Swal.fire({
      title: 'Medicine App',
      html: message.replace(/\n/g, '<br>'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      return result.isConfirmed;
    });
  }
}