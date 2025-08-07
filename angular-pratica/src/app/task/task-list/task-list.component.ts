import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TaskStore, TaskStoreState } from '../store/task.store';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ITask } from '../interfaces/task.interface';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent implements OnInit {
  tasks$!: Observable<ITask[]>;
  noTasks$!: Observable<boolean>;
  storeState$!: Observable<TaskStoreState>;
  error$!: Observable<string | undefined>;

  public storeStates = TaskStoreState;

  constructor(
    private _taskStore: TaskStore, 
    private _dialog: MatDialog,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.tasks$ = this._taskStore.tasks$;
    this.noTasks$ = this._taskStore.noTasks$;
    this.storeState$ = this._taskStore.storeState$;
    this.error$ = this._taskStore.error$;

    this._taskStore.loadTasks();
  }

  openTaskDialog(taskId: string): void {
    this._taskStore.getTaskById(taskId);
  }
}