import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITask } from './interfaces/task.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly API_URL = 'http://localhost:5207/api/tasks';

  constructor(private http: HttpClient) {}

  addTask(task: ITask): Observable<ITask> {
    return this.http.post<ITask>(this.API_URL, task);
  }

  loadTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(this.API_URL);
  }

  getTaskById(id: string): Observable<ITask> {
    return this.http.get<ITask>(`${this.API_URL}/${id}`);
  }

  getNewTask(): Observable<ITask> {
    return this.http.get<ITask>(`${this.API_URL}/new`);
  }

  toggleTask(task: ITask): Observable<void> {
    const updatedTask = { ...task, completed: !task.completed };
    return this.http.put<void>(`${this.API_URL}/${task.id}`, updatedTask);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
