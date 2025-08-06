import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { ITask } from '../interfaces/task.interface';
import { tap, switchMap, delay, withLatestFrom, EMPTY } from 'rxjs';
import { TaskService } from '../task.service';
import { Router } from '@angular/router';

export enum TaskStoreState {
  Initial = 'initial',
  Adding = 'adding',
  Added = 'added',
  Loading = 'loading',
  Loaded = 'loaded',
  Receiving = 'receiving',
  Received = 'received',
  Updating = 'updating',
  Updated = 'updated',
  Deleting = 'deleting',
  Deleted = 'deleted',
  Error = 'error'
}

export interface TaskState {
  tasks: ITask[];
  currentTask?: ITask;
  storeState: TaskStoreState;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class TaskStore extends ComponentStore<TaskState> {

  constructor(
    public _taskService: TaskService,
    private _router: Router
  ) {
    super({ tasks: [], storeState: TaskStoreState.Initial });
  }

  readonly tasks$ = this.select(state => state.tasks);
  readonly currentTask$ = this.select(state => state.currentTask);
  readonly noTasks$ = this.select(state => state.tasks.length === 0);
  readonly storeState$ = this.select(state => state.storeState);
  readonly loading$ = this.select(state => state.storeState === TaskStoreState.Loading);
  readonly error$ = this.select(state => state.error);

  readonly setTasks = this.updater((state, tasks: ITask[]) => ({
    ...state,
    tasks
  }));

  readonly setCurrentTask = this.updater((state, currentTask: ITask) => ({
    ...state,
    currentTask
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
      switchMap(task => this._taskService.addTask(task).pipe(
          tapResponse(
            () => {
              this.updateStoreState(TaskStoreState.Loaded);
              this._router.navigate(['./']);
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

  readonly getNewTask = this.effect<void>($ =>
    $.pipe(
      tap(() => this.updateStoreState(TaskStoreState.Receiving)),
      switchMap(() =>
        this._taskService.getNewTask().pipe(
          tapResponse(
            (response) => {
              this.setCurrentTask(response);
              this.updateStoreState(TaskStoreState.Received);
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

  readonly getTaskById = this.effect<string>(id$ =>
    id$.pipe(
      tap(() => this.updateStoreState(TaskStoreState.Loading)),
      switchMap((id) =>
        this._taskService.getTaskById(id).pipe(
          delay(3000),
          tapResponse(
            (response) => {
              this.setCurrentTask(response);
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
      switchMap((id) => this._taskService.deleteTask(id).pipe(
          tapResponse(
            () => {
              this.loadTasks();
              this.updateStoreState(TaskStoreState.Deleted);
              this._router.navigate(['./']);
            },
            err => {
              const errorMsg = (err && typeof err === 'object' && 'message' in err) ? (err as any).message : String(err);
              this.updateError(errorMsg);
              this.updateStoreState(TaskStoreState.Error);
            }
            )))
    )
  );

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