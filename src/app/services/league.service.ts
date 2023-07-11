/**
 * A class representing a service that processes the data for match schedule
 * and generates leaderboard.
 * 
 * NOTE: MAKE SURE TO IMPLEMENT ALL EXISITNG METHODS BELOW WITHOUT CHANGING THE INTERFACE OF THEM, 
 *       AND PLEASE DO NOT RENAME, MOVE OR DELETE THIS FILE.  
 * 
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { inject } from '@angular/core';
import { Observable,BehaviorSubject,map} from 'rxjs';

import { environment } from 'src/environments/environment'
import { Version } from '../interfaces/version.interface';
import { Match } from '../interfaces/match.interface';
import { getListTeamOfListMatch } from '../helpers/league.methods';
import { Team } from '../interfaces/team.interface';

@Injectable({
  providedIn: 'root'
})

export class LeagueService {

  private dataSubjectMatches: BehaviorSubject<Match[]> = new BehaviorSubject<Match[]>([]);

  private readonly baseUrl: string= `${environment.apiUrl}/api`;
  private http = inject(HttpClient);

  constructor () {}

  /**
   * Sets the match schedule.
   * Match schedule will be given in the following form:
   * [
   *      {
   *          matchDate: [TIMESTAMP],
   *          stadium: [STRING],
   *          homeTeam: [STRING],
   *          awayTeam: [STRING],
   *          matchPlayed: [BOOLEAN],
   *          homeTeamScore: [INTEGER],
   *          awayTeamScore: [INTEGER]
   *      },
   *      {
   *          matchDate: [TIMESTAMP],
   *          stadium: [STRING],
   *          homeTeam: [STRING],
   *          awayTeam: [STRING],
   *          matchPlayed: [BOOLEAN],
   *          homeTeamScore: [INTEGER],
   *          awayTeamScore: [INTEGER]
   *      }
   * ]
   *
   * @param {Array} matches List of matches.
   */

  setMatches (matches: Match[]) {
    this.dataSubjectMatches.next(matches);
  }

  /**
   * Returns the full list of matches.
   *
   * @returns {Array} List of matches.
   */
  getMatches (): Observable<Match[]>{
    return this.dataSubjectMatches.asObservable();
  }

  /**
   * Returns the leaderBoard in a form of a list of JSON objecs.
   *
   * [
   *      {
   *          teamName: [STRING]',
   *          matchesPlayed: [INTEGER],
   *          goalsFor: [INTEGER],
   *          goalsAgainst: [INTEGER],
   *          points: [INTEGER]
   *      },
   * ]
   *
   * @returns {Array} List of teams representing the leaderBoard.
   */
   getLeaderBoard (): Observable<Team[]> {
    return this.getMatches().pipe(
      map((data:any) => {
        return getListTeamOfListMatch(data);
      })
    );
   }

  /**
   * Asynchronic function to fetch the data from the server.
   */
  async fetchData (): Promise<Match[]> {
    try {
      const response = await this.http.get<any>(`${this.baseUrl}/v1/getAllMatches`).toPromise();
      const { success, matches } = response;
      if (success) {
        this.setMatches(matches);
        return matches;
      }
      return [];
    } catch (error) {
      console.error('Error in call to get All Matches:', error);
      return null;
    }
  }

  /**
   * Asynchronic function to fetch the data version from the server.
  **/
  async getVersion(): Promise<Version> {
    try {
      const response = await this.http.get<Version>(`${this.baseUrl}/version`).toPromise();
      return response;
    } catch (error) {
      console.error('Error in call to getVersion:', error);
      throw error; 
    }
  }
}
