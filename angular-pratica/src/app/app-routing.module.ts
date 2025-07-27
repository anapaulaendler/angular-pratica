import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTaskComponent } from './task/add-task/add-task.component';
import { TaskListComponent } from './task/task-list/task-list.component';

const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: 'add-task', component: AddTaskComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
