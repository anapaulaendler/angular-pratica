import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Task } from '../interfaces/task.interface';
import { tap, switchMap } from 'rxjs';
import { TaskService } from '../task.service';

export interface TaskState {
  tasks: Task[];
}

@Injectable({ providedIn: 'root' })
export class TaskStore extends ComponentStore<TaskState> {

  constructor(private taskService: TaskService) {
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
        this.taskService.loadTasks().pipe(
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
      switchMap(title =>
        this.taskService.addTask(title).pipe(
          tap({
            next: () => this.loadTasks(),
            error: err => console.error('Add failed', err)
          })
        )
      )
    )
  );

  readonly toggleTask = this.effect<Task>(task$ =>
    task$.pipe(
      switchMap(task => {
        return this.taskService.toggleTask(task).pipe(
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
        this.taskService.deleteTask(id).pipe(
          tap({
            next: () => this.loadTasks(),
            error: err => console.error('Delete failed', err)
          })
        )
      )
    )
  );

  getTaskById(id: number) {
    return this.taskService.getTaskById(id);
  }
}