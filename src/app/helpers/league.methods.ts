import { Match } from "../interfaces/match.interface";
import { Team } from '../interfaces/team.interface';

/* =========================================================================
  Methods to define classifieds and positions
============================================================================ */

// Create a list of Teams ordered by games played
export const getListTeamOfListMatch = (listMatchGlobal: Match[]): Team[] => {
  let listTeamGlobal = addGamesAndPoints(listMatchGlobal)
  
  const points = listTeamGlobal.reduce((sum, team) => sum + team.points, 0);
  if(thereIsDrawOfListTeam(listTeamGlobal,'points') && points === 0 ) { // If you have not played yet, return the ordered list
    return rankTeamsEquals(listTeamGlobal);
  }

  if(thereIsDrawOfListTeam(listTeamGlobal,'points')){ // If the teams have the same score
    let listOrder = getListOrderByTeamAndMatches(listTeamGlobal,listMatchGlobal);
    return listOrder;
  }else{
    return listTeamGlobal;
  }
};


// List order by team and matches
function getListOrderByTeamAndMatches(listTeamGlobal:Team[],listMatchGlobal:Match[]) {
  let listGroupTeam = extractSubListByRepeatedAttribute(listTeamGlobal,'points'); // Group teams with the same score

  let order = listGroupTeam.map((listTeam:Team[])=>{
  
    if(listTeam.length==1){ // If it is 1 team return to the list
      return listTeam;
    }

    if(listTeam.length==2){ // If there are 2 Teams
      let listTeamTableResult = extractTableMatches(listMatchGlobal,listTeam); 
      if(!thereIsDrawOfListTeam(listTeamTableResult,'points')){   // Evaluate mini head-up table if their points are different
        return listTeamTableResult.map(teamTableResult=>{
          return listTeamGlobal.find(team=>team.teamName===teamTableResult.teamName);
        });
      }else{
        return rankTeamsEquals(listTeam); // Evaluate by stats and names
      }
    }

    if(listTeam.length>2){ // If there are more than 2 Teams
      let listTeamTableResult = extractTableMatches(listMatchGlobal,listTeam); 
      if(!thereIsDrawOfListTeam(listTeamTableResult,'points')){ // Evaluate mini head-up table if their points are different
        return listTeamTableResult.map(teamTableResult=>{
          return listTeamGlobal.find(team=>team.teamName===teamTableResult.teamName);
        });
      }else{

        let listGroupTeamSub = extractSubListByRepeatedAttribute(listTeamTableResult,'points'); // Group teams with the same score

        return listGroupTeamSub.map(listTeamSub=>{
          let listTemSumTemp = listTeamSub.map((teamSubFilter:Team)=>{
            return listTeamGlobal.find(team=>team.teamName===teamSubFilter.teamName);
          });

          if(listTemSumTemp<=2){                                                        
            // If the group is less than or equal to 2, I perform the same evaluation again.
            return getListOrderByTeamAndMatches(listTemSumTemp,listMatchGlobal);
          }else{
            return rankTeamsEquals(listTemSumTemp); // If it is greater than 3 I only order the teams
          }
        
        });
      }
    }

  }).reduce((a, b) => a.concat(b), []);

  return order.reduce((a, b) => a.concat(b), []);
}


// Extract matches from defined group
const extractTableMatches = (listMatchGlobal: Match[], listTeam:Team[] ) =>{
  let listTeamName = listTeam.map(team=>team.teamName);
  let listMatchTeam = listMatchGlobal.filter( match =>{
      let isMatch = listTeamName.indexOf(match.homeTeam) !== -1 && listTeamName.indexOf(match.awayTeam) !== -1;
      if(isMatch){
        return match;
      }
  });
  return addGamesAndPoints(listMatchTeam);
}

// Sort by table statistics
const rankTeamsEquals = (listTeam :Team[])=>{
  return listTeam.sort((teamA, teamB) => {
    // Second tiebreaker: Sort by goal difference
    if (teamB.goalsFor - teamB.goalsAgainst !== teamA.goalsFor - teamA.goalsAgainst) {
      return (teamB.goalsFor - teamB.goalsAgainst) - (teamA.goalsFor - teamA.goalsAgainst);
    }
    // Third tiebreaker: Sort by number of goals scored
    if (teamB.goalsFor !== teamA.goalsFor) {                 
      return teamB.goalsFor - teamA.goalsFor;
    }
    // Fourth tiebreaker: Sort alphabetically by team name
    return teamA.teamName.localeCompare(teamB.teamName); 
  });
}


// Extract groups of repeating by attribute of teams
const extractSubListByRepeatedAttribute = (listTeam:Team[], attribute:string)=> {
  var subList = [];
  var subListOriginal = [];
  var valuesRepeats = {};

  for (var i = 0; i < listTeam.length; i++) {
    var valueAttribute = listTeam[i][attribute];

    if (valuesRepeats[valueAttribute]) {
      subListOriginal.push(listTeam[i]);
    } else {
      if (subListOriginal.length > 0) {
        subList.push(subListOriginal);
        subListOriginal = [];
      }

      valuesRepeats[valueAttribute] = true;
      subListOriginal.push(listTeam[i]);
    }
  }
  if (subListOriginal.length > 0) {
    subList.push(subListOriginal);
  }
  return subList;
}


// Check if there is a attribute tie between teams
const thereIsDrawOfListTeam =(listTeam: Team[], attribute: string): boolean => {
  const count: { [key: string]: number } = {};
  for (const team of listTeam) {
    const valueAttribute = team[attribute];
    if (valueAttribute in count) {
      count[valueAttribute]++;
    } else {
      count[valueAttribute] = 1;
    }
  }
  for (const value in count) {
    if (count[value] > 1) {
      return true;
    }
  }
  return false;
}

// Sum of points by matches
export const addGamesAndPoints = (listMatch: Match[]): Team[] => {
    const listTeam: Team[] = [];
    const teamMap: Record<string, number> = {}; 
  
    for (const match of listMatch) {
      const { homeTeam, awayTeam, homeTeamScore, awayTeamScore,matchPlayed } = match;

      // Process Home Team
      if (homeTeam in teamMap) {
        
        const teamIndex = teamMap[homeTeam];
        const team = listTeam[teamIndex];

        listTeam[teamIndex] = {
          ...team,
          matchesPlayed: matchPlayed ? team.matchesPlayed + 1 : team.matchesPlayed + 0,
          goalsFor: matchPlayed ? team.goalsFor + homeTeamScore : team.goalsFor + 0,
          goalsAgainst:matchPlayed ? team.goalsAgainst + awayTeamScore: team.goalsAgainst + 0,
          points: matchPlayed ? team.points + getPointsTeamA(homeTeamScore, awayTeamScore) : team.points + 0,
        };

      } else {
        const newTeam: Team = {
          teamName: homeTeam,
          matchesPlayed: matchPlayed ? 1 : 0,
          goalsFor: matchPlayed ? homeTeamScore : 0,
          goalsAgainst: matchPlayed ? awayTeamScore : 0,
          points: matchPlayed ? getPointsTeamA(homeTeamScore, awayTeamScore) : 0,
        };
        listTeam.push(newTeam);
        teamMap[homeTeam] = listTeam.length - 1; 
      }
  
      // Process Home Away
      if (awayTeam in teamMap) {
        const teamIndex = teamMap[awayTeam];
        const team = listTeam[teamIndex];
        listTeam[teamIndex] = {
          ...team,
          matchesPlayed: matchPlayed ? team.matchesPlayed + 1 : team.matchesPlayed + 0,
          goalsFor: matchPlayed ? team.goalsFor + awayTeamScore : team.goalsFor + 0,
          goalsAgainst: matchPlayed ? team.goalsAgainst + homeTeamScore : team.goalsAgainst + 0,
          points: matchPlayed ? team.points + getPointsTeamA(awayTeamScore, homeTeamScore) : team.points + 0,
        };

      } else {
        const newTeam: Team = {
          teamName: awayTeam,
          matchesPlayed: matchPlayed ? 1 : 0,
          goalsFor: matchPlayed ? awayTeamScore : 0,
          goalsAgainst: matchPlayed ? homeTeamScore : 0,
          points: matchPlayed ? getPointsTeamA(awayTeamScore, homeTeamScore) : 0,
        };
        listTeam.push(newTeam);
        teamMap[awayTeam] = listTeam.length - 1;
      }
    }

    return listTeam.sort((teamA, teamB)=>teamB.points - teamA.points);
};

// Add points for Game
const getPointsTeamA = (goalsTeamA:number,goalsTeamB:number) : number=>{
    if(goalsTeamA==goalsTeamB){
        return 1;
    }
    if(goalsTeamA>goalsTeamB){
        return 3;
    }
    if(goalsTeamA<goalsTeamB){
        return 0;
    }
}
