import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/interfaces/team.interface';
import { LeagueService } from 'src/app/services/league.service';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.scss']
})
export class LeaderBoardComponent implements OnInit {
  
  listTeam:Team[]=[];

  constructor(private leagueService:LeagueService) { }

  ngOnInit(): void {
    this.leagueService.getLeaderBoard().subscribe(
      (data:Team[])=>{
        this.listTeam=[...data];
      }
    )
  }

}
