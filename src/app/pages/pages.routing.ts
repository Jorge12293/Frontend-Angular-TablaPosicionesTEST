import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { LeaderBoardComponent } from './leader-board/leader-board.component';
import { NotFoundComponent } from '../shared/not-found/not-found.component';


const routes: Routes =[
    {
      path:'',
      component:PagesComponent,
      children:[
        { 
          path:'', 
          component: ScheduleComponent,
        },
        { 
          path:'schedule', 
          component:ScheduleComponent
        },
        { 
          path:'leaderboard', 
          component:LeaderBoardComponent
        },
        { 
          path:'**',
          component: NotFoundComponent
        },
      ]
    },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})

export class PagesRoutingModule { }