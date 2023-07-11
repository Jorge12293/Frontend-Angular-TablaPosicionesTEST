/**
 * PLEASE DO NOT RENAME OR REMOVE ANY OF THE CODE BELOW. 
 * YOU CAN ADD YOUR CODE TO THIS FILE TO EXTEND THE FEATURES TO USE THEM IN YOUR WORK.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { PagesRoutingModule } from './pages/pages.routing';

const routes: Routes = [
  {path:'',redirectTo:'/schedule',pathMatch:'full'},
  { path:'**',component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
