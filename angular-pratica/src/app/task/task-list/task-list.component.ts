import { Component, OnInit } from '@angular/core';
import { TaskStore, TaskStoreState } from '../store/task.store';
import { Dialog } from '@angular/cdk/dialog';
import { TaskDetailsComponent } from '../task-details/task-details.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  tasks$ = this._taskStore.tasks$;
  noTasks$ = this._taskStore.noTasks$;
  storeState$ = this._taskStore.storeState$;
  error$ = this._taskStore.error$;

  public storeStates = TaskStoreState;

  constructor(
    private _taskStore: TaskStore, 
    private _dialog: Dialog
  ) {}

  ngOnInit(): void {
    this._taskStore.loadTasks();
  }

  openTaskDialog(taskId: string): void {
    this._dialog.open(TaskDetailsComponent, {
      data: taskId,
      width: '600px',
    });
  }
}