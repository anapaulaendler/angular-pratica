import { Component, OnInit } from '@angular/core';
import { TaskService } from './task/task.service';
import { Task } from './task/interfaces/task.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.loadTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  toggleTask(task: Task): void {
    this.taskService.toggleTask(task).subscribe(() => this.refreshTasks());
  }

  getTaskById(task: Task): void {
    this.taskService.getTaskById(task.id).subscribe(() => this.refreshTasks());
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.id).subscribe(fetchedTask => {
      console.log('Peguei teu nariz: ', fetchedTask);
    });
  }

  private refreshTasks(): void {
    this.taskService.loadTasks().subscribe(tasks => this.tasks = tasks);
  }
}