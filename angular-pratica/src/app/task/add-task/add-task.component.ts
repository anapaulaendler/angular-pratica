import { Component, OnInit } from '@angular/core';
import { TaskStore } from '../store/task-store.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  tasks$ = this.taskStore.tasks$;
  newTaskTitle = '';

  constructor(private taskStore: TaskStore) {}

  ngOnInit(): void {
    this.taskStore.loadTasks();
  }

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      this.taskStore.addTask(this.newTaskTitle);
      this.newTaskTitle = '';
    }
  }
}
