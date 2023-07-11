import { Component, OnInit } from '@angular/core';
import { Match } from 'src/app/interfaces/match.interface';
import { LeagueService } from 'src/app/services/league.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  
  listMatch :Match[]=[];

  constructor(private leagueService:LeagueService) { }

  ngOnInit(): void {
    this.leagueService.getMatches().subscribe((dataMatch:Match[]) => {
      this.listMatch = dataMatch;
    });
  }

}
