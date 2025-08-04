import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { ITask } from '../interfaces/task.interface';
import { tap, switchMap, delay } from 'rxjs';
import { TaskService } from '../task.service';

export enum TaskStoreState {
  Initial = 'initial',
  Adding = 'adding',
  Added = 'added',
  Loading = 'loading',
  Loaded = 'loaded',
  Updating = 'updating',
  Updated = 'updated',
  Deleting = 'deleting',
  Deleted = 'deleted',
  Error = 'error'
}

export interface TaskState {
  tasks: ITask[];
  storeState: TaskStoreState;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class TaskStore extends ComponentStore<TaskState> {

  constructor(public _taskService: TaskService) {
    super({ tasks: [], storeState: TaskStoreState.Initial });
  }

  readonly tasks$ = this.select(state => state.tasks);
  readonly noTasks$ = this.select(state => state.tasks.length === 0);
  readonly storeState$ = this.select(state => state.storeState);
  readonly error$ = this.select(state => state.error);

  readonly setTasks = this.updater((state, tasks: ITask[]) => ({
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
        this._taskService.loadTasks().pipe(
          tap({
            next: tasks => this.setTasks(tasks),
            error: err => console.error('Failed to load tasks', err)
          })
        )
      )
    )
  );

  readonly addTask = this.effect<ITask>(task$ =>
    task$.pipe(
      tap(() => this.updateStoreState(TaskStoreState.Loading)),
      switchMap(task =>
        this._taskService.addTask(task).pipe(
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

  readonly deleteTask = this.effect<string>(id$ =>
    id$.pipe(
      tap(() => this.updateStoreState(TaskStoreState.Deleting)),
      switchMap(id =>
        this._taskService.deleteTask(id).pipe(
          tapResponse(
            () => {
              this.loadTasks();
              this.updateStoreState(TaskStoreState.Deleted);
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

  getTaskById(id: string) {
    return this._taskService.getTaskById(id);
  }

  getNewTask() {
    return this._taskService.getNewTask();
  }

  readonly updateTask = this.effect<ITask>(task$ =>
    task$.pipe(
      tap(() => this.updateStoreState(TaskStoreState.Updating)),
      switchMap(task =>
        this._taskService.updateTask(task).pipe(
          tapResponse(
            () => {
              this.loadTasks(); 
              this.updateStoreState(TaskStoreState.Updated);
            },
            err => {
              const errorMsg = (err && typeof err === 'object' && 'message' in err)
                ? (err as any).message
                : String(err);
              this.updateError(errorMsg);
              this.updateStoreState(TaskStoreState.Error);
            }
          )
        )
      )
    )
  );
}