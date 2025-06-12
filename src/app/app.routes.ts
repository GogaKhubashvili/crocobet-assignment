import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'posts',
    loadComponent: () =>
      import('./pages/posts/posts.component').then((m) => m.PostsComponent),
  },
  {
    path: 'todos',
    loadComponent: () =>
      import('./pages/todos/todos.component').then((m) => m.TodosComponent),
  },
  { path: '**', redirectTo: '/users' },
];
