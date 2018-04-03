import {Match} from "./match";
/**
 * 比赛分组
 * Created by gaofeng on 2017/11/27.
 */

export class MatchGroup {
  constructor(public matchDate: string,
              public matches: Match[],
              public isExpanded: boolean = true) {
  }
}
