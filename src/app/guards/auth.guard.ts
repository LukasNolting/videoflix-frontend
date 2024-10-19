import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, firstValueFrom, lastValueFrom, of } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (token) {
    try {
      const response = await lastValueFrom(
        authService.getAndValidateToken(token)
      );
      console.log('Status:', response);
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  } else {
    return false;
  }
};
