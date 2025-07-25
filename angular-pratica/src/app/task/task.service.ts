import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from './interfaces/task.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly API_URL = 'http://localhost:5207/api/tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  addTask(title: string): Observable<Task> {
    const newTask = { title, completed: false };
    return this.http.post<Task>(this.API_URL, newTask).pipe(
      tap(() => this.loadTasks())
    );
  }

  loadTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.API_URL).pipe(
      tap(tasks => this.tasksSubject.next(tasks))
    );
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.API_URL}/${id}`);
  }

  toggleTask(task: Task): Observable<void> {
    const updatedTask = { ...task, completed: !task.completed };
    return this.http.put<void>(`${this.API_URL}/${task.id}`, updatedTask).pipe(
      tap(() => this.loadTasks())
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => this.loadTasks())
    );
  }
}
