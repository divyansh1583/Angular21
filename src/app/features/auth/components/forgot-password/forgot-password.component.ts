import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, Field, required, email } from '@angular/forms/signals';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [Field, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly forgotPasswordModel = signal({
    email: '',
  });

  readonly forgotPasswordForm = form(this.forgotPasswordModel, (fieldPath) => {
    required(fieldPath.email, { message: 'Email is required' });
    email(fieldPath.email, { message: 'Enter a valid email address' });
  });

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  onSubmit(): void {
    if (this.forgotPasswordForm().invalid()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const request = this.forgotPasswordModel();

    this.authService.forgotPassword(request).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Password reset instructions have been sent to your email.');
        setTimeout(() => {
          this.router.navigate(['/reset-password']);
        }, 2000);
      },
      error: (error: Error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.message);
      },
    });
  }
}
