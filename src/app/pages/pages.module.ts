import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PagesComponent } from './pages.component';
import { RouterModule } from '@angular/router';
import { ScheduleComponent } from './schedule/schedule.component';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import { ThemeModule } from '../theme/theme.module';
import {  HttpClientModule } from '@angular/common/http';


const listComponents = [
  ScheduleComponent,
  LeaderBoardComponent,
  PagesComponent,
];

@NgModule({
  declarations: [
    ...listComponents
  ],
  imports: [
    CommonModule,
    RouterModule,
    ThemeModule,
    HttpClientModule
  ],
  providers: [DatePipe]
})
export class PagesModule { }
