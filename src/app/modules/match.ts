/**
 * 比赛数据
 * Created by gaofeng on 2017/12/4.
 */
export class Match {
  constructor(public matchCode: string = '', // 比赛编号
              public matchId: string = '',  // 比赛ID
              public homeName: string = '', // 主队名称
              public awayName: string = '', // 客队名称
              public leagueName: string = '', // 联赛名称
              public matchDate: string = '0000-00-00 00:00', // 开赛时间
              public hhadHandcap: number = 0, // 让球线（1为客队让主队，-1为主队让客队）
              public matchState: string = '', // 比赛状态
              public homeScoreHalf: number = 0, // 主队半场比分
              public awayScoreHalf: number = 0, // 客队半场比分
              public homeScore: number = 0, // 主队全场比分
              public awayScore: number = 0, // 客队全场比分
              public homeRedCard: number = 0, // 主队红牌数量
              public homeYellowCard: number = 0,  // 主队黄牌数量
              public awayRedCard: number = 0, // 客队红牌数量
              public awayYellowCard: number = 0,  // 客队黄牌数量
              public liveMatchTime: string = '', // 完、未、10’(比赛进行的时间)
              public hadstate: string = '-', // HAD玩法的奖池状态
              public hhadstate: string = '-', // HHAD玩法的奖池状态
              public crsstate: string = '-', // CRS玩法的奖池状态
              public hafustate: string = '-', // HAFU玩法的奖池状态
              public ttgstate: string = '-', // TTG玩法的奖池状态
              public scoreState: number | null,  // 数据来源0为caiex
              public follow: boolean = false, //是否关注
              public contingency: boolean = false, // 偶发事件
              public events: Event[]  //比赛事件
  ) {
  }
} 

export enum Event {
  HomeGoal, // 主队进球
  HomeDisallowedGoal, //主队进球无效
  AwayGoal, // 客队进球
  AwayDisallowedGoal, // 客队进球无效
  HomeRedCard,  // 主队红牌
  AwayRedCard  // 客队红牌
}
