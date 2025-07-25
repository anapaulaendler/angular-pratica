import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTaskComponent } from './task/add-task/add-task.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '', component: AppComponent,
  },
  {
    path: 'add-task', component: AddTaskComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
