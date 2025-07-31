import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Task } from '../interfaces/task.interface';
import { tap, switchMap } from 'rxjs';
import { TaskService } from '../task.service';

export enum TaskStoreState {
  Initial = 'initial',
  Loading = 'loading',
  Loaded = 'loaded',
  Error = 'error'
}

export interface TaskState {
  tasks: Task[];
  storeState: TaskStoreState;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class TaskStore extends ComponentStore<TaskState> {

  constructor(private taskService: TaskService) {
    super({ tasks: [], storeState: TaskStoreState.Initial });
  }

  readonly tasks$ = this.select(state => state.tasks);
  readonly noTasks$ = this.select(state => state.tasks.length === 0);
  readonly storeState$ = this.select(state => state.storeState);
  readonly error$ = this.select(state => state.error);

  readonly setTasks = this.updater((state, tasks: Task[]) => ({
    ...state,
    tasks
  }));

  readonly updateStoreState = this.updater((state, storeState: TaskStoreState) => ({
    ...state,
    storeState
  }));

  readonly updateError = this.updater((state, error: string) => ({
    ...state,
    error
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
      tap(() => this.updateStoreState(TaskStoreState.Loading)),
      switchMap(title =>
        this.taskService.addTask(title).pipe(
          tapResponse(
            () => {
              this.loadTasks();
              this.updateStoreState(TaskStoreState.Loaded);
            },
            err => {
              const errorMsg = (err && typeof err === 'object' && 'message' in err) ? (err as any).message : String(err);
              this.updateError(errorMsg);
              this.updateStoreState(TaskStoreState.Error);
            }
          )
        )
      )
    )
  );

  readonly toggleTask = this.effect<Task>(task$ =>
    task$.pipe(
      tap(() => this.updateStoreState(TaskStoreState.Loading)),
      switchMap(task => {
        return this.taskService.toggleTask(task).pipe(
          tapResponse(
            () => {
              this.loadTasks();
              this.updateStoreState(TaskStoreState.Loaded);
            },
            err => {
              const errorMsg = (err && typeof err === 'object' && 'message' in err) ? (err as any).message : String(err);
              this.updateError(errorMsg);
              this.updateStoreState(TaskStoreState.Error);
            }
          )
        );
      })
    )
  );

  readonly deleteTask = this.effect<number>(id$ =>
    id$.pipe(
      tap(() => this.updateStoreState(TaskStoreState.Loading)),
      switchMap(id =>
        this.taskService.deleteTask(id).pipe(
          tapResponse(
            () => {
              this.loadTasks();
              this.updateStoreState(TaskStoreState.Loaded);
            },
            err => {
              const errorMsg = (err && typeof err === 'object' && 'message' in err) ? (err as any).message : String(err);
              this.updateError(errorMsg);
              this.updateStoreState(TaskStoreState.Error);
            }
          )
        )
      )
    )
  );

  getTaskById(id: number) {
    return this.taskService.getTaskById(id);
  }
}