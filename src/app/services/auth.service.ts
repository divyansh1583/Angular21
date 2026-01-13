import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly API_URL = 'http://localhost:5066/api/auth';

  private readonly accessToken = signal<string | null>(this.getStoredToken());
  private readonly currentUser = signal<User | null>(this.getStoredUser());

  readonly isAuthenticated = computed(() => !!this.accessToken());
  readonly user = computed(() => this.currentUser());

  register(request: RegisterRequest) {
    return this.http.post(`${this.API_URL}/register`, request).pipe(
      catchError(this.handleError)
    );
  }

  login(request: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, request).pipe(
      tap((response) => this.handleAuthResponse(response, request.email)),
      catchError(this.handleError)
    );
  }

  logout() {
    return this.http.post(`${this.API_URL}/logout`, {}).pipe(
      tap(() => {
        this.clearAuth();
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        // Even if the API call fails, clear local auth
        this.clearAuth();
        this.router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }

  refreshToken() {
    const storedRefreshToken = localStorage.getItem('refresh_token');
    if (!storedRefreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, {
      refreshToken: storedRefreshToken,
    }).pipe(
      tap((response) => this.handleAuthResponse(response, this.currentUser()?.email || '')),
      catchError((error) => {
        this.clearAuth();
        return throwError(() => error);
      })
    );
  }

  private handleAuthResponse(response: AuthResponse, email: string): void {
    this.accessToken.set(response.accessToken);
    this.currentUser.set({ email });
    
    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);
    localStorage.setItem('user', JSON.stringify({ email }));
  }

  private clearAuth(): void {
    this.accessToken.set(null);
    this.currentUser.set(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  private getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.error?.errors) {
        const errors = Object.values(error.error.errors).flat();
        errorMessage = errors.join(', ');
      } else if (error.error?.title) {
        errorMessage = error.error.title;
      } else if (error.status === 401) {
        errorMessage = 'Invalid credentials';
      } else if (error.status === 400) {
        errorMessage = 'Invalid request. Please check your input.';
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
