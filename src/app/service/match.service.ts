/**
 * Created by gaofeng on 2017/11/27.
 */
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {AppConfig} from "../const/app-config";
import {GetMatchesArgs} from "./interfaces";
import {Match} from "../modules/match";
import {Log} from "../modules/log";
import {State} from "../modules/state";

@Injectable()
export class MatchService {

  constructor(private http: Http) {
  }

  /**
   * 获取比赛列表
   * @returns {any}
   */
  getMatchList(param?: GetMatchesArgs): Promise<Match[]> {
    let url = AppConfig.baseUrl + '/sportteryInfo/matchList'
    if (param) {
      let paramStr = '?';
      for (let key in param) {
        if (param[key]) {
          if (paramStr !== '?') {
            paramStr += '&';
          }
          paramStr += (key + '=' + param[key]);
        }
      }
      url += paramStr;
    }
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  /**
   * 用于查询比赛在caiex系统中的开停售记录
   * @param matchDate
   * @param matchCode
   * @returns {Promise<any|TResult2|TResult1>}
   */
  getMatchCaiexState(matchDate: string, matchCode: string): Promise<Log[]> {
    let url = AppConfig.baseUrl + '/matchInfo/matchStateLog?matchDate=' + matchDate + '&matchCode=' + matchCode;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  /**
   * 用于匹配比赛和查询该场比赛在caiex系统中的开停售状态
   * @param matchCodes
   * @returns {Promise<any|TResult2|TResult1>}
   */
  getMatchInPlayState(matchCodes: string[]): Promise<State[]> {
    let url = AppConfig.baseUrl + '/matchInfo/liveState?matchCode=' + matchCodes.join(',');
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
