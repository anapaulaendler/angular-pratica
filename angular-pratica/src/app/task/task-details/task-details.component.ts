import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { TaskStore, TaskStoreState } from '../store/task.store';
import { ITask } from '../interfaces/task.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject, takeUntil, withLatestFrom } from 'rxjs';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit, OnDestroy {
  taskForm: FormGroup = this._fb.group({
    id: [''],
    title: [''],
    description: [''],
    tags: [''],
    completed: [false],
    createdAt: [''],
    updatedAt: ['']
  })

  public loading$!: Observable<boolean>;
  private _ngOnDestroy = new Subject<void>();

  constructor(
    private _store: TaskStore,
    private _fb: FormBuilder,
    @Inject(DIALOG_DATA) public taskId: string
  ) { }
  
  ngOnInit(): void {
    this.loading$ = this._store.loading$;

    this._store.getTaskById(this.taskId);

    this._store.storeState$
      .pipe(
        withLatestFrom(this._store.currentTask$),
        takeUntil(this._ngOnDestroy)
      )
      .subscribe(([state, currentTask]) => {
        switch (state) {
          case TaskStoreState.Loading:
            this.taskForm.disable();
            break;
          case TaskStoreState.Loaded:
            this.taskForm.enable();
            if (!currentTask) throw new Error('E cadê a tarefinha?');
            this.populateForm(currentTask);
            break;
          case TaskStoreState.Error:
            this.taskForm.enable();
            break;
        }
      });
  }

  populateForm(task: ITask): void {
    this.taskForm.patchValue({
      id: task.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      tags: (task.tags ?? []).join(', '),
    });
  }

  deleteTask(): void {
    this._store.deleteTask(this.taskForm.get('id')?.value);
  }

  saveTask(): void {
    const formValue = this.taskForm.value;
    const tags = formValue.tags
      ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
      : [];

    const updatedTask: ITask = {
      ...formValue, 
      tags,
    };

    this._store.updateTask(updatedTask);
    this.taskForm.markAsPristine();
  }

  ngOnDestroy(): void {
    this._ngOnDestroy.next();
    this._ngOnDestroy.complete();
  }
}