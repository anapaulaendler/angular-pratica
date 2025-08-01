import { Component, OnInit } from '@angular/core';
import { ITask } from '../interfaces/task.interface';
import { TaskStore } from '../store/task-store.service';

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

  constructor(private _taskStore: TaskStore) {}

  ngOnInit(): void {
    this._taskStore.loadTasks();
  }

  toggleTask(task: ITask): void {
    this._taskStore.toggleTask(task);
  }

  deleteTask(task: ITask): void {
    this._taskStore.deleteTask(task.id);
  }
}