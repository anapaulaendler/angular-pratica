import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { HttpClient } from '@angular/common/http';
import { Task } from '../interfaces/task.interface';
import { tap, switchMap } from 'rxjs';

export interface TaskState {
  tasks: Task[];
}

@Injectable({ providedIn: 'root' })
export class TaskStore extends ComponentStore<TaskState> {
  private readonly API_URL = 'http://localhost:5207/api/tasks';

  constructor(private http: HttpClient) {
    super({ tasks: [] });
  }

  readonly tasks$ = this.select(state => state.tasks);

  readonly setTasks = this.updater((state, tasks: Task[]) => ({
    ...state,
    tasks
  }));

  readonly loadTasks = this.effect<void>(trigger$ =>
    trigger$.pipe(
      switchMap(() =>
        this.http.get<Task[]>(this.API_URL).pipe(
          tap({
            next: tasks => this.setTasks(tasks),
            error: err => console.error('Failed to load tasks', err)
          })
        )
      )
    )
  );

  readonly addTask = this.effect<string>(title$ =>
    title$.pipe(
      switchMap(title => {
        const newTask = { title, completed: false };
        return this.http.post<Task>(this.API_URL, newTask).pipe(
          tap({
            next: () => this.loadTasks(),
            error: err => console.error('Add failed', err)
          })
        );
      })
    )
  );

  readonly toggleTask = this.effect<Task>(task$ =>
    task$.pipe(
      switchMap(task => {
        const updated = { ...task, completed: !task.completed };
        return this.http.put<void>(`${this.API_URL}/${task.id}`, updated).pipe(
          tap({
            next: () => this.loadTasks(),
            error: err => console.error('Toggle failed', err)
          })
        );
      })
    )
  );

  readonly deleteTask = this.effect<number>(id$ =>
    id$.pipe(
      switchMap(id =>
        this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
          tap({
            next: () => this.loadTasks(),
            error: err => console.error('Delete failed', err)
          })
        )
      )
    )
  );

  getTaskById(id: number) {
    return this.http.get<Task>(`${this.API_URL}/${id}`);
  }
}