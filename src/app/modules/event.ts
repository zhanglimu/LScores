/**
 * 提醒事件
 * Created by gaofeng on 2017/11/27.
 */

export class LiveEvent {
  public homeScore: number;
  public awayScore: number;
  public liveMatchTime: string;
  public homeRedCard: boolean;
  public homeGoal: boolean;
  public awayRedCard: boolean;
  public awayGoal: boolean;
  public homeName: string;
  public awayName: string;
  public eventLv: number;

  constructor({homeScore, awayScore, liveMatchTime, homeRedCard, homeGoal, awayRedCard, awayGoal, homeName, awayName, eventLv}) {
    this.homeScore = homeScore;
    this.awayScore = awayScore;
    this.liveMatchTime = liveMatchTime;
    this.homeRedCard = homeRedCard;
    this.homeGoal = homeGoal;
    this.awayRedCard = awayRedCard;
    this.awayGoal = awayGoal;
    this.homeName = homeName;
    this.awayName = awayName;
    this.eventLv = eventLv;
  }
}
