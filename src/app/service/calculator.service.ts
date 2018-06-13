import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {AppConfig} from "../const/app-config";
import {GetMatchesArgs} from "./interfaces";
import {Match} from "../modules/match";
import {Log} from "../modules/log";
import {State} from "../modules/state";

@Injectable()
export class CalcuService {
 param : any;
  constructor(private http: Http) {}
  getMatch(){
    return this.http.get(AppConfig.baseUrl+'/caiexlive/getMatchInfo')
    .map(res=>res.json());
}

}
