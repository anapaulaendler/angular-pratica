import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskStore } from '../store/task-store.service';
import { ITask } from '../interfaces/task.interface';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  taskId: string | null = null;
  taskForm: FormGroup = this._fb.group({
    title: [''],
    description: [''],
    tags: [''],
    completed: [false],
    createdAt: [''],
    updatedAt: ['']
  })

  constructor(private _activatedRoute: ActivatedRoute, private _store: TaskStore, private _fb: FormBuilder, private _router: Router) { }

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(paramMap => {
      this.taskId = paramMap.get('taskId');
      if (this.taskId) {
        this._store.getTaskById(this.taskId).subscribe((task: ITask) => {
          this.populateForm(task);
        });
      }
    });
  }

  populateForm(task: ITask): void {
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      tags: (task.tags ?? []).join(', '),
    });
  }

  deleteTask(): void {
    if (this.taskId) this._store.deleteTask(this.taskId);

    this._router.navigate([``]);
  }

  saveTask(): void {
    if (!this.taskId) return;

    const formValue = this.taskForm.value;
    const tags = formValue.tags
      ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
      : [];

    const updatedTask: ITask = {
      id: this.taskId,
      ...formValue, 
      tags,
    };

    this._store.updateTask(updatedTask); 

    this._router.navigate([``]);
  }
}