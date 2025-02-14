import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { AuthService } from './app/auth.service';

export const loggedUserGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.getIsLoggedUserObservable().pipe(
    map(isLogged => {
      if (isLogged) {
        return true;
      } else {
        router.navigate(['/signin']);
        return false;
      }
    })
  );
};
