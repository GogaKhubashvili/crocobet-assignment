import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { Post } from '../models/post.interface';
import { Todo } from '../models/todo.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private ApiUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.ApiUrl}/users`);
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.ApiUrl}/posts`);
  }

  getPostsByUserId(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.ApiUrl}/posts?userId=${userId}`);
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.ApiUrl}/todos`);
  }

  getTodosByUserId(userId: number): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.ApiUrl}/todos?userId=${userId}`);
  }
}
