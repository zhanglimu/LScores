import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Match} from "../modules/match";

@Component({
  selector: 'app-match-item',
  templateUrl: './match-item.component.html',
  styleUrls: ['./match-item.component.scss']
})
export class MatchItemComponent implements OnInit {

  @Input() match: Match;
  @Input() showFullTime: boolean = false;
  @Input() showCaiEx: boolean = false;
  @Output() onFollow = new EventEmitter<Match>();
  @Output() onClick = new EventEmitter<Match>();

  constructor() {
  }

  ngOnInit() {
    // 处理异常数据
    this.match.hhadHandcap = this.match.hhadHandcap ? this.match.hhadHandcap : 0;
    this.match.homeScoreHalf = this.match.homeScoreHalf ? this.match.homeScoreHalf : 0;
    this.match.awayScoreHalf = this.match.awayScoreHalf ? this.match.awayScoreHalf : 0;
    this.match.homeScore = this.match.homeScore ? this.match.homeScore : 0;
    this.match.awayScore = this.match.awayScore ? this.match.awayScore : 0;
    this.match.hadstate = this.match.hadstate ? this.match.hadstate : '-';
    this.match.hhadstate = this.match.hhadstate ? this.match.hhadstate : '-';
    this.match.crsstate = this.match.crsstate ? this.match.crsstate : '-';
    this.match.hafustate = this.match.hafustate ? this.match.hafustate : '-';
    this.match.ttgstate = this.match.ttgstate ? this.match.ttgstate : '-';
  }

  follow(): void {
    this.match.follow = !this.match.follow;
    this.onFollow.emit(this.match);
  }

  clickItem(): void {
    this.onClick.emit(this.match);
  }

  isNumber(str: any): boolean {
    return Number(str) > 0;
  }

}
