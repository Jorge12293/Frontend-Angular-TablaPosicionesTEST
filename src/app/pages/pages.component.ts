
import { Component, OnInit } from '@angular/core';
import { zip } from 'rxjs';
import { LeagueService } from '../services/league.service';
import { Version } from '../interfaces/version.interface';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  version:Version;

  constructor(private leagueService:LeagueService) {}
  ngOnInit(): void {
    zip(
      this.leagueService.getVersion(),
      this.leagueService.fetchData()
    ).subscribe(([dataVersion,dataMatches]) => {
      this.version = dataVersion;
    });
  }

}
