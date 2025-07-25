import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../interfaces/task.interface';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.loadTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      this.taskService.addTask(this.newTaskTitle).subscribe(() => {
        this.refreshTasks(); // ?? ver o que fazer? se ele tá separado, precisa?
        this.newTaskTitle = '';
      });
    }
  }

  private refreshTasks(): void {
    this.taskService.loadTasks().subscribe(tasks => this.tasks = tasks);
  }
}
