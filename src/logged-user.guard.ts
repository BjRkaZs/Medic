import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './app/auth.service';

export const loggedUserGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  if (auth.getIsLoggedUser()) {
    return true;
  } else {
    router.navigate(['/signin']);
    return false;
  }
};
