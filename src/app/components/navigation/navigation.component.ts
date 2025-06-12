import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  constructor(private router: Router) {}

  navigateToUsersPage() {
    this.router.navigate(['/users']);
  }

  navigateToPostsPage() {
    this.router.navigate(['/posts']);
  }

  navigateToTodosPage() {
    this.router.navigate(['/todos']);
  }
}
