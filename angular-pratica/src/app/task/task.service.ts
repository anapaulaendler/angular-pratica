import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from './interfaces/task.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly API_URL = 'http://localhost:5207/api/tasks';

  constructor(private http: HttpClient) {}

  addTask(title: string): Observable<Task> {
    return this.http.post<Task>(this.API_URL, { title, completed: false });
  }

  loadTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.API_URL);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.API_URL}/${id}`);
  }

  toggleTask(task: Task): Observable<void> {
    const updatedTask = { ...task, completed: !task.completed };
    return this.http.put<void>(`${this.API_URL}/${task.id}`, updatedTask);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
