import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentDateTime = signal(new Date());
  private timeIntervalId?: number;

  constructor(private router: Router) {}

  ngOnInit() {
    this.currentDateTime.set(new Date());
    this.timeIntervalId = window.setInterval(() => {
      this.currentDateTime.set(new Date());
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timeIntervalId) {
      clearInterval(this.timeIntervalId);
    }
  }

  navigateToHomePage() {
    this.router.navigate(['/users']);
  }
}
