import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { PrintService, PrintState } from './services/print.service';
import { PrintTemplateComponent } from './components/shared/print-template/print-template';
import { MaterialPassTemplateComponent } from './components/shared/material-pass-template/material-pass-template';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    PrintTemplateComponent,
    MaterialPassTemplateComponent
  ],
  template: `
    <router-outlet></router-outlet>

    <!-- Выбираем шаблон в зависимости от типа -->
    @if (printService.printState$ | async; as state) {
      @switch (state.type) {
        @case ('transfer') {
          <app-print-template [data]="state.data"></app-print-template>
        }
        @case ('pass') {
          <app-material-pass-template [data]="state.data"></app-material-pass-template>
        }
      }
    }
  `
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    public printService: PrintService
  ) {
    this.authService.initializeAuth();
  }
}