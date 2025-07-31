import { Component, OnInit } from '@angular/core';
import { Task } from '../interfaces/task.interface';
import { TaskStore } from '../store/task-store.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  tasks$ = this.taskStore.tasks$;

  constructor(private taskStore: TaskStore) {}

  ngOnInit(): void {
    this.taskStore.loadTasks();
  }

  toggleTask(task: Task): void {
    this.taskStore.toggleTask(task);
  }

  deleteTask(task: Task): void {
    this.taskStore.deleteTask(task.id);
  }
}