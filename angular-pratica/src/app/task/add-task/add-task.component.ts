import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskStore, TaskStoreState } from '../store/task.store';
import { ITask } from '../interfaces/task.interface';
import { FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil, withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit, OnDestroy {
  tasks$ = this._taskStore.tasks$;

  taskForm = this._formBuilder.group({
    id: ['', Validators.required],
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    tags: [''],
    completed: [false],
  });

  private _ngOnDestroy$ = new Subject<void>();

  constructor(
    private _taskStore: TaskStore,
    private _formBuilder: FormBuilder
  ) { }

  ngOnDestroy(): void {
    this._ngOnDestroy$.next()
    this._ngOnDestroy$.complete();
  }

  ngOnInit(): void {
    this._taskStore.loadTasks();
    this._taskStore.getNewTask();

    this._taskStore.storeState$
      .pipe(withLatestFrom(this._taskStore.currentTask$), takeUntil(this._ngOnDestroy$))
      .subscribe(
        ([state, currentTask]) => {
          if (state !== TaskStoreState.Received) return;
          if (!currentTask)
            throw new Error("Current task expected!");

          this.taskForm.reset({ ...currentTask, tags: currentTask.tags?.join() });
      }
    )
  }

  addTask(): void {
    if (this.taskForm.value.title?.trim() && this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const tags = formValue.tags
      ? formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
        : [];
      
      this._taskStore.addTask({ ...formValue, tags, } as ITask);
    }
  }
}