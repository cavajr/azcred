import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class LogoutService {
  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.limparAccessToken();
    this.router.navigate(['/login']);
  }
}
