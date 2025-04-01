import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  public languageSignal = new BehaviorSubject<string>(
    JSON.parse(localStorage.getItem('languageSignal') ?? '"hu"')
  );

  constructor(private translate: TranslateService) { 
    this.initLanguageSubscription();
  }

  private initLanguageSubscription(): void {
    this.languageSignal.subscribe(language => {
      localStorage.setItem('languageSignal', JSON.stringify(language));
      this.translate.use(language);
      console.log('Language changed:', language);
    });
  }

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
      confirmButtonText: this.translate.instant('alerts.confirm'),
      cancelButtonText: this.translate.instant('alerts.cancel')
    }).then((result) => {
      return result.isConfirmed;
    });
  }
}