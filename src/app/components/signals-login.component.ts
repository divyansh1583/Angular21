import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form, Field, required, email, minLength } from '@angular/forms/signals';

@Component({
  selector: 'app-signals-login',
  standalone: true,
  imports: [CommonModule, Field],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form (submit)="onSubmit()" novalidate aria-labelledby="loginHeading">
      <h2 id="loginHeading">Sign in</h2>

      <div>
        <label>
          Email
          <input type="email" [field]="loginForm.email" aria-describedby="emailError" />
        </label>
        @if (loginForm.email().touched() && loginForm.email().invalid()) {
          <span id="emailError" class="error">{{ loginForm.email().errors()[0].message }}</span>
        }
      </div>

      <div>
        <label>
          Password
          <input type="password" [field]="loginForm.password" aria-describedby="passwordError" />
        </label>
        @if (loginForm.password().touched() && loginForm.password().invalid()) {
          <span id="passwordError" class="error">{{ loginForm.password().errors()[0].message }}</span>
        }
      </div>

      <button type="submit" [disabled]="loginForm().invalid()">Sign In</button>
    </form>
  `,
  styles: [
    `
      :host { display: block; max-width: 420px; }
      form { display:flex; flex-direction:column; gap:0.75rem }
      label { display:flex; flex-direction:column; font-weight:600 }
      input { padding:0.5rem; font-size:1rem }
      .error { color: #b00020; font-size:0.875rem }
      button[disabled] { opacity:0.6 }
    `,
  ],
})
export class SignalsLoginComponent {
  protected readonly loginModel = signal({ email: '', password: '' });

  protected readonly loginForm = form(this.loginModel, (fieldPath) => {
    required(fieldPath.email, { message: 'Email is required' });
    email(fieldPath.email, { message: 'Enter a valid email address' });
    required(fieldPath.password, { message: 'Password is required' });
    minLength(fieldPath.password, 8, { message: 'Password must be at least 8 characters' });
  });

  onSubmit() {
    if (this.loginForm().valid()) {
      const credentials = this.loginModel();
      // replace with real submit logic
      console.log('Submitting credentials', credentials);
      // For accessibility: move focus or provide feedback in a real app
    }
  }
}
