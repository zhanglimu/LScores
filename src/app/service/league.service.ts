/**
 * Created by gaofeng on 2017/11/27.
 */
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {LeagueGroup} from "../modules/league-group";
import {League} from "../modules/league";
import {AppConfig} from "../const/app-config";

@Injectable()
export class LeagueService {

  constructor(private http: Http) {
  }

  /**
   * 获取联赛列表
   * @returns {any}
   */
  getLeagueList(): Promise<LeagueGroup[]> {
    let selectedLeagues: string[] = JSON.parse(localStorage.getItem('SELECTED_LEAGUES')) ? JSON.parse(localStorage.getItem('SELECTED_LEAGUES')) : [];
    let initSelectedLeagues: boolean = selectedLeagues.length === 0;
    if (localStorage.getItem('LEAGUES')) {
      let leagueGroup = JSON.parse(localStorage.getItem('LEAGUES'));
      leagueGroup.map(group => {
        group.leagues.map(item => {
          if (initSelectedLeagues) {
            selectedLeagues.push(item.name);
            item.selected = true;
          }
          else {
            item.selected = selectedLeagues.indexOf(item.name) !== -1;
          }
        })
      });
      if (initSelectedLeagues) {
        localStorage.setItem('SELECTED_LEAGUES', JSON.stringify(selectedLeagues));
      }
      return Promise.resolve(leagueGroup);
    }
    return this.http.get(AppConfig.baseUrl + '/sportteryInfo/leagueList')
      .toPromise()
      .then(response => {
        let leagueGroupList: LeagueGroup[] = [];
        for (let key in response.json()) {
          let lg: LeagueGroup = new LeagueGroup();
          lg.name = key;
          lg.leagues = response.json()[key].map(item => new League(item, selectedLeagues.indexOf(item) !== -1));
          leagueGroupList.push(lg);
        }
        localStorage.setItem('LEAGUES', JSON.stringify(leagueGroupList));
        return leagueGroupList;
      })
      .catch(this.handleError);
  }


  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
