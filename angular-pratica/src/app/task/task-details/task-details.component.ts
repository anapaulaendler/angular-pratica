import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskStore } from '../store/task-store.service';
import { ITask } from '../interfaces/task.interface';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  taskId: string | null = null;
  task: ITask | null = null;

  constructor(private _route: ActivatedRoute, private _store: TaskStore) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(paramMap => {
      this.taskId = paramMap.get('taskId');
      if (this.taskId) {
        this._store.getTaskById(this.taskId).subscribe((task: ITask) => {
          this.task = task;
          console.log('Olha a tarefinha:', this.task);
        });
      }
    });
  }

  toggleTask(task: ITask): void {
    this._store.toggleTask(task);
  }

  deleteTask(task: ITask): void {
    this._store.deleteTask(task.id);
  }
}