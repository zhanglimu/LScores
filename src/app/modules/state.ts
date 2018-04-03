/**
 * 彩Ex系统中比赛状态
 * Created by gaofeng on 2017/11/27.
 */

export class State {
  public matchCode: string;
  public homeScore: number;
  public awayScore: number;
  public homeScoreHafu: number;
  public awayScoreHafu: number;
  public liveMatchTime: string;
  public hadstate: string;
  public hhadstate: string;
  public crsstate: string;
  public hafustate: string;
  public ttgstate: string;
  public homeRedCard: number;
  public homeYellowCard: number;
  public awayRedCard: number;
  public awayYellowCard: number;
  public scoreState: number | null;

  constructor({matchCode, homeScore, awayScore, homeScoreHafu, awayScoreHafu, liveMatchTime, hadstate, hhadstate, crsstate, hafustate, ttgstate, homeRedCard, homeYellowCard, awayRedCard, awayYellowCard, scoreState}) {
    this.matchCode = matchCode;
    if (homeScore && homeScore.toUpperCase() !== 'VOID') {
      this.homeScore = Number(homeScore);
    } else {
      this.homeScore = 0;
    }
    if (awayScore && awayScore.toUpperCase() !== 'VOID') {
      this.awayScore = Number(awayScore);
    } else {
      this.awayScore = 0;
    }
    if (homeScoreHafu && homeScoreHafu.toUpperCase() !== 'VOID') {
      this.homeScoreHafu = Number(homeScoreHafu);
    } else {
      this.homeScoreHafu = 0;
    }
    if (awayScoreHafu && awayScoreHafu.toUpperCase() !== 'VOID') {
      this.awayScoreHafu = Number(awayScoreHafu);
    } else {
      this.awayScoreHafu = 0;
    }
    this.liveMatchTime = liveMatchTime;
    this.hadstate = hadstate;
    this.hhadstate = hhadstate;
    this.crsstate = crsstate;
    this.hafustate = hafustate;
    this.ttgstate = ttgstate;
    this.homeRedCard = homeRedCard;
    this.homeYellowCard = homeYellowCard;
    this.awayRedCard = awayRedCard;
    this.awayYellowCard = awayYellowCard;
    this.scoreState = scoreState;
  }
}
