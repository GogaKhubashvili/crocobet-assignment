import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Todo } from '../../models/todo.interface';
import { User } from '../../models/user.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.scss',
})
export class TodosComponent implements OnInit {
  todosList = signal<Todo[]>([]);
  usersList = signal<User[]>([]);
  selectedUserId = signal<number | null>(null);
  userId = signal('');

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.userId.set(this.route.snapshot.queryParamMap.get('userId') || '');
    if (this.userId()) {
      this.selectedUserId.set(+this.userId());
      this.loadTodosByUser(+this.userId());
    } else {
      this.loadAllTodos();
    }
    this.loadUsers();
  }

  private loadAllTodos() {
    this.dataService
      .getTodos()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (todosData) => {
          this.todosList.set(todosData);
        },
      });
  }

  private loadTodosByUser(userId: number) {
    this.dataService
      .getTodosByUserId(userId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (todosData) => {
          this.todosList.set(todosData);
        },
      });
  }

  private loadUsers() {
    this.dataService
      .getUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (usersData) => {
          this.usersList.set(usersData);
        },
      });
  }
}
