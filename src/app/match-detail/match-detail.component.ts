import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatchService} from "../service/match.service";
import {Log} from "../modules/log";
import {Match} from "../modules/match";


@Component({
  selector: 'app-match-detail',
  templateUrl: './match-detail.component.html',
  styleUrls: ['./match-detail.component.scss']
})
export class MatchDetailComponent implements OnInit, OnDestroy {

  public isShowLoading: boolean = false;
  public match: Match;
  public logs: Log[];
  public poolsZH = {
    'HAD': '胜平负',
    'HHAD': '让球胜平负',
    'CRS': '正确比分',
    'HAFU': '半全场',
    'TTG': '总进球数',
    'HAFU,CRS,TTG,HHAD,HAD': '全部玩法'
  }

  private interval;

  constructor(private matchService: MatchService) {
    this.match = JSON.parse(localStorage.getItem('ACTIVE_MATCH'))
  }

  ngOnInit() {
    this.isShowLoading = true
    this.matchService.getMatchCaiexState(this.match.matchDate, this.match.matchCode).then(res => {
      this.logs = res;
      this.isShowLoading = false

    });
    // 开启定时任务,30s刷新一次
    this.interval = setInterval(() => {
      this.matchService.getMatchCaiexState(this.match.matchDate, this.match.matchCode).then(res => {
        this.logs = res;
      })
    }, 30000);
  }

  ngOnDestroy() {
    // 关闭定时任务
    clearInterval(this.interval);
  }

}
