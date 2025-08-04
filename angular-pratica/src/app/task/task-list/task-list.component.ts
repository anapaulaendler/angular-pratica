import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskStore } from '../store/task-store.service';
import { ITask } from '../interfaces/task.interface';

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

  constructor(private _taskStore: TaskStore, private _router: Router) {}

  ngOnInit(): void {
    this._taskStore.loadTasks();
  }

  goToTaskDetails(task: ITask): void {
    this._router.navigate([`/${task.id}`]);
  }
}