import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../interfaces/task.interface';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.refreshTasks();
  }

  toggleTask(task: Task): void {
    this.taskService.toggleTask(task).subscribe(() => this.refreshTasks());
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.id).subscribe(() => this.refreshTasks());
  }

  private refreshTasks(): void {
    this.taskService.loadTasks().subscribe(tasks => this.tasks = tasks);
  }
}
