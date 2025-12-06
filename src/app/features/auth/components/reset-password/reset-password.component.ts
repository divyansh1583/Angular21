import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, Field, required, email, minLength } from '@angular/forms/signals';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [Field, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly resetPasswordModel = signal({
    email: '',
    resetCode: '',
    newPassword: '',
  });

  readonly resetPasswordForm = form(this.resetPasswordModel, (fieldPath) => {
    required(fieldPath.email, { message: 'Email is required' });
    email(fieldPath.email, { message: 'Enter a valid email address' });
    required(fieldPath.resetCode, { message: 'Reset code is required' });
    required(fieldPath.newPassword, { message: 'New password is required' });
    minLength(fieldPath.newPassword, 6, { message: 'Password must be at least 6 characters' });
  });

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  onSubmit(): void {
    if (this.resetPasswordForm().invalid()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const request = this.resetPasswordModel();

    this.authService.resetPassword(request).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message);
      },
    });
  }
}
