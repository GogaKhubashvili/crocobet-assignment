import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { User } from '../../models/user.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  usersList = signal<User[]>([]);
  filteredUsersList = signal<User[]>([]);
  searchText = signal('');

  constructor(
    private dataService: DataService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.loadUsersData();
  }

  private loadUsersData() {
    this.dataService
      .getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (usersData) => {
          this.usersList.set(usersData);
          this.filteredUsersList.set(usersData);
        },
      });
  }

  getFirstNameFromFullName(fullName: string): string {
    return fullName.split(' ')[0] || '';
  }

  getLastNameFromFullName(fullName: string): string {
    const parts = fullName.split(' ');
    return parts.slice(1).join(' ') || '';
  }

  viewUserPostsBtn(userId: number) {
    this.router.navigate(['/posts'], { queryParams: { userId: userId } });
  }

  viewUserTodosBtn(userId: number) {
    this.router.navigate(['/todos'], { queryParams: { userId: userId } });
  }

  onSearchTextChange() {
    this.doFilterUsers();
  }

  private doFilterUsers() {
    const searchValue = this.searchText().toLowerCase();

    if (searchValue === '') {
      this.filteredUsersList.set(this.usersList());
      return;
    }

    const filteredResults = [];
    for (let i = 0; i < this.usersList().length; i++) {
      const currentUser = this.usersList()[i];
      const firstNamePart = this.getFirstNameFromFullName(
        currentUser.name
      ).toLowerCase();
      const lastNamePart = this.getLastNameFromFullName(
        currentUser.name
      ).toLowerCase();
      const emailPart = currentUser.email.toLowerCase();

      if (
        firstNamePart.indexOf(searchValue) !== -1 ||
        lastNamePart.indexOf(searchValue) !== -1 ||
        emailPart.indexOf(searchValue) !== -1
      ) {
        filteredResults.push(currentUser);
      }
    }

    this.filteredUsersList.set(filteredResults);
  }
}
