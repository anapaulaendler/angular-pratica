import { Component, OnInit } from '@angular/core';
import { TaskStore } from '../store/task-store.service';
import { ITask } from '../interfaces/task.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  tasks$ = this._taskStore.tasks$;

  taskForm = this._formBuilder.group({
    id: ['', Validators.required],
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    tags: [''],
    completed: [false],
  });

  constructor(private _taskStore: TaskStore, private _formBuilder: FormBuilder, private _router: Router) {}

  ngOnInit(): void {
    this._taskStore.loadTasks();
    this.getNewTask();
  }

  addTask(): void {
    if (this.taskForm.value.title?.trim() && this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const tags = formValue.tags
      ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
      : [];
      this._taskStore.addTask({ ...formValue, tags, } as ITask);
      this.taskForm.reset();

      this._router.navigate([`/${formValue.id}`]);
    }
  }

  getNewTask(): void {
    this._taskStore.getNewTask().subscribe((task: ITask) => {
      console.log('Nova tarefinha: ', task);
      this.taskForm.patchValue({
        id: task.id,
        title: task.title,
        description: task.description,
        tags: (task.tags ?? []).join(', '),
        completed: task.completed,
      });
    });
  }
}