import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './app/auth.service';

export const loggedUserGuard: CanActivateFn = (route, state) => {
  const auth = inject (AuthService);
  return auth.getIsLoggedUser();
};
